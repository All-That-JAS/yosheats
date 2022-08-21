import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import NutritionAPI from './components/NutritionAPI';
import NewUser from './components/NewUser';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PrivateRoute from './PrivateRoute';
import UserDisplay from './components/UserDisplay';
import UpdateUser from './components/UpdateUser';
import ForgotPassword from './components/ForgotPassword';

import { Container } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext';

function RouteList() {
  return (
    <Container
      style={{ minHeight: '100vh' }}
      className='d-flex align-items-center justify-content-center'
    >
      <div className='w-100' style={{ maxWidth: '400px' }}>
        <Router>
          <AuthProvider>
            <Routes>

              <Route
                exact
                path='/'
                element={
                  <PrivateRoute>
                    {' '}
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/update-profile'
                element={
                  <PrivateRoute>
                    {' '}
                    <UpdateUser />
                  </PrivateRoute>
                }
              />
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='/nutrition' element={<NutritionAPI />} />
              <Route path='/newuser' element={<NewUser />} />
              <Route path='/userdisplay' element={<UserDisplay />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default RouteList;
