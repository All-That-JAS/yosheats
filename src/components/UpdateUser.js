//very similar to SignIn
import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function UpdateUser() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updateUserEmail, updateUserPassword } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  //loading will only allow user to press sign up once

   function handleSubmit(e) {
    e.preventDefault();
    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError('Passwords do not match');
    }

    const promises = [];
      setLoading(true);
      setError('');
  
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateUserEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updateUserPassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        setError('Failed to update account');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Update Profile</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email </Form.Label>
              <Form.Control
                ref={emailRef}
                type='email'
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Password </Form.Label>
              <Form.Control
                ref={passwordRef}
                type='password'
                placeholder='Leave blank to keep the same'
              />
            </Form.Group>
            <Form.Group id='password-confirm'>
              <Form.Label>Password Confirmation </Form.Label>
              <Form.Control
                ref={passwordConfirmRef}
                type='password'
                placeholder='Leave blank to keep the same'
              />
            </Form.Group>
            <Button disabled={loading} className='w-100' type='submit'>
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Link to='/'>Cancel</Link>
      </div>
    </>
  );
}
