import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const DailyLog = () => {
  //map over user DB of inputed info
  //list what food they ate today
  const date = new Date();
  const todayDate =
    Date().split(" ")[3] +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    Date().split(" ")[2];

//   const dayDoc = doc(db, "user-days", todayDate);
//   console.log(dayDoc)

  //give breakdown of cal, carbs, fat, protein for today


  const [todaysFoods, setTodaysFoods] = useState([]);
  const [todaysCalories, setTodaysCalories] = useState(0);
  const [todaysCarbs, setTodaysCarbs] = useState(0);
  const [todaysFats, setTodaysFats] = useState(0);
  const [todaysProteins, setTodaysProteins] = useState(0);

  const { currentUser } = useAuth();
//   const userDaysCollectionRef = collection(db, 'user-days')
  const dayDoc = doc(db, "user-days", todayDate);

  useEffect(() => {
    const getTodaysInfo = async() => {
        const docSnap = await getDoc(dayDoc)
        setTodaysFoods(docSnap.data()[`${currentUser.uid}`].listOfFoods)
        setTodaysCalories(docSnap.data()[`${currentUser.uid}`].calories)
        setTodaysCarbs(docSnap.data()[`${currentUser.uid}`].carb)
        setTodaysFats(docSnap.data()[`${currentUser.uid}`].fat)
        setTodaysProteins(docSnap.data()[`${currentUser.uid}`].protein)
    }
    getTodaysInfo()
    // getTodaysCalories()
  });

  let navigate = useNavigate();

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
        Calories: {todaysCalories} calories
      </h5>
      <h5>
        Carbs: {todaysCarbs} g
      </h5>
      <h5>
        Fats: {todaysFats} g
      </h5>
      <h5>
        Proteins: {todaysProteins} g
      </h5>
    </div>
  );
};

export default DailyLog;
