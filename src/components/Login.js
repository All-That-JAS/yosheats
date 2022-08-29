import React, { useRef, useState } from 'react';
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Col,
  Row,
  Badge,
} from 'react-bootstrap';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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
      <Container className='mt-3'>
        <Row>
          <Col></Col>
          <Col>
            <Card style={{ maxWidth: '30rem' }}>
              <CardHeader>
                <Card.Text className='fw-bolder fs-4 text-center my-3'>
                  Log In
                </Card.Text>
              </CardHeader>
              <Card.Body>
                {error && <Alert variant='danger'>{error}</Alert>}

                <Form onSubmit={handleLoginSubmit}>
                  <Form.Group id='email' className='my-2'>
                    <Form.Label>Email </Form.Label>
                    <Form.Control ref={emailRef} type='email' required />
                  </Form.Group>
                  <Form.Group id='password' className='my-2'>
                    <Form.Label>Password </Form.Label>
                    <Form.Control ref={passwordRef} type='password' required />
                  </Form.Group>
                  <Button
                    disabled={loading}
                    className='w-100 mt-3'
                    type='submit'
                  >
                    Login
                  </Button>
                </Form>
                <div className='mt-3'>
                  <Link to='/forgot-password'>Forgot Password?</Link>{' '}
                  <span className='ms-5'>
                    <Link to='/signup'> Need an account? Sign Up</Link>
                  </span>
                </div>
                <div className=' text-end mt-3'>
                  <Button variant='info' onClick={handleGoogleLogIn}>
                    Google
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}
