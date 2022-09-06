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
import Popup from './Popup';

import mush from '../images/toad.png';
import qq from '../images/qq.png';
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
  const [popUp, setPopUp] = useState(false);
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
          style={{ objectFit: 'fill', height: '40vh', width: '100%' }}
        />

        <Row>

          <Col xs={5}>
            <Card className=" my-5" style={{ marginTop: 15 }}>
              <Card.Header>
                <Card.Text className=' fw-bolder fs-5 text-center'>
                  {goals.username ? `${goals.username}'s Goals` : 'My Goals'}

                </Card.Text>
              </Card.Header>
              <Card.Body>
                <div className="card text-center">
                  <div className="card-header d-flex justify-content-center">
                    <Card.Text className="mb-3">
                      <ul
                        className="nav nav-tabs card-header-tabs"
                        style={{ height: '1rem' }}
                      >
                        <li className="nav-item nav-link">
                          <Link
                            style={{
                              textDecoration: 'none',
                              color: '#818080',
                              height: '2rem',
                            }}
                            to="/nutrition"
                          >
                            Nutrition
                          </Link>
                        </li>
                        <li className="nav-item nav-link">
                          <Link
                            style={{
                              textDecoration: 'none',
                              color: '#818080',
                              height: '2rem',
                            }}
                            to="/dailylog"
                          >
                            Daily Log
                          </Link>
                        </li>
                        <li className="nav-item  nav-link">
                          <Link
                            style={{ textDecoration: 'none', color: '#818080' }}
                            to="/calendar"
                          >
                            Calendar
                          </Link>
                        </li>
                      </ul>
                    </Card.Text>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-around my-2">
                      <h6>
                      <SetGoals> </SetGoals>

                      </h6>
                    </div>
                  </div>
                </div>

                <div className=" me-3 ms-5">
                  <br></br>
                  <blockquote className="blockquote mb-1 text-end ">
                    <p className="fs-5 ">
                      "{marioQuote}"<br></br>
                    </p>

                    <footer className="blockquote-footer">
                      <img
                        src={mush}
                        alt="mush"
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
              className="card text-white bg-secondary my-5"
              style={{ marginTop: 15 }}
            >
              <Card.Header>
                <Card.Text className=" fw-bolder fs-4 text-center">
                  <img
                    src={yoshiPixel}
                    alt="yoshi"
                    className="me-3"
                    style={{ maxWidth: '2rem' }}
                  ></img>
                  My Info
                  <img
                    src={yoshiPixel}
                    alt="yoshi"
                    className="ms-3"
                    style={{ maxWidth: '2rem', transform: 'scaleX(-1)' }}
                  ></img>
                </Card.Text>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Card.Text>
                  <strong>Email: </strong>
                  {currentUser.email}
                  <br></br>
                  {/*  TODO : does this solve usename issue? */}
                  {!goals.username ? (
                    !currentUser.displayName ? null : (
                      <div>
                        <strong>Name: </strong>
                        {currentUser.displayName}
                      </div>
                    )
                  ) : (
                    `Name: ${goals.username}`
                  )}
                  <br></br>
                  {goals.pronouns ? `Pronouns: ${goals.pronouns}` : null}
                </Card.Text>
                <div className='text-center'>
                  <Button variant='dark'>
                    <Link to='/update-user' className='btn btn-dark'>

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
                <Card.Text>My Calendar Log</Card.Text>
              </CardHeader>
              <Card.Body>
                <Card.Text className=' fw-light fs-6 text-lowercase text-center'>
                  click below for your calendar

                </Card.Text>
                <img
                  src={qq}
                  alt='question mark'
                  style={{
                    maxWidth: '3rem',
                    maxHeight: '3rem',
                  }}
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                  }}
                ></img>
                <img
                  src={qq}
                  alt='question mark'
                  style={{
                    maxWidth: '3rem',
                    maxHeight: '3rem',
                  }}
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                  }}
                ></img>
                <img
                  src={qq}
                  alt='question mark'
                  style={{
                    maxWidth: '3rem',
                    maxHeight: '3rem',
                  }}
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                  }}
                ></img>

                <br></br>
                <br></br>
                {showCalendar && <Calendar>show/hide typography</Calendar>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Dashboard;
