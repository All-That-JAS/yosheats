import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {signInWithGooglePopUp} from '../contexts/AuthContext'


export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const {login} = useAuth();
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

  function handleGoogleLogIn () {
    try {
      signInWithGooglePopUp();
      navigate('/');
    } catch {
      setError('Failed to sign in to account');
    }
    setLoading(false);
  }
  

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Log In</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email </Form.Label>
              <Form.Control ref={emailRef} type='email' required />
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Password </Form.Label>
              <Form.Control ref={passwordRef} type='password' required />
            </Form.Group>
            <Button disabled={loading} className='w-100' type='submit'>
              Login
            </Button>
          </Form>
          <div className = 'w-100 text-center mt-3'>
<Link to = '/forgot-password'>Forgot Password?</Link>
          </div>
          <div className = 'w-100 text-center mt-3 login-with-google-btn" >'>
<Button onClick = {handleGoogleLogIn}>Sign in With Google</Button>
          </div>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        Need an account? <Link to='/signup'>Sign Up</Link>
      </div>
    </>
  );
}
