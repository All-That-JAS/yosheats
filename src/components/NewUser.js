import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Badge from 'react-bootstrap/Badge';

const NewUser = () => {
  function CalculateBMRAndActivityLevel(
    activityLevel,
    heightFeet,
    heightInches,
    weight,
    assignedSex,
    age
  ) {
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
    let weightCalc = 10 * (weight / 2.2);
    let feetInInches = heightFeet * 12;
    let totalInches = Number(feetInInches) + Number(heightInches);
    let heightInCm = totalInches * 2.54;
    let ageCalc = 5 * age;
    let incompleteBMR = weightCalc + 6.25 * heightInCm - ageCalc;
    if (assignedSex === 'Male') {
      incompleteBMR += 5;
    }
    if (assignedSex === 'Female') {
      incompleteBMR -= 161;
    }
    let TDEE = incompleteBMR;
    switch (activityLevel) {
      case 'Not active':
        TDEE *= 1.2;
        break;
      case 'Lightly active':
        TDEE *= 1.375;
        break;
      case 'Moderately active':
        TDEE *= 1.55;
        break;
      case 'Very active':
        TDEE *= 1.725;
        break;
      case 'Extra active':
        TDEE *= 1.9;
        break;
      default:
        TDEE = TDEE;
    }
    let dailyCalories;
    switch (goal) {
      case 'General well-being':
        dailyCalories = Math.round(TDEE);
        break;
      case 'Weight loss':
        dailyCalories = Math.round(TDEE - 500);
        break;
      case 'Muscle gain':
        dailyCalories = Math.round(TDEE + 500);
        break;
      case 'High-performance athlete':
        dailyCalories = Math.round(TDEE + 1000);
        break;
      default:
        dailyCalories = Math.round(TDEE);
    }

    let dailyCarbs = Math.round((dailyCalories * 0.55) / 4);
    let dailyFat = Math.round((dailyCalories * 0.27) / 4);
    let dailyProtein = Math.round((dailyCalories * 0.18) / 9);

    const { currentUser } = useAuth();

    const userDoc = doc(db, 'user-goals', currentUser.uid);
    updateDoc(userDoc, { dailyCalories, dailyCarbs, dailyFat, dailyProtein });

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
    evt.preventDefault();
    alert('Success! Check your dashboard for your daily nutritional goals.');

    navigate('/');
  }

  return (
    <>
      {/* put a form with 4 categories:
            goal, activity level, sex/age/location,
            current height/weight, goal weight */}

      {/* once they hit submit (onClick), have
            a popup of suggested numbers */}

      <Form className='newUser-info' onSubmit={handleSubmit}>
        <h1 className='ms-5 mt-5' >
          <Badge pill bg='dark'>New User Profile</Badge>
        </h1>
        <h4 className='pt-2'>
          <Badge bg='secondary'>
            Input information for personalized daily nutritional goals
          </Badge>
        </h4>
        {/* <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control type='email' placeholder='Enter email' />
          <Form.Text className='text-muted'>
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group> */}

        <FloatingLabel
          controlId='floatingSelect'
          label='Choose Your Goal:'
          className='m-3'
        >
          <Form.Select
            aria-label='Floating label select example'
            id='filterGoal'
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value='' disabled hidden></option>
            <option value='General well-being'>General well-being</option>
            <option value='Weight loss'>Weight loss</option>
            <option value='Muscle gain'>Muscle gain</option>
            <option value='High-performance athlete'>
              High-performance athlete
            </option>
            {/* depending on what is selected, alter goal calculations */}

            {/* 3 or 4 different calculations dependinng on user's goal */}
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel
          controlId='floatingSelectGrid'
          label='Activity Level'
          className='m-3'
        >
          <Form.Select
            aria-label='Floating label select example'
            id='filterActivityLevel'
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
          >
            <option value='' disabled hidden></option>
            <option value='Not active'>Not active</option>
            <option value='Lightly active'>Lightly active</option>
            <option value='Moderately active'>Moderately active</option>
            <option value='Very active'>Very active</option>
            <option value='Extra active'>Extra active</option>
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel
          controlId='floatingSelectGrid'
          label='Assigned Sex at Birth:'
          className='m-3'
        >
          <Form.Select
            aria-label='Floating label select example'
            id='assigned-sex'
            value={assignedSex}
            onChange={(e) => setAssignedSex(e.target.value)}
          >
            <option value='' disabled hidden></option>
            <option value='Female'>Female</option>
            <option value='Male'>Male</option>
          </Form.Select>
        </FloatingLabel>
        <br></br>
        <Row>
          <InputGroup className='mb-3'>
            <InputGroup.Text style={{ minWidth: '13vh' }}>
              Height (ft)
            </InputGroup.Text>
            <Form.Control
              aria-label='Dollar amount (with dot and two decimal places)'
              type='number'
              placeholder='Feet'
              value={heightFeet}
              onChange={(e) => setHeightFeet(e.target.value)}
            />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Text style={{ minWidth: '13vh' }}>
              Height (in)
            </InputGroup.Text>
            <Form.Control
              aria-label='Dollar amount (with dot and two decimal places)'
              type='number'
              placeholder='Inches'
              value={heightInches}
              onChange={(e) => setHeightInches(e.target.value)}
            />
          </InputGroup>

          {/* in onchange, convert from ft & inches to just inches */}
          {/* could do drag bar for height/weight or let people put in number in ft & inches and we can calculate */}

          <InputGroup className='mb-3'>
            <InputGroup.Text style={{ minWidth: '13vh' }}>
              Weight
            </InputGroup.Text>
            <Form.Control
              aria-label='Dollar amount (with dot and two decimal places)'
              type='number'
              placeholder='Pounds'
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Text style={{ minWidth: '13vh' }}>Age</InputGroup.Text>
            <Form.Control
              aria-label='Dollar amount (with dot and two decimal places)'
              type='number'
              placeholder='Age'
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </InputGroup>
        </Row>

        <br></br>
        <Button
          variant='dark'
          type='submit'
          className=''
          onClick={CalculateBMRAndActivityLevel(
            activityLevel,
            heightFeet,
            heightInches,
            weight,
            assignedSex,
            age
          )}
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default NewUser;
