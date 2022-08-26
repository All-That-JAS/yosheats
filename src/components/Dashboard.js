import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import { db } from '../firebase';
import { getDoc, doc, collection } from 'firebase/firestore';


const Dashboard = () => {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const [goals, setGoals] = useState({});
  const goalsCollectionRef = collection(db, 'user-goals');

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


  return (
    <Container>
      <Row>
        <Col>
          <Card
            className='card border-primary mb-3'
            style={{ minWidth: '70vh' }}
          >
            <Card.Body>
              <div className='card text-center'>
                {' '}
                <Card.Header as= 'h5'>Daily Progress</Card.Header>
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
                  {/* TODO: toggle this information */}
                  <h5 className='card-title'> Here is your progress:</h5>
                  {goals.dailyCalories ? ( <div> <Card.Text>Streak: {goals.streakCounter}</Card.Text>
                  <Card.Title>Your daily goals:</Card.Title>
                  <Card.Text>Daily Calories: {goals.dailyCalories}</Card.Text>
                  <Card.Text>Daily Carbohydrates: {goals.dailyCarbs}</Card.Text>
                  <Card.Text>Daily Fat: {goals.dailyFat}</Card.Text>
                  <Card.Text>Daily Protein: {goals.dailyProtein}</Card.Text>
                    </div>
                  ) : (<div>Please complete user sign up page <Link
                        style={{ textDecoration: 'none', color: '#818080' }}
                        to='/newuser'
                      >
                        New User Goals
                      </Link>
                  </div> )
                  
                }
                 
                </div>
              </div>
              <br></br>
              <p className='card-text'>
                    Reminder: don't forget to reward yourself! You're doing great!</p>
              <h6> (Insert streak component here!) </h6>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card
            className='card text-white bg-secondary mb-3'
            style={{ minWidth: '20vh' }}
          >
            <Card.Body>
              <Card.Title>My Information</Card.Title>

              {error && <Alert variant='danger'>{error}</Alert>}
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

              <Link to='/update-profile' className='btn btn-primary w-40  mt-3'>
                Update Profile
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/*  */}
      <Row>
        <div className='w-100 text-center mt-2'>
          <Button variant='primary' onClick={handleLogout}>
            Log Out
          </Button>
          <Link to='/nutrition' className='btn btn-primary m-4'>
            Nutrition Information
          </Link>
        </div>
      </Row>
    </Container>
  );
};

export default Dashboard;
