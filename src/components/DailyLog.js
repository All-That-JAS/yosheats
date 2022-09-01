import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Card, Container, Col, Row } from 'react-bootstrap';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import { proteins, carbs, fats } from '../api/dummyData';

import yoshiEat from '../images/yoshi-eat.gif';

const DailyLog = () => {
  function deficitOrSurplus(num, goalQty, goalName) {
    let unit;
    if (goalName === 'calorie') {
      unit = 'calories';
    } else {
      unit = 'grams';
    }
    if (num / goalQty >= -0.05 && num / goalQty <= 0.05) {
      return `Congrats! You reached your daily ${goalName} goal!`;
    } else if (num / goalQty < -0.05) {
      return `You have exceeded your daily ${goalName} goal by ${-num} ${unit}.`;
    } else {
      return `You have ${num} ${unit} remaining for your ${goalName} goal today.`;
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

  let calorieProgress, carbsProgress, fatsProgress, proteinsProgress;

  Math.round((todaysCalories / userCalories) * 100)
    ? (calorieProgress = Math.round((todaysCalories / userCalories) * 100))
    : (calorieProgress = 0);
  Math.round((todaysCarbs / userCarbs) * 100)
    ? (carbsProgress = Math.round((todaysCarbs / userCarbs) * 100))
    : (carbsProgress = 0);
  Math.round((todaysFats / userFats) * 100)
    ? (fatsProgress = Math.round((todaysFats / userFats) * 100))
    : (fatsProgress = 0);
  Math.round((todaysProteins / userProteins) * 100)
    ? (proteinsProgress = Math.round((todaysProteins / userProteins) * 100))
    : (proteinsProgress = 0);

  return (
    <>
      <Container className="mt-3">
        <Row>
          <Col> </Col>
          <Col>
            <Card>
              <CardHeader>
                <Card.Text className="fw-bolder fs-4 text-center my-1">
                <img
                    src={yoshiEat}
                    alt='yoshi'
                    style={{ maxWidth: '5rem' }}
                  ></img>
                  Daily Log
                  <img
                    src={yoshiEat}
                    alt='yoshi'
                    style={{ maxWidth: '5rem', transform: 'scaleX(-1)' }}
                  ></img>
                </Card.Text>
              </CardHeader>
              <Card.Body>
                <Card.Text className="fs-6 text-lowercase text-center">
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
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
        </Row>
        {/*  */}
        <Row className="mt-3 mb-5" style={{ height: '25rem' }}>
          <Col>
            <Card style={{ height: '26rem' }}>
              <CardHeader>
                <Card.Text className="fw-bold fs-6 text-center my-2">
                  Calories
                </Card.Text>
              </CardHeader>
              <Card.Body>
                <Card.Text className=" fs-5 my-2">
                  <strong>Consumed: </strong>
                  {todaysCalories} calories<br></br>
                  <div className="progress mx-auto">
                    {calorieProgress > 100 ? (
                      <div className="progress-over" style={calorieStyle}>
                        {calorieProgress}%
                      </div>
                    ) : (
                      <div className="progress-done" style={calorieStyle}>
                        {calorieProgress}%
                      </div>
                    )}
                  </div>
                  <span className="text-lowercase fs-6">
                    {deficitOrSurplus(
                      userCalories - todaysCalories,
                      userCalories,
                      'calorie'
                    )}
                  </span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardHeader>
                <Card.Text className="fw-bold fs-6 text-center my-2">
                  Carbohydrates
                </Card.Text>
              </CardHeader>
              <Card.Body>
                <Card.Text className=" fs-5 my-2 mb-1">
                  <strong>Consumed: </strong>
                  {todaysCarbs} grams
                  <span>
                    <div className="progress mx-auto">
                      {carbsProgress > 100 ? (
                        <div className="progress-over" style={carbStyle}>
                          {carbsProgress}%
                        </div>
                      ) : (
                        <div className="progress-done" style={carbStyle}>
                          {carbsProgress}%
                        </div>
                      )}
                    </div>
                  </span>
                  <span className="text-lowercase fs-6">
                    {deficitOrSurplus(
                      userCarbs - todaysCarbs,
                      userCarbs,
                      'carb'
                    )}{' '}
                  </span>
                  <br></br>
                  <div className="text-lowercase mt-1 fw-bold fs-6">
                    {carbRecs.length
                      ? 'Recommended foods to meet daily carb goals:'
                      : null}
                  </div>
                  <div>
                    {carbRecs.length ? (
                      <ul>
                        {carbRecs.map((foodItem) => {
                          return (
                            <>
                              <span className="fs-6 text-lowercase">
                                {foodItem[Object.keys(foodItem)[0]].servingSize}{' '}
                                {Object.keys(foodItem)[0]} has{' '}
                                {foodItem[Object.keys(foodItem)[0]].carbs} g
                              </span>
                              <br></br>
                            </>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3 mb-5" style={{ height: '25rem' }}>
          <Col>
            <Card>
              <CardHeader>
                <Card.Text className="fw-bold fs-6 text-center my-2">
                  Fats
                </Card.Text>
              </CardHeader>
              <Card.Body>
                <Card.Text className=" fs-5 my-2">
                  <strong>Consumed: </strong>
                  {todaysFats} grams
                  <div className="progress mx-auto">
                    {fatsProgress > 100 ? (
                      <div className="progress-over" style={fatStyle}>
                        {fatsProgress}%
                      </div>
                    ) : (
                      <div className="progress-done" style={fatStyle}>
                        {fatsProgress}%
                      </div>
                    )}
                  </div>
                  <span className="text-lowercase fs-6">
                    {deficitOrSurplus(userFats - todaysFats, userFats, 'fat')}
                  </span>
                  <div className="text-lowercase mt-1 fw-bold fs-6">
                    {fatRecs.length
                      ? 'Recommended foods to meet daily fat goals:'
                      : null}
                  </div>
                  <div>
                    {fatRecs.length ? (
                      <ul>
                        {fatRecs.map((foodItem) => {
                          return (
                            <>
                              <span className="fs-6 text-lowercase">
                                {foodItem[Object.keys(foodItem)[0]].servingSize}{' '}
                                {Object.keys(foodItem)[0]} has{' '}
                                {foodItem[Object.keys(foodItem)[0]].fats} g
                              </span>
                              <br></br>
                            </>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            {/* // */}
            <Card>
              <CardHeader>
                <Card.Text className="fw-bold fs-6 text-center my-2">
                  Proteins
                </Card.Text>
              </CardHeader>
              <Card.Body>
                <Card.Text className=" fs-5 my-2">
                  <strong>Consumed:</strong> {todaysProteins} grams
                  <div className="progress mx-auto">
                    {proteinsProgress > 100 ? (
                      <div className="progress-over" style={proteinStyle}>
                        {proteinsProgress}%
                      </div>
                    ) : (
                      <div className="progress-done" style={proteinStyle}>
                        {proteinsProgress}%
                      </div>
                    )}
                  </div>
                  <span className="text-lowercase fs-6">
                    {deficitOrSurplus(
                      userProteins - todaysProteins,
                      userProteins,
                      'protein'
                    )}
                  </span>
                  <div className=" text-lowercase mt-1 fw-bold fs-6">
                    {proteinRecs.length
                      ? 'Recommended foods to meet daily protein goals:'
                      : null}
                  </div>
                  <div>
                    {proteinRecs.length ? (
                      <ul>
                        {proteinRecs.map((foodItem) => {
                          return (
                            <>
                              <span className="fs-6 text-lowercase">
                                {foodItem[Object.keys(foodItem)[0]].servingSize}{' '}
                                {Object.keys(foodItem)[0]} has{' '}
                                {foodItem[Object.keys(foodItem)[0]].protein} g
                              </span>
                              <br></br>
                            </>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>{' '}
          </Col>
        </Row>
        <Col></Col>
      </Container>
    </>
  );
};

export default DailyLog;
