import React, { useState } from "react";
import egg from "./eggsoutline.png";
import { fetchNutrition } from "../api/fetchNutrition";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
  getDocFromCache,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

import "./Nutrition.css";

const App = () => {
  const [queryState, setQueryState] = useState("");
  const [nutrition, setNutrition] = useState({});

  const search = async (e) => {
    if (e.key === "Enter") {
      const data = await fetchNutrition(queryState);
      console.log("hi from search", data);
      setNutrition(data);
      setQueryState("");
    }
  };
  const { currentUser } = useAuth();

  const date = new Date();
  const todayDate =
    Date().split(" ")[3] +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    Date().split(" ")[2];

  //TODO: DO WE NEED THIS? Get rid of this if unused
  // const userDaysCollection = db
  //   .collection('user-days')
  //   .where('userId', '===', `${currentUser.uid}`);

  // if (userDaysCollection)
  /* if this collection includes today's day
   */

  const dayDoc = doc(db, "user-days", todayDate);

  function handleSubmit(e) {
    e.preventDefault();
  }

  let currentCalories = 0;
  let currentFat = 0;
  let currentCarb = 0;
  let currentProtein = 0;
  let currentListOfFoods = [];

  async function handleClick() {
    const docSnap = await getDoc(dayDoc);

    let docSnapCalories,
      docSnapFat,
      docSnapCarb,
      docSnapProtein,
      docSnapListOfFoods;

    if (docSnap.exists() && docSnap.data()[`${currentUser.uid}`]) {
      console.log("docSnap.data()", docSnap.data());
      // console.log("currentUser.uid", [`${currentUser.uid}`]);
      // console.log("docSnap.data()", docSnap.data());
      // console.log(docSnap.data()[`${currentUser.uid}`]);
      docSnapCalories = docSnap.data()[`${currentUser.uid}`].calories;
      docSnapFat = docSnap.data()[`${currentUser.uid}`].fat;
      docSnapCarb = docSnap.data()[`${currentUser.uid}`].carb;
      docSnapProtein = docSnap.data()[`${currentUser.uid}`].protein;
      docSnapListOfFoods = docSnap.data()[`${currentUser.uid}`].listOfFoods;
    } else {
      //TODO: MAKE SURE USER ID MATCHES BEFORE ADDING FOOD ITEM: CURRENTLY APP STILL ADDS FOOD ITEM TO PREVIOUS
      //USER THAT IS LOGGED IN ONCE

      await updateDoc(dayDoc, {
        [`${currentUser.uid}`]: {
          calories: 0,
          fat: 0,
          carb: 0,
          protein: 0,
          listOfFoods: [],
        },
      });
      docSnapCalories = 0;
      docSnapFat = 0;
      docSnapCarb = 0;
      docSnapProtein = 0;
      docSnapListOfFoods = [];
    }

    currentCalories = Math.round(nutrition.items[0].calories + docSnapCalories);
    currentFat = Math.round(nutrition.items[0].fat_total_g + docSnapFat);
    currentCarb = Math.round(
      nutrition.items[0].carbohydrates_total_g + docSnapCarb
    );
    currentProtein = Math.round(nutrition.items[0].protein_g + docSnapProtein);
    currentListOfFoods = docSnapListOfFoods.concat([
      nutrition.items[0].name[0].toUpperCase() +
        nutrition.items[0].name.slice(1),
    ]);

    await updateDoc(dayDoc, {
      [`${currentUser.uid}`]: {
        calories: currentCalories,
        fat: currentFat,
        carb: currentCarb,
        protein: currentProtein,
        listOfFoods: currentListOfFoods,
      },
    });

    //To view user-days object:  docSnap.data());
    // console.log('snap', docSnap);
  }

  /* onsubmit - add item to doc with today's date
   */

  return (
    <div className="main-container">
      <input
        type="text"
        className="search"
        placeholder="Search..."
        value={queryState}
        onChange={(e) => setQueryState(e.target.value)}
        onKeyPress={search}
      />
      {nutrition.items && (
        <div className="city">
          <div className="city-name">
            <h3>
              Food:{" "}
              {nutrition.items[0].name[0].toUpperCase() +
                nutrition.items[0].name.slice(1)}
            </h3>
            <h6>
              {/* 1 serving size = 100g / do some math here
allow user to toggle (-/+) size

 */}
              <p>Serving Size(g): {nutrition.items[0].serving_size_g}</p>
              <p>Calories: {nutrition.items[0].calories}</p>
              <p>Total Fat(g): {nutrition.items[0].fat_total_g}</p>
              <p>Sodium(mg): {nutrition.items[0].sodium_mg}</p>
              <p>
                Total Carbohydrates(g):{" "}
                {nutrition.items[0].carbohydrates_total_g}
              </p>
              <p>Sugar(g): {nutrition.items[0].sugar_g}</p>
              <p>Protein(g): {nutrition.items[0].protein_g}</p>
            </h6>
          </div>

          <button type="submit" onClick={handleClick}>
            Add to Log
          </button>

          <div className="info">
            <img className="egg-icon" src={egg} alt={"yoshi egg"} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
