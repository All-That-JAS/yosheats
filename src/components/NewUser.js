import React, { useState } from 'react';
import { db } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import CardHeader from 'react-bootstrap/CardHeader';

import { motion } from 'framer-motion';

const NewUser = () => {
  function CalculateBMRAndActivityLevel(
    activityLevel,
    heightFeet,
    heightInches,
    weight,
    assignedSex,
    age
  ) {

    let weightCalc = 10 * (weight / 2.2);
    let feetInInches = heightFeet * 12;
    let totalInches = Number(feetInInches) + Number(heightInches);
    let heightInCm = totalInches * 2.54;
    let ageCalc = 5 * age;
    let incompleteBMR = weightCalc + 6.25 * heightInCm - ageCalc;
    if (assignedSex === 'Male') {
      incompleteBMR += 5;
    }
    if (assignedSex === 'Female') {
      incompleteBMR -= 161;
    }
    let TDEE = incompleteBMR;
    switch (activityLevel) {
      case 'Not active':
        TDEE *= 1.2;
        break;
      case 'Lightly active':
        TDEE *= 1.375;
        break;
      case 'Moderately active':
        TDEE *= 1.55;
        break;
      case 'Very active':
        TDEE *= 1.725;
        break;
      case 'Extra active':
        TDEE *= 1.9;
        break;
      default:
        TDEE = TDEE;
    }
    let dailyCalories;
    switch (goal) {
      case 'General well-being':
        dailyCalories = Math.round(TDEE);
        break;
      case 'Weight loss':
        dailyCalories = Math.round(TDEE - 500);
        break;
      case 'Muscle gain':
        dailyCalories = Math.round(TDEE + 500);
        break;
      case 'High-performance athlete':
        dailyCalories = Math.round(TDEE + 1000);
        break;
      default:
        dailyCalories = Math.round(TDEE);
    }

    let dailyCarbs = Math.round((dailyCalories * 0.55) / 4);
    let dailyFat = Math.round((dailyCalories * 0.27) / 4);
    let dailyProtein = Math.round((dailyCalories * 0.18) / 9);

    const { currentUser } = useAuth();

    const userDoc = doc(db, 'user-goals', currentUser.uid);
    updateDoc(userDoc, {
      dailyCalories,
      dailyCarbs,
      dailyFat,
      dailyProtein,
      username,
    });

    //if person wants general well-being, daily calories should be same amount as TDEE
    //if they want to drop 1 pound per week, they need a daily calorie deficit of 500, so TDEE-500
    //if they want to add 1 pound per week, they need a daily calorie surplus of 500, so TDEE+500
  }
  const [goal, setGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [heightFeet, setHeightFeet] = useState(null);
  const [heightInches, setHeightInches] = useState(null);
  const [weight, setWeight] = useState(null);
  const [age, setAge] = useState(null);
  const [assignedSex, setAssignedSex] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});
  let navigate = useNavigate();

  const listOfErrors = () => {
    const newErrors = {};
    // name errors
    if (!username || username === '')
      newErrors.username = 'username cannot be blank!';
    else if (username.length > 30) newErrors.username = 'name is too long!';
    // height errors
    if (!heightFeet || heightFeet <= 0)
      newErrors.heightFeet = 'height cannot be blank!';
    if (!heightInches || heightInches < 0)
      newErrors.heightInches = 'height cannot be blank!';
    // weight errors
    if (!weight || weight < 0) newErrors.weight = 'weight cannot be blank!';
    // age errors
    if (!age || age === '') newErrors.age = 'age cannot be blank!';
    else if (age < 18) newErrors.age = 'must be at least 18 years old!';
    return newErrors;
  };

  const setErrorNull = (field) => {
    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  function handleSubmit(evt) {
    evt.preventDefault();
    //errors
    const formErrors = listOfErrors();
    if (Object.keys(formErrors).length > 0) {
      // We got errors!
      setErrors(formErrors);
    } else {
      // No errors! Put any logic here for the form submission!
      alert('Success! Check your dashboard for your daily nutritional goals.');
      navigate('/');
    }
  }

  return (
    <motion.div
      className='main-container'
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      exit={{ x: window.innerWidth, transition: { duration: 0.1 } }}
    >
      {/* put a form with 4 categories:
            goal, activity level, sex/age/location,
            current height/weight, goal weight */}

      {/* once they hit submit (onClick), have
            a popup of suggested numbers */}
      <Container className='mt-5'>
        <Row>
          <Col></Col>
          <Col>
            <Card style={{ width: '31rem' }}>
              <CardHeader>
                
                <Card.Text className='fw-bolder fs-4 text-center my-3'>
                  User Profile
                </Card.Text>
              </CardHeader>
              <Card.Text className=' fs-6 text-center text-lowercase mt-4 mb-1'>
                Input information for personalized daily nutritional goals
              </Card.Text>
              <Form className='newUser-info' onSubmit={handleSubmit}>
                <Card.Text className='text-lowercase'>
                  <InputGroup className='m-3' style={{ width: '29rem' }}>
                    <InputGroup.Text style={{ minWidth: '11vh' }}>
                      Username
                    </InputGroup.Text>
                    <Form.Control
                      type='text'
                      placeholder='Enter username'
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setErrorNull('username');
                      }}
                      isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.username}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <FloatingLabel
                    controlId='floatingSelect'
                    label='Choose Your Goal:'
                    className='m-3'
                  >
                    <Form.Select
                      aria-label='Floating label select example'
                      id='filterGoal'
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    >
                      <option value='' disabled hidden></option>
                      <option value='General well-being'>
                        General well-being
                      </option>
                      <option value='Weight loss'>Weight loss</option>
                      <option value='Muscle gain'>Muscle gain</option>
                      <option value='High-performance athlete'>
                        High-performance athlete
                      </option>
                      {/* depending on what is selected, alter goal calculations */}

                      {/* 3 or 4 different calculations dependinng on user's goal */}
                    </Form.Select>
                  </FloatingLabel>

                  <FloatingLabel
                    controlId='floatingSelectGrid'
                    label='Activity Level'
                    className='m-3'
                  >
                    <Form.Select
                      aria-label='Floating label select example'
                      id='filterActivityLevel'
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value)}
                    >
                      <option value='' disabled hidden></option>
                      <option value='Not active'>Not active</option>
                      <option value='Lightly active'>Lightly active</option>
                      <option value='Moderately active'>
                        Moderately active
                      </option>
                      <option value='Very active'>Very active</option>
                      <option value='Extra active'>Extra active</option>
                    </Form.Select>
                  </FloatingLabel>

                  <FloatingLabel
                    controlId='floatingSelectGrid'
                    label='Assigned Sex at Birth:'
                    className='m-3'
                  >
                    <Form.Select
                      aria-label='Floating label select example'
                      id='assigned-sex'
                      value={assignedSex}
                      onChange={(e) => setAssignedSex(e.target.value)}
                    >
                      <option value='' disabled hidden></option>
                      <option value='Female'>Female</option>
                      <option value='Male'>Male</option>
                    </Form.Select>
                  </FloatingLabel>
                  <br></br>
                  <Row>
                    <InputGroup className='mb-3 m-3' style={{ width: '30rem' }}>
                      <InputGroup.Text style={{ minWidth: '11vh' }}>
                        Height (ft)
                      </InputGroup.Text>
                      <Form.Control
                        aria-label='Dollar amount (with dot and two decimal places)'
                        type='number'
                        placeholder='Feet'
                        required
                        value={heightFeet || ''}
                        onChange={(e) => {
                          setHeightFeet(e.target.value);
                          setErrorNull('heightFeet');
                        }}
                        isInvalid={!!errors.heightFeet}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.heightFeet}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup className='m-3' style={{ width: '30rem' }}>
                      <InputGroup.Text style={{ minWidth: '11vh' }}>
                        Height (in)
                      </InputGroup.Text>
                      <Form.Control
                        aria-label='Dollar amount (with dot and two decimal places)'
                        type='number'
                        required
                        placeholder='Inches'
                        value={heightInches || ''}
                        onChange={(e) => {
                          setHeightInches(e.target.value);
                          setErrorNull('heightInches');
                        }}
                        isInvalid={!!errors.heightInches}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.heightInches}
                      </Form.Control.Feedback>
                    </InputGroup>

                    {/* in onchange, convert from ft & inches to just inches */}
                    {/* could do drag bar for height/weight or let people put in number in ft & inches and we can calculate */}

                    <InputGroup className='m-3' style={{ width: '30rem' }}>
                      <InputGroup.Text style={{ minWidth: '11vh' }}>
                        Weight (lb)
                      </InputGroup.Text>
                      <Form.Control
                        aria-label='Dollar amount (with dot and two decimal places)'
                        type='number'
                        required
                        placeholder='Pounds'
                        value={weight || ''}
                        onChange={(e) => {
                          setWeight(e.target.value);
                          setErrorNull('weight');
                        }}
                        isInvalid={!!errors.weight}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.weight}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup className='m-3' style={{ width: '30rem' }}>
                      <InputGroup.Text style={{ minWidth: '11vh' }}>
                        Age
                      </InputGroup.Text>
                      <Form.Control
                        aria-label='Dollar amount (with dot and two decimal places)'
                        type='number'
                        required
                        placeholder='Age'
                        value={age || ''}
                        onChange={(e) => {
                          setAge(e.target.value);
                          setErrorNull('age');
                        }}
                        isInvalid={!!errors.age}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.age}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <Button
                      className='m-4'
                      variant='dark'
                      type='submit'
                      style={{ maxWidth: '29rem' }}
                      onClick={CalculateBMRAndActivityLevel(
                        activityLevel,
                        heightFeet,
                        heightInches,
                        weight,
                        assignedSex,
                        age
                      )}
                    >
                      Submit
                    </Button>
                  </Row>
                  <Button
                    className='m-4'
                    variant='danger'
                    style={{ width: '3rem' }}
                  >
                    {' '}
                    <Link
                      to='/'
                      style={{ textDecoration: 'none', color: '#cccccc' }}
                    >
                      x
                    </Link>
                  </Button>
                </Card.Text>
              </Form>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default NewUser;
