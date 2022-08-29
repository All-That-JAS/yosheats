// DOES NOT WORK FOR SOME REASON. using temp email site
// very similar to Login Page

import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Col, Container, Row  } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CardHeader from 'react-bootstrap/esm/CardHeader';

import { useAuth } from '../contexts/AuthContext';

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage('Check your inbox for further instructions');
    } catch {
      setError('Failed to reset password');
    }
    setLoading(false);
  }

  return (
    <>
    <Container>
        <Row>
          <Col></Col>
          <Col><Card>
          <CardHeader>
                <Card.Text className='fw-bolder fs-4 text-center my-3'>
                Reset Password
                </Card.Text>
              </CardHeader>
        <Card.Body>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email </Form.Label>
              <Form.Control ref={emailRef} type='email' required />
            </Form.Group>
            <Button disabled={loading} className='w-100 mt-3' type='submit'>
              Reset Password
            </Button>
          </Form>
          <div className='w-100 text-center mt-3'>
            <Link to='/login'>Login</Link>
          </div>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        Need an account? <Link to='/signup'>Sign Up</Link>
      </div></Col>
          <Col></Col>
          </Row>
          </Container>
      
    </>
  );
}
