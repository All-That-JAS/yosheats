import Carousel from 'react-bootstrap/Carousel';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Card, Container, Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { proteins, carbs, fats } from '../api/dummyData';

import qq from '../images/mariocarousel.jpeg';
import PopupBad from './PopupBad';
import PopupGood from './PopupGood';
import Popup from './Popup';

const DailyLogCarousel = () => {
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

  const [badPop, setBadPop] = useState(false);
  const [goodPop, setGoodPop] = useState(false);
  const [progressPop, setProgressPop] = useState(false);

  const calorie = 'calorie';
  const protein = 'protein';
  const fat = 'fat';
  const carb = 'carb';

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
    <Container>
      <Row>
        <Col></Col>
        <Col md='auto'>
          <div className='text-center mb-2'>
            <Card.Text
              className='fs-1 my-4 fw-bolder text-center text-lowercase text-white-80'
              style={{ color: '#ffffff' }}
            >
              Daily Log
            </Card.Text>
          </div>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Carousel fade>
          <Carousel.Item>
            <img
              className='d-block w-100'
              src={qq}
              alt='First slide'
              style={{ height: '25rem' }}
            />
            <div>
              <Carousel.Caption className='mb-5'>
                <Card.Text
                  className='fs-5 text-center'
                  style={{ color: '#797280' }}
                >
                  <h3 className='fw-bolder'>Today's Foods</h3>

                  <Card.Text className='fs-6 text-lowercase text-center'>
                    <ul>
                      {todaysFoods.length ? (
                        todaysFoods.map((food) => {
                          return (
                            <>
                              <span>
                                <strong>{Object.keys(food)[0]}: </strong>
                                {Object.values(food)[0]} grams
                              </span>
                              <br></br>
                            </>
                          );
                        })
                      ) : (
                        <div>
                          no daily log found for today <br></br>please add foods{' '}
                          <Link
                            to='/nutrition'
                            style={{ textDecoration: 'none' }}
                          >
                            here
                          </Link>
                          !
                        </div>
                      )}
                    </ul>
                  </Card.Text>
                </Card.Text>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
          {/* calories */}
          <Carousel.Item>
            <img
              className='d-block w-100'
              src={qq}
              alt='First slide'
              style={{ height: '25rem' }}
            />
            <div>
              <Carousel.Caption className='mb-5'>
                <Card.Text style={{ color: '#797280' }}>
                  <div className='h-100'>
                    <h3 className='fw-bolder'>Calories</h3>
                    <Card.Text className=' fs-5 my-2'>
                      <strong>Consumed: </strong>
                      {todaysCalories} calories<br></br>
                      <div className='progress mx-auto'>
                        {calorieProgress === 0 ? (
                          <div className='progress-zero' style={calorieStyle}>
                            <div className='ms-5'>{calorieProgress}%</div>
                          </div>
                        ) : calorieProgress > 100 ? (
                          <div className='progress-over' style={calorieStyle}>
                            {calorieProgress}%
                          </div>
                        ) : (
                          <div className='progress-done' style={calorieStyle}>
                            {calorieProgress}%
                          </div>
                        )}
                      </div>
                      <span className='text-lowercase fs-6'>
                        {deficitOrSurplus(
                          userCalories - todaysCalories,
                          userCalories,
                          'calorie'
                        )}
                      </span>
                    </Card.Text>
                  </div>
                  <div>
                    <Button
                      variant='info'
                      className='my-3'
                      onClick={() => {
                        calorieProgress > 106
                          ? setBadPop(true)
                          : calorieProgress < 95
                          ? setProgressPop(true)
                          : setGoodPop(true);
                      }}
                    >
                      <p className='my-1' style={{ color: '#ffffff' }}>
                        Calorie Status
                      </p>
                    </Button>
                  </div>
                  <PopupBad
                    macro={calorie}
                    trigger={badPop}
                    setTrigger={setBadPop}
                  ></PopupBad>
                  <PopupGood
                    macro={calorie}
                    trigger={goodPop}
                    setTrigger={setGoodPop}
                  ></PopupGood>
                  <Popup
                    macro={calorie}
                    trigger={progressPop}
                    setTrigger={setProgressPop}
                  ></Popup>
                </Card.Text>
              </Carousel.Caption>
            </div>
          </Carousel.Item>

          <Carousel.Item className='d-flex'>
            <img className=' w-100' src={qq} alt='Second slide' />
            <Carousel.Caption className='mb-5 mt-5'>
              <Card.Text style={{ color: '#797280' }}>
                <div>
                  <div>
                    <h3 className='fw-bolder'>Carbohydrates</h3>
                    <Card.Text className=' fs-5 my-2 mb-1'>
                      <strong>Consumed: </strong>
                      {todaysCarbs} grams
                      <span>
                        <div className='progress mx-auto'>
                          {carbsProgress === 0 ? (
                            <div className='progress-zero' style={carbStyle}>
                              <div className='ms-5'>{carbsProgress}%</div>
                            </div>
                          ) : carbsProgress > 100 ? (
                            <div className='progress-over' style={carbStyle}>
                              {carbsProgress}%
                            </div>
                          ) : (
                            <div className='progress-done' style={carbStyle}>
                              {carbsProgress}%
                            </div>
                          )}
                        </div>
                      </span>
                      <span className='text-lowercase fs-6'>
                        {deficitOrSurplus(
                          userCarbs - todaysCarbs,
                          userCarbs,
                          'carb'
                        )}{' '}
                      </span>
                      <br></br>
                      <div className='text-lowercase mt-1 fw-bold fs-6'>
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
                                  <span className='fs-6 text-lowercase'>
                                    {
                                      foodItem[Object.keys(foodItem)[0]]
                                        .servingSize
                                    }{' '}
                                    {Object.keys(foodItem)[0]} has{' '}
                                    {foodItem[Object.keys(foodItem)[0]].carbs} g
                                  </span>
                                  <br></br>
                                </>
                              );
                            })}
                          </ul>
                        ) : (
                          <div>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                          </div>
                        )}
                      </div>
                      <Button
                        className='my-3'
                        variant='info'
                        onClick={() => {
                          carbsProgress > 106
                            ? setBadPop(true)
                            : carbsProgress < 95
                            ? setProgressPop(true)
                            : setGoodPop(true);
                        }}
                      >
                        <p className='my-1' style={{ color: '#ffffff' }}>
                          Carb Status
                        </p>
                      </Button>
                      <PopupBad
                        macro={carb}
                        trigger={badPop}
                        setTrigger={setBadPop}
                      ></PopupBad>
                      <PopupGood
                        macro={carb}
                        trigger={goodPop}
                        setTrigger={setGoodPop}
                      ></PopupGood>
                      <Popup
                        macro={carb}
                        trigger={progressPop}
                        setTrigger={setProgressPop}
                      ></Popup>
                    </Card.Text>
                  </div>
                </div>

                <br></br>
                <br></br>
              </Card.Text>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className='d-block w-100' src={qq} alt='Third slide' />
            <Carousel.Caption className='mb-5'>
              <Card.Text style={{ color: '#797280' }}>
                <h3 className='fw-bolder'> Fats</h3>
                <Card.Text className=' fs-5 my-2'>
                  <strong>Consumed: </strong>
                  {todaysFats} grams
                  <div className='progress mx-auto'>
                    {fatsProgress === 0 ? (
                      <div className='progress-zero' style={fatStyle}>
                        <div className='ms-5'>{fatsProgress}%</div>
                      </div>
                    ) : fatsProgress > 100 ? (
                      <div className='progress-over' style={fatStyle}>
                        {fatsProgress}%
                      </div>
                    ) : (
                      <div className='progress-done' style={fatStyle}>
                        {fatsProgress}%
                      </div>
                    )}
                  </div>
                  <span className='text-lowercase fs-6'>
                    {deficitOrSurplus(userFats - todaysFats, userFats, 'fat')}
                  </span>
                  <div className='text-lowercase mt-1 fw-bold fs-6'>
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
                              <span className='fs-6 text-lowercase'>
                                {foodItem[Object.keys(foodItem)[0]].servingSize}{' '}
                                {Object.keys(foodItem)[0]} has{' '}
                                {foodItem[Object.keys(foodItem)[0]].fats} g
                              </span>
                              <br></br>
                            </>
                          );
                        })}
                      </ul>
                    ) : (
                      <div>
                        <br></br>
                        <br></br>
                        <br></br>
                      </div>
                    )}
                  </div>
                  <Button
                    variant='info'
                    className='my-3'
                    onClick={() => {
                      fatsProgress > 106
                        ? setBadPop(true)
                        : fatsProgress < 95
                        ? setProgressPop(true)
                        : setGoodPop(true);
                    }}
                  >
                    <p className='my-1' style={{ color: '#ffffff' }}>
                      Fat Status
                    </p>
                  </Button>
                  <PopupBad
                    macro={fat}
                    trigger={badPop}
                    setTrigger={setBadPop}
                  ></PopupBad>
                  <PopupGood
                    macro={fat}
                    trigger={goodPop}
                    setTrigger={setGoodPop}
                  ></PopupGood>
                  <Popup
                    macro={fat}
                    trigger={progressPop}
                    setTrigger={setProgressPop}
                  ></Popup>
                </Card.Text>
              </Card.Text>
              <br></br>
              <br></br>
              <br></br>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className='d-block w-100' src={qq} alt='Fourth slide' />
            <Carousel.Caption className='mb-5'>
              <Card.Text style={{ color: '#797280' }}>
                <h3 className='fw-bolder'> Proteins</h3>
                <Card.Text className=' fs-5 my-2'>
                  <strong>Consumed:</strong> {todaysProteins} grams
                  <div className='progress mx-auto'>
                    {proteinsProgress === 0 ? (
                      <div className='progress-zero' style={proteinStyle}>
                        <div className='ms-5'>{proteinsProgress}%</div>
                      </div>
                    ) : proteinsProgress > 100 ? (
                      <div className='progress-over' style={proteinStyle}>
                        {proteinsProgress}%
                      </div>
                    ) : (
                      <div className='progress-done' style={proteinStyle}>
                        {proteinsProgress}%
                      </div>
                    )}
                  </div>
                  <span className='text-lowercase fs-6'>
                    {deficitOrSurplus(
                      userProteins - todaysProteins,
                      userProteins,
                      'protein'
                    )}
                  </span>
                  <div className=' text-lowercase mt-1 fw-bold fs-6'>
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
                              <span className='fs-6 text-lowercase'>
                                {foodItem[Object.keys(foodItem)[0]].servingSize}{' '}
                                {Object.keys(foodItem)[0]} has{' '}
                                {foodItem[Object.keys(foodItem)[0]].protein} g
                              </span>
                              <br></br>
                            </>
                          );
                        })}
                      </ul>
                    ) : (
                      <div>
                        <br></br>
                        <br></br>
                        <br></br>
                      </div>
                    )}
                  </div>
                  <Button
                    className='my-3'
                    variant='info'
                    onClick={() => {
                      proteinsProgress > 106
                        ? setBadPop(true)
                        : proteinsProgress < 95
                        ? setProgressPop(true)
                        : setGoodPop(true);
                    }}
                  >
                    <p className='my-1' style={{ color: '#ffffff' }}>
                      Protein Status
                    </p>
                  </Button>
                  <PopupBad
                    macro={protein}
                    trigger={badPop}
                    setTrigger={setBadPop}
                  ></PopupBad>
                  <PopupGood
                    macro={protein}
                    trigger={goodPop}
                    setTrigger={setGoodPop}
                  ></PopupGood>
                  <Popup
                    macro={protein}
                    trigger={progressPop}
                    setTrigger={setProgressPop}
                  ></Popup>
                </Card.Text>
              </Card.Text>
              <br></br>
              <br></br>
              <br></br>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Row>
    </Container>
  );
};

export default DailyLogCarousel;
