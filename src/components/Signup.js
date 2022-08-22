import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const {signup} = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  //loading will only allow user to press sign up once

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
    } catch {
      console.log(e)
      setError('Failed to create an account');
    }
    setLoading(false);
    navigate('/newuser');
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Sign Up</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email </Form.Label>
              <Form.Control ref={emailRef} type='email' required />
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Password </Form.Label>
              <Form.Control ref={passwordRef} type='password' required />
            </Form.Group>
            <Form.Group id='password-confirm'>
              <Form.Label>Password Confirmation </Form.Label>
              <Form.Control ref={passwordConfirmRef} type='password' required />
            </Form.Group>
            <Button disabled={loading} className='w-100 mt-3' type='submit'>
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        Already have an account? <Link to='/login'>Log in!</Link>
      </div>
    </>
  );
}