import React from 'react';
import {
  Route,
  Routes,
  BrowserRouter as Router,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Container } from 'react-bootstrap';

import { AuthProvider } from './contexts/AuthContext';
import NutritionAPI from './components/NutritionAPI';
import NewUser from './components/NewUser';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PrivateRoute from './PrivateRoute';
import UpdateUser from './components/UpdateUser';
import ForgotPassword from './components/ForgotPassword';
import DailyLog from './components/DailyLog';
import NotFound from './components/NotFound';
import CalendarApp from './components/Calendar';

import DailyLogCarousel from './components/DailyLogCarousel'

function RouteList() {
  const location = useLocation();
  return (
    <Container
      style={{ minHeight: '60vh' }}
      className='d-flex align-items-center justify-content-center'
    >
      <div className='w-100'>
        <AuthProvider>
          <AnimatePresence>
            <Routes location={location} key={location.pathname}>
              <Route
                exact
                path='/'
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                exact
                path='/calendar'
                element={
                  <PrivateRoute>
                    <CalendarApp />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/dailylog'
                element={
                  <PrivateRoute>
                    <DailyLog />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/nutrition'
                element={
                  <PrivateRoute>
                    <NutritionAPI />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/update-user'
                element={
                  <PrivateRoute>
                    <NewUser />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path='/update-profile'
                element={
                  <PrivateRoute>
                    <UpdateUser />
                  </PrivateRoute>
                }
              />

              <Route path='/signup' element={<Signup />} />
              <Route path='/daily' element={<DailyLogCarousel />} />
              <Route path='/login' element={<Login />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              {/* TODO: Not Found page & check difference between updateUser & newUser */}
              <Route path = "*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </div>
    </Container>
  );
}

export default RouteList;
