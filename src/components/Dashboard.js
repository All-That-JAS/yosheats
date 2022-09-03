import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Col, Container, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import useSound from 'use-sound';

import SetGoals from './SetGoals';
import Calendar from './Calendar';

import mush from '../images/toad.png';
import { marioQuotes } from '../api/MarioQuotes';
import marioSound from '../images/mario-coin.mp3';
import videoBg from '../images/mariocrop.mov';
import yoshiPixel from '../images/pixelyoshi.png';
import CardHeader from 'react-bootstrap/esm/CardHeader';

const Dashboard = () => {
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState({});
  const [showGoals, setShowGoals] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [playSound] = useSound(marioSound, { volume: 0.25 });

  useNavigate();

  function handleCoinAudio() {
    return playSound();
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

  function createMarioQuote(arr) {
    let quote = arr[Math.floor(Math.random() * arr.length)];
    return quote;
  }

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
          style={{ objectFit: 'fill', height: '30vh', width: '100%' }}
        />

        <Row classname='dash-content'>
          <Col xs={5}>
            <Card className=' my-5' style={{ marginTop: 15 }}>
              <Card.Header>
                <Card.Text className=' fw-bolder fs-5 text-center'>
                  {goals.username
                    ? `${goals.username}'s Progress`
                    : 'My Progress'}
                </Card.Text>
              </Card.Header>
              <Card.Body>
                <div className='card text-center'>
                  <div className='card-header d-flex justify-content-center'>
                    <Card.Text className='mb-3'>
                      <ul
                        className='nav nav-tabs card-header-tabs'
                        style={{ height: '1rem' }}
                      >
                        <li className='nav-item nav-link'>
                          <Link
                            style={{
                              textDecoration: 'none',
                              color: '#818080',
                              height: '2rem',
                            }}
                            to='/nutrition'
                          >
                            Nutrition
                          </Link>
                        </li>
                        <li className='nav-item nav-link'>
                          <Link
                            style={{
                              textDecoration: 'none',
                              color: '#818080',
                              height: '2rem',
                            }}
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
                    </Card.Text>
                  </div>
                  <div className='card-body'>
                    <div className='d-flex justify-content-around my-2'>
                      <h6>
                        <Button
                          variant='dark'
                          style={{ color: '#cccccc' }}
                          onClick={() => {
                            setShowGoals(!showGoals);
                          }}
                        >
                          Daily Goals
                        </Button>

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
          <Col xs={3}>
            <Card
              className='card text-white bg-secondary my-5'
              style={{ marginTop: 15 }}
            >
              <Card.Header>
                <Card.Text className=' fw-bolder fs-4 text-center'>
                  <img
                    src={yoshiPixel}
                    alt='yoshi'
                    className='me-3'
                    style={{ maxWidth: '2rem' }}
                  ></img>
                  My Info
                  <img
                    src={yoshiPixel}
                    alt='yoshi'
                    className='ms-3'
                    style={{ maxWidth: '2rem', transform: 'scaleX(-1)' }}
                  ></img>
                </Card.Text>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Card.Text>
                  <strong>Email: </strong>
                  {currentUser.email}
                  <br></br>
                  {goals.username ? (
                    `Name: ${goals.username}`
                  ) : !currentUser.displayName ? null : (
                    <div>
                      <strong>Name: </strong>
                      {currentUser.displayName}
                    </div>
                  )}
                </Card.Text>
                <div className='text-center'>
                  <Button variant='dark'>
                    <Link to='/update-profile' className='btn btn-dark w-40'>
                      Update Profile
                    </Link>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='mt-5 text-center'>
              <CardHeader className=' fw-bolder fs-5 text-center'>
                <Card.Text>My Log History</Card.Text>
              </CardHeader>
              <Card.Body>
                <Card.Text>
                  <Button
                    variant='dark'
                    style={{ color: '#cccccc' }}
                    onClick={() => {
                      setShowCalendar(!showCalendar);
                    }}
                  >
                    Calendar
                  </Button>
                  <br></br>
                  <br></br>
                  {showCalendar && <Calendar>show/hide typography</Calendar>}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Dashboard;
