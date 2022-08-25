import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const DailyLog = () => {
  function deficitOrSurplus(num, goal) {
    let unit;
    if (goal === 'calorie') {
        unit = 'calories'
    } else {
        unit = 'grams'
    }
    if (num >= -5 && num <= 5) {
        return `Congrats! You reached your daily ${goal} goal!`
    } else if (num < -5) {
        return `You have exceeded your daily ${goal} goal by ${-num} ${unit}.`
    } else {
        return `You have ${num} ${unit} remaining for your ${goal} goal today.`
    }
  }

  const date = new Date();
  const todayDate =
    Date().split(" ")[3] +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    Date().split(" ")[2];

  const [todaysFoods, setTodaysFoods] = useState([]);
  const [todaysCalories, setTodaysCalories] = useState(0);
  const [todaysCarbs, setTodaysCarbs] = useState(0);
  const [todaysFats, setTodaysFats] = useState(0);
  const [todaysProteins, setTodaysProteins] = useState(0);
  const [userCalories, setUserCalories] = useState(0);
  const [userCarbs, setUserCarbs] = useState(0);
  const [userFats, setUserFats] = useState(0);
  const [userProteins, setUserProteins] = useState(0);

  const { currentUser } = useAuth();
  const dayDoc = doc(db, "user-days", todayDate);
  const userDoc = doc(db, "user-goals", currentUser.uid);

  useEffect(() => {
    const getTodaysInfo = async() => {
        const dayDocSnap = await getDoc(dayDoc)

        // TODO: check to see if code below works if we delete today's day doc
        // longer-term -- do we want to find some way to automatically make a day doc once it hits midnight? is that too tricky with time zones? otherwise we will probably have to add code like this in every component that requires us to check today's day doc
        if (!dayDocSnap.exists()) {
            setDoc(dayDoc, {
              [`${currentUser.uid}`]: {
                calories: 0,
                fat: 0,
                carb: 0,
                protein: 0,
                listOfFoods: []
              },
            });
          }

        const userDocSnap = await getDoc(userDoc)
        setTodaysFoods(dayDocSnap.data()[`${currentUser.uid}`].listOfFoods)
        setTodaysCalories(dayDocSnap.data()[`${currentUser.uid}`].calories)
        setTodaysCarbs(dayDocSnap.data()[`${currentUser.uid}`].carb)
        setTodaysFats(dayDocSnap.data()[`${currentUser.uid}`].fat)
        setTodaysProteins(dayDocSnap.data()[`${currentUser.uid}`].protein)
        setUserCalories(userDocSnap.data().dailyCalories)
        setUserCarbs(userDocSnap.data().dailyCarbs)
        setUserFats(userDocSnap.data().dailyFat)
        setUserProteins(userDocSnap.data().dailyProtein)
    }
    getTodaysInfo()
  });

  return (
      <div>
      <h3>
        Foods Consumed Today:
      </h3>
      <ul>
        {todaysFoods.map((food) => {
            return (
                <li>
                    {food}
                </li>
            )
        })}
      </ul>
      <h3>
        Progress Toward Goals:
      </h3>
      <h5>
        Calories: {todaysCalories} calories consumed. {deficitOrSurplus(userCalories - todaysCalories, 'calorie')}
      </h5>
      <h5>
        Carbs: {todaysCarbs} grams consumed. {deficitOrSurplus(userCarbs - todaysCarbs, 'carb')}
      </h5>
      <h5>
        Fats: {todaysFats} grams consumed. {deficitOrSurplus(userFats - todaysFats, 'fat')}
      </h5>
      <h5>
        Proteins: {todaysProteins} grams consumed. {deficitOrSurplus(userProteins - todaysProteins, 'protein')}
      </h5>
    </div>
  );
};

export default DailyLog;
