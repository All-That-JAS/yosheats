import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import { useNavigate } from 'react-router-dom';

import { db } from '../firebase';
import { getDoc, setDoc, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Alert, Col, Container, Row } from 'react-bootstrap';
import { motion } from 'framer-motion';

import slurpSound from '../images/yoshi-slurp.mp3';
import egg from '../images/eggsoutline.png';
import qq from '../images/qq.png';
import { fetchNutrition } from '../api/fetchNutrition';
import './Nutrition.css';

const Nutrition = () => {
  const [queryState, setQueryState] = useState('');
  const [nutrition, setNutrition] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [foodNotFound, setFoodNotFound] = useState(false);
  const { currentUser } = useAuth();
  let navigate = useNavigate();

  const [playSound] = useSound(slurpSound);
  function handleSlurpAudio() {
    return playSound();
  }

  const search = async (e) => {
    if (e.key === 'Enter') {
      const data = await fetchNutrition(queryState);
      if (!data.items.length) {
        setFoodNotFound(true);
      } else {
        setNutrition(data);
        setQueryState('');
      }
    }
  };

  const date = new Date();
  const todayDate =
    Date().split(' ')[3] +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    Date().split(' ')[2];

  const dayDoc = doc(db, 'user-days', todayDate);

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

    const goalDoc = doc(db, 'user-goals', currentUser.uid);
    let data = await getDoc(goalDoc);
    if (!data.data().dailyCalories) {
      alert('please update your goals');
      navigate('/update-user');
    }

    if (!docSnap.exists()) {
      setDoc(dayDoc, {
        [`${currentUser.uid}`]: {},
      });
    }

    if (docSnap.exists() && docSnap.data()[`${currentUser.uid}`]) {
      docSnapCalories = Math.round(
        docSnap.data()[`${currentUser.uid}`].calories
      );
      docSnapFat = Math.round(docSnap.data()[`${currentUser.uid}`].fat);
      docSnapCarb = Math.round(docSnap.data()[`${currentUser.uid}`].carb);
      docSnapProtein = Math.round(docSnap.data()[`${currentUser.uid}`].protein);
      docSnapListOfFoods = docSnap.data()[`${currentUser.uid}`].listOfFoods;
    } else {
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

    let foodName =
      nutrition.items[0].name[0].toUpperCase() +
      nutrition.items[0].name.slice(1);
    let foodServingSize = Math.round(nutrition.items[0].serving_size_g);
    let foodItem = [{ [foodName]: foodServingSize }];

    currentListOfFoods = docSnapListOfFoods.concat(foodItem);

    await updateDoc(dayDoc, {
      [`${currentUser.uid}`]: {
        calories: currentCalories,
        fat: currentFat,
        carb: currentCarb,
        protein: currentProtein,
        listOfFoods: currentListOfFoods,
      },
    });

    setShowAlert(true);
    handleSlurpAudio();
  }

  return (
    <motion.div
      className='main-container'
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      exit={{ x: window.innerWidth, transition: { duration: 0.1 } }}
    >
      <Container>
        <Row>
          <Col></Col>
          <Col>
            {showAlert && (
              <Alert
                className='mt-5'
                variant='success'
                onClose={() => setShowAlert(false)}
                dismissible
              >
                <p className=' fw-bolder fs-5 text-center'>success</p>{' '}
                <p className=' fw-bolder fs-6 text-center'>Food added!</p>{' '}
              </Alert>
            )}
            {foodNotFound && (
              <Alert
                className='mt-5'
                variant='danger'
                onClose={() => setFoodNotFound(false)}
                dismissible
              >
                <p className=' fw-bolder fs-6 text-center'>
                  Please check your spelling and try again.
                </p>{' '}
              </Alert>
            )}
            <Card className='m-5' style={{ width: '30rem' }}>
              <Card.Header>
                <Card.Text className=' fw-bolder fs-4 text-center'>
                  <img
                    className='me-4'
                    src={qq}
                    alt='nintendo party'
                    style={{ maxWidth: '2rem' }}
                  ></img>
                  Food Search
                  <img
                    className='ms-4'
                    src={qq}
                    alt='nintendo party'
                    style={{ maxWidth: '2rem' }}
                  ></img>
                </Card.Text>
              </Card.Header>
              <Card.Body>
                <script src='confetti.js'></script>

                <Card.Text className=' fs-6 text-center text-lowercase mb-2'>
                  Please quantify your item and do not pluralize it.
                </Card.Text>
                <Card.Text className=' fs-6 text-center text-lowercase mb-2'>
                  i.e. 100 apple or 6 strawberry
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
          <Col>
            <input
              type='text'
              className='search'
              placeholder="Search and press 'enter'"
              value={queryState}
              onChange={(e) => setQueryState(e.target.value)}
              onKeyPress={search}
              style={{ minWidth: '50vh' }}
            />

            {nutrition.items ? (
              <div className='city'>
                <div className='city-name'>
                  <Card.Text className=' fw-bolder fs-4 text-center'>
                    {nutrition.items[0].name[0].toUpperCase() +
                      nutrition.items[0].name.slice(1)}
                  </Card.Text>
                  <h6>
                    <p>
                      <strong>Serving Size(g): </strong>
                      {nutrition.items[0].serving_size_g}
                    </p>
                    <p>
                      <strong>Calories:</strong> {nutrition.items[0].calories}
                    </p>
                    <p>
                      <strong>Total Fat(g): </strong>
                      {nutrition.items[0].fat_total_g}
                    </p>
                    <p>
                      <strong>Sodium(mg): </strong>
                      {nutrition.items[0].sodium_mg}
                    </p>
                    <p>
                      <strong> Total Carbohydrate(g): </strong>

                      {nutrition.items[0].carbohydrates_total_g}
                    </p>
                    <p>
                      <strong>Sugar(g): </strong>
                      {nutrition.items[0].sugar_g}
                    </p>
                    <p>
                      <strong>Protein(g):</strong>{' '}
                      {nutrition.items[0].protein_g}
                    </p>
                  </h6>
                </div>

                <Button
                  className='my-2'
                  type='submit'
                  variant='dark'
                  onClick={handleClick}
                >
                  Add to Log
                </Button>
                <div className='info'>
                  <img
                    className='egg-icon'
                    src={egg}
                    alt={'yoshi egg'}
                    style={{ width: '40px', height: '40px' }}
                  />
                </div>
              </div>
            ) : null}
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Nutrition;
