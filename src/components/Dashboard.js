import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  let navigate = useNavigate();

  async function handleLogout() {
    setError('');
    try {
        await logout()
        navigate('/');
    } catch {
        setError ('Failed to log out')
    }
  }
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>My Dashboard</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <strong>Email: </strong>
          {currentUser.email}
          <br>
          </br>
          {/* .displayName is for google accounts */}
          {!currentUser.displayName ? null : ( 
          <div> 
            <strong>Name: </strong>
          {currentUser.displayName} 
          </div>) 
          }
          
          <Link to='/update-profile' className='btn btn-primary w-100 mt-3'>
            Update Profile
          </Link>
          <Link to='/nutrition' className='btn btn-primary w-100 mt-3'>
            Nutrition Information
          </Link>
        
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Button variant = "link" onClick={handleLogout}>Log Out</Button>
      </div>
    </>
  );
};

export default Dashboard;
