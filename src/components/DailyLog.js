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
    const getTodaysFoods = async() => {
        //instead, I need to get the single doc for today
        //then I need to grab the object for currentUser
        //then I need to map over the food items in listofFoods
        const docSnap = await getDoc(dayDoc)
        setTodaysFoods(docSnap.data()[`${currentUser.uid}`].listofFoods)
    }
    getTodaysFoods()
    // const docSnap = await getDoc(dayDoc)
  }, []);

  let navigate = useNavigate();

  return (
    <div>
      <h3>
        Foods Consumed Today:
      </h3>
      <ul>
        <li>
            {console.log(todaysFoods)}
            Candy
        </li>
      </ul>
      <h3>
        Progress Toward Goals:
      </h3>
      <h5>
        Calories:
      </h5>
      <h5>
        Carbs:
      </h5>
      <h5>
        Fats:
      </h5>
      <h5>
        Proteins:
      </h5>
    </div>
  );
};

export default DailyLog;
