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

import helloNintendo from '../images/hello-nintendo.webp';
import party from 'party-js';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, signInWithGooglePopUp } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  //loading will only allow user to press sign up once
  /* useRef vs useState
  Basically, it's very similar to useState. But when the value store in useRef, the component will not re-render if the value has changed. And it's popular to use it to reference a HTML element.
  */

  async function handleLoginSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      party.confetti(e.target);
      navigate('/');
    } catch {
      setError('Failed to sign in to account');
    }
    setLoading(false);
  }

  async function handleGoogleLogIn(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signInWithGooglePopUp();
      navigate('/');
    } catch {
      setError('Failed to sign in to account');
    }
    setLoading(false);
  }

  return (
    <>
      <Container className='mt-5'>
        <Row>
          <Col></Col>
          <Col>
            <Card style={{ width: '30rem' }}>
              <CardHeader>
                <Card.Text className='fw-bolder fs-4 text-center my-3'>
                  <img
                    className='me-5'
                    src={helloNintendo}
                    alt='nintendo party'
                    style={{ maxWidth: '7rem' }}
                  ></img>
                  Log In
                  <img
                    className='ms-5'
                    src={helloNintendo}
                    alt='nintendo party'
                    style={{ maxWidth: '7rem', transform: 'scaleX(-1)' }}
                  ></img>
                </Card.Text>
              </CardHeader>
              <Card.Body>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Card.Text className='fw-bolder fs-6 text-center '>
                  Sign In With Google
                </Card.Text>
                <div className=' text-center'>
                  <Button
                    className='rounded-pill'
                    style={{ width: '10rem', color: '#FFFDFD' }}
                    variant='info'
                    onClick={handleGoogleLogIn}
                  >
                    Google
                  </Button>
                </div>
                <Card.Text className='fs-6 fw-bolder mb-4 text-center  mt-4'>
                  Sign In With Email And password{' '}
                </Card.Text>

                <Form onSubmit={handleLoginSubmit}>
                  <Form.Group id='email' className='my-2'>
                    <Form.Label>
                      <Card.Text className='fs-6 fw-light text-center  text-lowercase '>
                        email
                      </Card.Text>
                    </Form.Label>
                    <Form.Control ref={emailRef} type='email' required />
                  </Form.Group>
                  <Form.Group id='password' className='my-2'>
                    <Form.Label>
                      {' '}
                      <Card.Text className='fs-6 fw-light text-center  text-lowercase '>
                        password
                      </Card.Text>
                    </Form.Label>
                    <Form.Control ref={passwordRef} type='password' required />
                  </Form.Group>

                  <div className=' text-center'>
                    <Button
                      disabled={loading}
                      className='mt-3  rounded-pill'
                      type='submit'
                      style={{ width: '10rem', color: '#FFFDFD' }}
                    >
                      Login
                    </Button>
                  </div>
                </Form>
                <Card.Text className='mt-3 text-lowercase'>
                  <div>
                    <div className='d-flex justify-content-between'>
                      <Link
                        to='/forgot-password'
                        className='text-decoration-none'
                      >
                        Forgot Password?
                      </Link>{' '}
                      <span className='ms-5'>
                        <Link to='/signup' className='text-decoration-none'>
                          Sign Up
                        </Link>
                      </span>
                    </div>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}
