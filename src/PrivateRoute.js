import React from 'react';
import { Route, Navigate, Routes, BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

export default function PrivateRoute({children}) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login"/>
        //if user exists, then render out component passed into class then pass in props
        //ELSE redirect bc user doesnt exist
    
}
 