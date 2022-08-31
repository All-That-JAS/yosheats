import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Col, Container, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { getDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { motion } from 'framer-motion';
import useSound from 'use-sound';

import { quotes } from '../api/MotivationQuotes';
import SetGoals from './SetGoals';

import mush from '../images/toad.png';
import { marioQuotes } from '../api/MarioQuotes';
import marioSound from '../images/mario-coin.mp3';
import videoBg from '../images/mario-crop.mov';
import yoshiHello from '../images/yoshidance.gif';

const Dashboard = () => {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const [goals, setGoals] = useState({});
  const [showGoals, setShowGoals] = useState(false);
  const [mushy, setMushy] = useState(false);
  const [playSound] = useSound(marioSound);

  let navigate = useNavigate();

  function handleCoinAudio() {
    return playSound();
  }

  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate('/');
    } catch {
      setError('Failed to log out');
    }
  }

  //TODO: streakcounter...
  async function handleCounter() {
    let prevStreakCounter = goals.streakCounter;
    const goalDoc = doc(db, 'user-goals', currentUser.uid);

    await updateDoc(goalDoc, { streakCounter: increment(1) });
    console.log('streak', goals.streakCounter);
    console.log('prevStreakCounter', prevStreakCounter);
    // await updateDoc(goalDoc, {
    //   [`${currentUser.uid}`]: { streakCounter: increment(5) },
    // });
    // console.log('streak', goals.streakCounter);
    // console.log('prevStreakCounter', prevStreakCounter);
  }

  let userID = currentUser.uid;

  useEffect(() => {
    const getGoals = async () => {
      const goalDoc = doc(db, 'user-goals', userID);
      let data = await getDoc(goalDoc);
      setGoals(data.data());
    };

    getGoals();
  }, [userID]);

  function createdailyQuote(obj) {
    let quoteKeys = Object.values(obj);
    let authorKeys = Object.keys(obj);
    let author = authorKeys[Math.floor(Math.random() * authorKeys.length)];
    let quote = quoteKeys[Math.floor(Math.random() * quoteKeys.length)];
    return [quote, author];
  }
  function createMarioQuote(arr) {
    let quote = arr[Math.floor(Math.random() * arr.length)];
    return quote;
  }

  let dailyQuote = createdailyQuote(quotes);
  let marioQuote = createMarioQuote(marioQuotes);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container>
        <video
          src={videoBg}
          autoPlay
          loop
          muted
          className='mt-5'
          style={{ objectFit: 'fill', height: '30vh', width: '50%' }}
        />
        <video
          src={videoBg}
          autoPlay
          loop
          muted
          className='mt-5'
          style={{ objectFit: 'fill', height: '30vh', width: '50%' }}
        />
        <Row classname='dash-content'>
          <Col>
            <Card className=' my-5' style={{ minWidth: '60vh', marginTop: 15 }}>
              <Card.Header>
                <Card.Text className=' fw-bolder fs-4 text-center'>
                  {goals.username
                    ? `${goals.username}'s Daily Progress`
                    : 'Daily Progress'}
                </Card.Text>
              </Card.Header>
              <Card.Body>
                <div className='card text-center'>
                  <div className='card-header'>
                    <ul className='nav nav-tabs card-header-tabs'>
                      <li className='nav-item nav-link'>
                        <Link
                          style={{ textDecoration: 'none', color: '#818080' }}
                          to='/dailylog'
                        >
                          Daily Log
                        </Link>
                      </li>
                      <li className='nav-item  nav-link'>
                        <Link
                          style={{ textDecoration: 'none', color: '#818080' }}
                          to='/calendar'
                        >
                          Calendar
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className='card-body'>
                    <div>
                      <Card.Text className=' fw-bolder fs-6 text-center mb-3'>
                        Streak: {goals.streakCounter}
                      </Card.Text>

                      <h6>
                        <Button
                          variant='dark'
                          style={{ color: '#cccccc' }}
                          onClick={() => {
                            handleCounter();
                            setShowGoals(!showGoals);
                          }}
                        >
                          Daily Goals
                        </Button>
                        <br></br>
                        <br></br>
                        {showGoals && <SetGoals>show/hide typography</SetGoals>}
                      </h6>
                    </div>
                  </div>
                </div>

                <div className=' me-3 ms-5'>
                  <br></br>
                  <blockquote className='blockquote mb-1 text-end '>
                    <p className='fs-5 '>
                      "{marioQuote}"<br></br>
                    </p>
                    {/*     "{dailyQuote[0]}" */}
                    {/* {dailyQuote[1]} */}

                    <footer className='blockquote-footer'>
                      <img
                        src={mush}
                        alt='mush'
                        style={{ maxWidth: '3rem', marginTop: 15 }}
                        onClick={() => {
                          handleCoinAudio();
                        }}
                      ></img>
                    </footer>
                  </blockquote>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4}></Col>
          <Col>
            <Card
              className='card text-white bg-secondary my-5'
              style={{ width: '35vh', marginTop: 15, height: '40vh' }}
            >
              <Card.Header>
                <Card.Text className=' fw-bolder fs-4 text-center'>
                  My Info
                </Card.Text>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Card.Text>
                  <strong>Email: </strong>
                  {currentUser.email}
                  <br></br>
                  {/* .username = upon sign up || .displayName is for google accounts */}
                  {goals.username ? (
                    `Name: ${goals.username}`
                  ) : !currentUser.displayName ? null : (
                    <div>
                      <strong>Name: </strong>
                      {currentUser.displayName}
                    </div>
                  )}

                  <br></br>
                  <strong>Streak: </strong>
                  {goals.streakCounter}
                </Card.Text>
                <div>
                  <span style={{ color: '#FFFFFF00' }}>------------</span>
                  <img
                    src={yoshiHello}
                    alt='yoshi'
                    style={{ maxWidth: '10rem' }}
                    onClick={() => {
                      handleCoinAudio();
                    }}
                  ></img>
                </div>
                <br></br>
                <Button variant='dark'>
                  <Link
                    to='/update-profile'
                    className='btn btn-dark w-40'
                    style={{ height: '4vh' }}
                  >
                    Update
                  </Link>
                </Button>{' '}
                <span style={{ color: '#FFFFFF00' }}>-------------</span>
                <Button
                  variant='dark'
                  onClick={handleLogout}
                  className='ms-5'
                  style={{ height: '5vh' }}
                >
                  Log Out
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Dashboard;
