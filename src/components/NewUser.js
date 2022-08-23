import React, { useState, useEffect } from 'react';
import { db } from '../firebase'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const NewUser = () => {
    function CalculateBMRAndActivityLevel(activityLevel, heightFeet, heightInches, weight, assignedSex, age) {
        // if (activityLevel === '') {
        //    alert('Please enter activity level')
        // }
        // if (heightFeet === 0) {
        //     alert('Please enter height')
        // }
        // if (weight === 0) {
        //    alert('Please enter weight')
        // }
        // if (assignedSex === '') {
        //     alert('Please enter assigned sex')
        // }
        // if (age < 18) {
        //     alert('Please enter an age over 18')
        // }
        let weightCalc = 10 * (weight / 2.2)
        let feetInInches = heightFeet * 12
        let totalInches = Number(feetInInches) + Number(heightInches)
        let heightInCm = totalInches * 2.54
        let ageCalc = 5 * age
        let incompleteBMR = (weightCalc) + (6.25 * heightInCm) - (ageCalc)
        if (assignedSex === "Male") {
            incompleteBMR += 5
        } 
        if (assignedSex === "Female") {
            incompleteBMR -= 161
        } 
        let TDEE = incompleteBMR
        switch (activityLevel) {
            case 'Not active':
                TDEE *= 1.2
                break;
            case 'Lightly active':
                TDEE *= 1.375
                break;
            case 'Moderately active':
                TDEE *= 1.55
                break;
            case 'Very active':
                TDEE *= 1.725
                break;
            case 'Extra active':
                TDEE *= 1.9
                break;
            default:
                TDEE = TDEE
        }
        let dailyCalories;
        switch (goal) {
            case 'General well-being':
                dailyCalories = TDEE
                break;
            case 'Weight loss':
                dailyCalories = TDEE - 500
                break;
            case 'Muscle gain':
                dailyCalories = TDEE + 500
                break;
            case 'High-performance athlete':
                dailyCalories = TDEE + 1000
                break;
            default:
                dailyCalories = TDEE
        }

        let dailyCarbs = (dailyCalories * .55) / 4
        let dailyFat = (dailyCalories * .27) / 4
        let dailyProtein = (dailyCalories * .18) / 9

        const { currentUser } = useAuth();

        const userDoc = doc(db, 'user-goals', currentUser.uid)
        updateDoc(userDoc, { dailyCalories, dailyCarbs, dailyFat, dailyProtein })

        //if person wants general well-being, daily calories should be same amount as TDEE
        //if they want to drop 1 pound per week, they need a daily calorie deficit of 500, so TDEE-500
        //if they want to add 1 pound per week, they need a daily calorie surplus of 500, so TDEE+500
    }
    const [goal, setGoal] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [heightFeet, setHeightFeet] = useState(0);
    const [heightInches, setHeightInches] = useState(0);
    const [weight, setWeight] = useState(0);
    const [age, setAge] = useState(0);
    const [assignedSex, setAssignedSex] = useState('');
    let navigate = useNavigate();

    function handleSubmit(evt) {
        evt.preventDefault()
        navigate('/')
    }

    return (
        <div>
            {/* put a form with 4 categories:
            goal, activity level, sex/age/location,
            current height/weight, goal weight */}

            {/* once they hit submit (onClick), have
            a popup of suggested numbers */}
            <form id="newUser-info" onSubmit={handleSubmit}>
                <div>
                    Choose Your Goal:
                    <select id="filterGoal"
                    value={goal}
                    // probably need to do useState
                    onChange={(e) => setGoal(e.target.value)}
                    >
                        <option value="" disabled hidden>Choose one</option>
                        <option value="General well-being">General well-being</option>
                        <option value="Weight loss">Weight loss</option>
                        <option value="Muscle gain">Muscle gain</option>
                        <option value="High-performance athlete">High-performance athlete</option>
                        {/* depending on what is selected, alter goal calculations */}

                        {/* 3 or 4 different calculations dependinng on user's goal */}
                    </select>
                </div>
                <div>
                    Activity Level:
                    <select id="filterActivityLevel"
                    value={activityLevel}
                    // probably need to do useState
                    onChange={(e) => setActivityLevel(e.target.value)}
                    >
                        <option value="" disabled hidden>Choose one</option>
                        <option value="Not active">Not active</option>
                        <option value="Lightly active">Lightly active</option>
                        <option value="Moderately active">Moderately active</option>
                        <option value="Very active">Very active</option>
                        <option value="Extra active">Extra active</option>
                        {/* depending on what is selected, alter goal calculations */}

                        {/* 3 or 4 different calculations dependinng on user's goal */}
                    </select>
                </div>
                <label>
                    Height
                    <input
                    type='number'
                    placeholder='Feet'
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    >
                        {/* in onchange, convert from ft & inches to just inches */}

                        {/* could do drag bar for height/weight or let people put in number in ft & inches and we can calculate */}
                    </input>
                    <input
                    type='number'
                    placeholder='Inches'
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}>
                    </input>
                </label>
                <label>
                    Weight
                    <input
                    type='number'
                    placeholder='Pounds'
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    >
                        {/* could do drag bar for height/weight or let people put in number in ft & inches and we can calculate */}
                    </input>
                </label>
                <label>
                    Age
                    <input
                    type='number'
                    placeholder='Age'
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    >
                        {/* could do drag bar for height/weight or let people put in number in ft & inches and we can calculate */}
                    </input>
                </label>
                <div>
                    Assigned Sex at Birth:
                    <select id="assigned-sex"
                    value={assignedSex}
                    // probably need to do useState
                    onChange={(e) => setAssignedSex(e.target.value)}
                    >
                        <option value="" disabled hidden>Choose one</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                    </select>
                </div>
                <button type='submit' onClick={
                    CalculateBMRAndActivityLevel(activityLevel, heightFeet, heightInches, weight, assignedSex, age
                        )}>Submit</button>
            </form> 
        </div>
    )
}

export default NewUser