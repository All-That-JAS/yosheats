import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import NutritionAPI from './components/NutritionAPI';
import NewUser from './components/NewUser';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PrivateRoute from './PrivateRoute';
import UpdateUser from './components/UpdateUser';
import ForgotPassword from './components/ForgotPassword';
import DailyLog from './components/DailyLog';
import Recommendation from './components/Recommendation';

import { Container } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext';
import CalendarApp from './components/Calendar';

function RouteList() {
  return (
    <Container
      style={{ minHeight: '60vh' }}
      className="d-flex align-items-center justify-content-center"
    >
      <div className="w-100" >
        <AuthProvider>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <PrivateRoute>
                  {' '}
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/update-profile"
              element={
                <PrivateRoute>
                  {' '}
                  <UpdateUser />
                </PrivateRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/nutrition" element={<NutritionAPI />} />
            <Route path="/newuser" element={<NewUser />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dailylog" element={<DailyLog />} />
            <Route path="/calendar" element={<CalendarApp />} />
            <Route path="/rec" element={<Recommendation />} />
          </Routes>
        </AuthProvider>
      </div>
    </Container>
  );
}

export default RouteList;
