// DOES NOT WORK FOR SOME REASON. using temp email site
// very similar to Login Page

import React, { useRef, useState } from 'react';
import {
  Form,
  Button,
  Card,
  Alert,
  Col,
  Container,
  Row,
} from 'react-bootstrap';
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
          <Col>
            <Card style={{ maxWidth: '25rem' }}>
              <CardHeader>
                <Card.Text className='fw-bolder fs-4 text-center my-3'>
                  Reset Password
                </Card.Text>
              </CardHeader>
              <Card.Body>
                {error && <Alert variant='danger'>{error}</Alert>}
                <Card.Text className='fw-light text-lowercase'>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group id='email'>
                      <Form.Label>Email </Form.Label>
                      <Form.Control ref={emailRef} type='email' required />
                    </Form.Group>
                    <Button
                      disabled={loading}
                      className='w-100 mt-3 rounded-pill'
                      type='submit'
                    >
                      Reset Password
                    </Button>
                  </Form>

                  <div className='mt-3'>
                    <div className='d-flex justify-content-between'>
                       <Link to='/login' className='text-decoration-none'>
                      Login
                    </Link>
                  
                    <span>
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
