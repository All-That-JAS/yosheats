import React, { useRef, useState } from 'react';
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, doc, getDocs } from 'firebase/firestore';
import party from 'party-js';

import marioLuigi from '../images/marioluigi.gif';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, signInWithGooglePopUp } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  //loading will only allow user to press sign up once

  async function handleGoogleLogIn(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      party.confetti(e.target);
      await signInWithGooglePopUp();
      navigate('/');
    } catch {
      setError('Failed to sign in to account');
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const usersRef = collection(db, 'user-goals');
    const queryRef = query(
      usersRef,
      where('email', '==', emailRef.current.value)
    );
    const docSnap = await getDocs(queryRef);

    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError('Passwords do not match');
    }
    if (
      passwordRef.current.value.length < 6 ||
      passwordConfirmRef.current.value.length < 6
    ) {
      return setError('Password must be at least six characters long');
    }
    if (docSnap.docs.length) {
      return setError(
        'This email has already been used; please use a different email.'
      );
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      console.log(passwordRef.current.value.length);
    } catch {
      console.log(e);
      setError('Failed to create an account');
    }
    setLoading(false);
    navigate('/update-user');
  }

  return (
    <>
      <Container>
        <Row>
          <Col></Col>

          <Col>
            <Card className='mt-5' style={{ width: '50vh' }}>
              <CardHeader>
                <Card.Text className='fw-bolder fs-4 text-center my-3'>
                  <img
                    className='me-5'
                    src={marioLuigi}
                    alt='marioLuigi'
                    style={{ maxWidth: '5rem' }}
                  ></img>
                  Sign Up
                  <img
                    className='ms-5'
                    src={marioLuigi}
                    alt='marioLuigi'
                    style={{ maxWidth: '5rem', transform: 'scaleX(-1)' }}
                  ></img>
                </Card.Text>
              </CardHeader>
              <Card.Body>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Card.Text className='fw-bolder fs-6 text-center '>
                  Sign Up With Google
                </Card.Text>
                <div className=' text-center'>
                  <Button
                    className='rounded-pill mt-2'
                    style={{ width: '10rem', color: '#FFFDFD' }}
                    variant='info'
                    onClick={handleGoogleLogIn}
                  >
                    Google
                  </Button>
                </div>
                <Card.Text className='fs-6 fw-bolder mb-4 text-center  mt-4'>
                  Sign Up With Email And password
                </Card.Text>
                <Card.Text className='fw-light text-lowercase'>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group id='email' className='my-2'>
                      <Form.Label>Email </Form.Label>
                      <Form.Control ref={emailRef} type='email' required />
                    </Form.Group>
                    <Form.Group id='password' className='my-2'>
                      <Form.Label>Password </Form.Label>
                      <Form.Control
                        ref={passwordRef}
                        type='password'
                        required
                      />
                    </Form.Group>
                    <Form.Group id='password-confirm' className='my-2'>
                      <Form.Label>Password Confirmation </Form.Label>
                      <Form.Control
                        ref={passwordConfirmRef}
                        type='password'
                        required
                      />
                    </Form.Group>
                    <div className='text-center'>
                      <Button
                        disabled={loading}
                        className='mt-3 rounded-pill'
                        type='submit'
                        style={{ width: '10rem', color: '#FFFDFD' }}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </Form>
                </Card.Text>
              </Card.Body>
              <Card.Text>
                <div
                  className='text-center  fs-6 mb-4 text-lowercase'
                  style={{ color: '#A08E8E' }}
                >
                  Already have an account?{' '}
                  <Link to='/login' className='text-decoration-none'>
                    Log in!
                  </Link>
                </div>
              </Card.Text>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}
