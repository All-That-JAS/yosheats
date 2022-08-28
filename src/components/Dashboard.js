import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { getDoc, doc, collection } from 'firebase/firestore';

import { quotes } from '../api/MotivationQuotes';
import SetGoals from './SetGoals';

const Dashboard = () => {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const [goals, setGoals] = useState({});
  const [showGoals, setShowGoals] = useState(false);
  // const goalsCollectionRef = collection(db, 'user-goals');
  let navigate = useNavigate();

  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate('/');
    } catch {
      setError('Failed to log out');
    }
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
  let dailyQuote = createdailyQuote(quotes);

  return (
    <Container>
      <Row>
        <Col>
          <Card
            className=' my-5'
            style={{ minWidth: '70vh', marginTop: 15 }}
          >
            <Card.Header>
              <Card.Text className=' fw-bolder fs-4 text-center'>
                Daily Progress
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className='card text-center'>
                <div className='card-header'>
                  <ul className='nav nav-tabs card-header-tabs'>
                    <li className='nav-item  nav-link'>
                      <Link
                        style={{ textDecoration: 'none', color: '#818080' }}
                        to='/'
                      >
                        Dashboard
                      </Link>
                    </li>

                    <li className='nav-item nav-link'>
                      <Link
                        style={{ textDecoration: 'none', color: '#818080' }}
                        to='/dailylog'
                      >
                        Daily Log
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
                        variant='info'
                        onClick={() => setShowGoals(!showGoals)}
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

              <div className='text-end me-3 ms-5'>
                <br></br>
                <blockquote className='blockquote mb-1'>
                  <p className='fs-6 '>
                    {' '}
                    {dailyQuote[0]}
                    <br></br>
                  </p>
                  <br></br>
                  <footer className='blockquote-footer'>{dailyQuote[1]}</footer>
                </blockquote>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={3}></Col>
        <Col >
          <Card
            className='card text-white bg-secondary my-5'
            style={{ maxWidth: '40vh', marginTop: 15 }}
          >
            <Card.Header>
              <Card.Text className=' fw-bolder fs-4 text-center'>
                My Information
              </Card.Text>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant='danger'>{error}</Alert>}
              <Card.Text>
                <strong>Email: </strong>
                {currentUser.email}
                <br></br>
                {/* .displayName is for google accounts */}
                {!currentUser.displayName ? null : (
                  <div>
                    <strong>Name: </strong>
                    {currentUser.displayName}
                  </div>
                )}
                <br></br>
                <strong>Streak: </strong>
                {goals.streakCounter}
              </Card.Text>

              <Button variant='dark' onClick={handleLogout}>
                <Link to='/update-profile' className='btn btn-dark w-40'>
                  Update Profile
                </Link>
              </Button>
              <Button
                variant='dark'
                onClick={handleLogout}
                className='ms-5'
                style={{ height: '6vh' }}
              >
                Log Out
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* TODO: take out if unused */}
      <Row>
        <div className='w-100 text-center mt-2'></div>
      </Row>
    </Container>
  );
};

export default Dashboard;
