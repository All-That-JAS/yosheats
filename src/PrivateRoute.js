import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  return currentUser ? (
    children
  ) : (
    <div>
      <Navigate to='/login' />
      
    </div>
  );
  //if user exists, then render out component passed into class then pass in props
  //ELSE redirect bc user doesnt exist
}
