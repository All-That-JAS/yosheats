import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Card, Container, Col, Row } from 'react-bootstrap';
import CardHeader from 'react-bootstrap/esm/CardHeader';

import { proteins, carbs, fats } from '../api/dummyData';

const DailyLog = () => {
  function deficitOrSurplus(num, goal) {
    let unit;
    if (goal === 'calorie') {
      unit = 'calories';
    } else {
      unit = 'grams';
    }
    if (num >= -5 && num <= 5) {
      return `Congrats! You reached your daily ${goal} goal!`;
    } else if (num < -5) {
      return `You have exceeded your daily ${goal} goal by ${-num} ${unit}.`;
    } else {
      return `You have ${num} ${unit} remaining for your ${goal} goal today.`;
    }
  }

  const [todaysFoods, setTodaysFoods] = useState([]);
  const [todaysCalories, setTodaysCalories] = useState(0);
  const [todaysCarbs, setTodaysCarbs] = useState(0);
  const [todaysFats, setTodaysFats] = useState(0);
  const [todaysProteins, setTodaysProteins] = useState(0);

  const [userCalories, setUserCalories] = useState(0);
  const [userCarbs, setUserCarbs] = useState(0);
  const [userFats, setUserFats] = useState(0);
  const [userProteins, setUserProteins] = useState(0);

  const [carbStyle, setCarbStyle] = useState({});
  const [calorieStyle, setCalorieStyle] = useState({});
  const [fatStyle, setFatStyle] = useState({});
  const [proteinStyle, setProteinStyle] = useState({});

  const [carbRecs, setCarbRecs] = useState([]);
  const [fatRecs, setFatRecs] = useState([]);
  const [proteinRecs, setProteinRecs] = useState([]);

  setTimeout(() => {
    const calorieStyle = {
      opacity: 1,
      width: `${calorieProgress}%`,
    };

    setCalorieStyle(calorieStyle);
  }, 200);
  setTimeout(() => {
    const carbStyle = {
      opacity: 1,
      width: `${carbsProgress}%`,
    };

    setCarbStyle(carbStyle);
  }, 200);
  setTimeout(() => {
    const fatStyle = {
      opacity: 1,
      width: `${fatsProgress}%`,
    };

    setFatStyle(fatStyle);
  }, 200);
  setTimeout(() => {
    const proteinStyle = {
      opacity: 1,
      width: `${proteinsProgress}%`,
    };

    setProteinStyle(proteinStyle);
  }, 200);

  const { currentUser } = useAuth();

  useEffect(() => {
    const date = new Date();

    const todayDate =
      Date().split(' ')[3] +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      Date().split(' ')[2];

    const dayDoc = doc(db, 'user-days', todayDate);

    const getTodaysInfo = async () => {
      const dayDocSnap = await getDoc(dayDoc);
      if (!dayDocSnap.exists()) {
        setDoc(dayDoc, {
          [`${currentUser.uid}`]: {
            calories: 0,
            fat: 0,
            carb: 0,
            protein: 0,
            listOfFoods: [],
          },
        });
      }

      setTodaysFoods(dayDocSnap.data()[`${currentUser.uid}`].listOfFoods);
      setTodaysCalories(dayDocSnap.data()[`${currentUser.uid}`].calories);
      setTodaysCarbs(dayDocSnap.data()[`${currentUser.uid}`].carb);
      setTodaysFats(dayDocSnap.data()[`${currentUser.uid}`].fat);
      setTodaysProteins(dayDocSnap.data()[`${currentUser.uid}`].protein);
    };
    getTodaysInfo();
  }, [currentUser.uid]);

  useEffect(() => {
    const userDoc = doc(db, 'user-goals', currentUser.uid);
    const getUserGoals = async () => {
      const userDocSnap = await getDoc(userDoc);
      setUserCalories(userDocSnap.data().dailyCalories);
      setUserCarbs(userDocSnap.data().dailyCarbs);
      setUserFats(userDocSnap.data().dailyFat);
      setUserProteins(userDocSnap.data().dailyProtein);
    };
    getUserGoals();
  }, [currentUser.uid]);

  let calorieDeficit = userCalories - todaysCalories;
  let carbDeficit = userCarbs - todaysCarbs;
  let fatDeficit = userFats - todaysFats;
  let proteinDeficit = userProteins - todaysProteins;

  useEffect(() => {
    const recommend = () => {
      const carbRecommendations = carbs.filter((foodItem) => {
        return (
          foodItem[Object.keys(foodItem)[0]].carbs < carbDeficit * 1.05 &&
          foodItem[Object.keys(foodItem)[0]].calories < calorieDeficit * 1.05
        );
      });
      setCarbRecs(carbRecommendations);

      const fatRecommendations = fats.filter((foodItem) => {
        return (
          foodItem[Object.keys(foodItem)[0]].fats < fatDeficit * 1.05 &&
          foodItem[Object.keys(foodItem)[0]].calories < calorieDeficit * 1.05
        );
      });
      setFatRecs(fatRecommendations);
      //PROTEIN
      const proteinRecommendations = proteins.filter((foodItem) => {
        return (
          foodItem[Object.keys(foodItem)[0]].protein < proteinDeficit * 1.05 &&
          foodItem[Object.keys(foodItem)[0]].calories < calorieDeficit * 1.05
        );
      });
      setProteinRecs(proteinRecommendations);
    };
    recommend();
  }, [
    currentUser.uid,
    todaysCalories,
    todaysCarbs,
    todaysFats,
    todaysProteins,
    userCalories,
    userCarbs,
    userFats,
    userProteins,
    calorieDeficit,
    carbDeficit,
    fatDeficit,
    proteinDeficit,
  ]);
  //TODO: user recommendation tbd

  let calorieProgress = Math.round((todaysCalories / userCalories) * 100);
  let carbsProgress = Math.round((todaysCarbs / userCarbs) * 100);
  let fatsProgress = Math.round((todaysFats / userFats) * 100);
  let proteinsProgress = Math.round((todaysProteins / userProteins) * 100);

  return (
    <>
      <Container className="mt-3" style={{ width: '100rem' }}>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <Card.Text className="fw-bolder fs-4 text-center my-3">
                  Daily Log
                </Card.Text>
              </CardHeader>
              <Card.Body>
                <div>
                  <Card.Text className="fw-bold fs-5 text-center my-3">
                    Foods Consumed Today:
                  </Card.Text>
                  <Card.Text className="fs-6 text-lowercase">
                    <ul>
                      {todaysFoods.map((food) => {
                        //   TODO: find a way to consolidate food list so it doesn't list multiple of same item

                        //   function refactoringFoodList(foodList) {
                        //   let consolidatedList = [];
                        //   let foodListKeys = [];
                        //   let foodListValues = [];
                        //   foodList.forEach((food) => {
                        //     foodListKeys.push(Object.keys(food)[0]);
                        //     foodListValues.push(Object.values(food)[0]);
                        //   });
                        //   // console.log('foodList', foodList);
                        //   // console.log('foodListKeys', foodListKeys);
                        //   // console.log('foodListValues', foodListValues);
                        //   for (let i = 0; i < foodListKeys.length; i++) {
                        //     if (Object.keys(consolidatedList).includes(foodListKeys[i])) {
                        //       consolidatedList[foodListKeys[i]] += foodListValues[i];
                        //     } else {
                        //       consolidatedList[foodListKeys[i]] = foodListValues[i];
                        //     }
                        //   }
                        //   // console.log('consolidatedList', consolidatedList);
                        //   return consolidatedList;
                        // }

                        return (
                          <>
                            <span>
                              <strong>{Object.keys(food)[0]}: </strong>
                              {Object.values(food)[0]} grams
                            </span>
                            <br></br>
                          </>
                        );
                      })}
                    </ul>

                  </Card.Text>
                  <Card.Text className="fw-bold fs-5 text-center my-3">
                    Progress Toward Goals:
                  </Card.Text>
                  <Card.Text className=" fs-5 my-3">
                    <strong>Calories: </strong>
                    {todaysCalories} calories consumed.<br></br>
                    <span className="text-lowercase">
                      {deficitOrSurplus(
                        userCalories - todaysCalories,
                        'calorie'
                      )}
                    </span>
                    <br></br>
                    <div className='progress '>
                 
                      {calorieProgress > 100 ? (
                        <div className='progress-over' style={calorieStyle}>
                          {calorieProgress}%
                        </div>
                      ) : (
                        <div className='progress-done' style={calorieStyle}>
                          {calorieProgress}%
                        </div>
                      )}
                    </div>
                  </Card.Text>
                  <Card.Text className=" fs-5 my-3 mb-1">
                    <strong>Carbs: </strong>
                    {todaysCarbs} grams consumed. <br></br>{' '}
                    <span className="text-lowercase">
                      {deficitOrSurplus(userCarbs - todaysCarbs, 'carb')}{' '}
                    </span>
                    <div>
                      {carbRecs.length
                        ? `Recommended foods to meet carb goals for today. Pick one:
                      ${carbRecs.map((foodItem) => {
                        return `${
                          foodItem[Object.keys(foodItem)[0]].servingSize
                        } ${Object.keys(foodItem)[0]} has ${
                          foodItem[Object.keys(foodItem)[0]].carbs
                        } g`;
                      })}`
                        : null}
                    </div>
                    <br></br>
                    <div className='progress'>
                      {carbsProgress > 100 ? (
                        <div className='progress-over' style={carbStyle}>
                          {carbsProgress}%
                        </div>
                      ) : (
                        <div className='progress-done' style={carbStyle}>
                          {carbsProgress}%
                        </div>
                      )}

                    </div>
                  </Card.Text>
                  <Card.Text className=" fs-5 my-3">
                    <strong>Fats: </strong>
                    {todaysFats} grams consumed. <br></br>{' '}
                    <span className="text-lowercase">
                      {deficitOrSurplus(userFats - todaysFats, 'fat')}
                    </span>
                    <div>
                      {fatRecs.length
                        ? `Recommended foods to meet fat goals for today. Pick one:
                      ${fatRecs.map((foodItem) => {
                        return `${
                          foodItem[Object.keys(foodItem)[0]].servingSize
                        } ${Object.keys(foodItem)[0]} has ${
                          foodItem[Object.keys(foodItem)[0]].fats
                        } g`;
                      })}`
                        : null}
                    </div>
                    <br></br>
                    <div className='progress'>
                      {fatsProgress > 100 ? (
                        <div className='progress-over' style={fatStyle}>
                          {fatsProgress}%
                        </div>
                      ) : (
                        <div className='progress-done' style={fatStyle}>
                          {fatsProgress}%
                        </div>
                      )}
                    </div>
                  </Card.Text>
                  <Card.Text className=" fs-5 my-3">
                    <strong>Proteins: </strong> {todaysProteins} grams consumed.{' '}
                    <br></br>
                    <span className="text-lowercase">
                      {deficitOrSurplus(
                        userProteins - todaysProteins,
                        'protein'
                      )}
                    </span>
                    <div>
                      {proteinRecs.length
                        ? `Recommended foods to meet protein goals for today. Pick one:
                      ${proteinRecs.map((foodItem) => {
                        return `${
                          foodItem[Object.keys(foodItem)[0]].servingSize
                        } ${Object.keys(foodItem)[0]} has ${
                          foodItem[Object.keys(foodItem)[0]].protein
                        } g`;
                      })}`
                        : null}
                    </div>
                    <br></br>
                    <div className='progress'>
                      {proteinsProgress > 100 ? (
                        <div className='progress-over' style={proteinStyle}>
                          {proteinsProgress}%
                        </div>
                      ) : (
                        <div className='progress-done' style={proteinStyle}>
                          {proteinsProgress}%
                        </div>
                      )}

                    </div>
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>{' '}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DailyLog;
