import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Nav,
  Navbar,
  Container,
  NavLink,
  NavDropdown,
  Button,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../images/logo.png';
import mush from '../images/toad.png'

const Navibar = () => {
  const [error, setError] = useState('');
  const logout = useAuth();
  let navigate = useNavigate();

  //TODO: dev tool error, cannot destructure logout; therefore link broken

  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate('/');
    } catch {
      setError('Failed to log out');
      console.log('error');
    }
  }
  return (
    <>
      <Navbar bg='light' variant='light' style={{ maxHeight: '55px' }}  className='container-fluid'>
        <Container className='container-fluid d-flex justify-content-center'>
          <Navbar.Brand>
            <Link style={{ textDecoration: 'none', color: '#818080' }} to='/'>
              <img
                src={logo}
                width='50'
                height='50'
                // className='d-inline-block align-top'
                alt='egg'
              />
            </Link>
          </Navbar.Brand>
          <Nav className='me-auto'>
            <NavLink>
              <Link style={{ textDecoration: 'none', color: '#818080' }} to='/'>
                Home
              </Link>
            </NavLink>
            <NavLink>
              <Link
                style={{ textDecoration: 'none', color: '#818080' }}
                to='/nutrition'
              >
                Nutrition
              </Link>
            </NavLink>
            <NavLink>
              <Link
                style={{ textDecoration: 'none', color: '#818080' }}
                to='/calendar'
              >
                Calendar
              </Link>
            </NavLink>

            {/* dropdown / log out nonfunctional */}
            <NavDropdown
              title='🍄'
              id='collasible-nav-dropdown'
              className='ms-5 text-center'
            >
              <NavDropdown.Item>
                <Link
                  style={{ textDecoration: 'none', color: '#818080' }}
                  to='/update-profile'
                >
                  Profile
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link
                  style={{ textDecoration: 'none', color: '#818080' }}
                  to='/dailylog'
                >
                  Daily Log
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={handleLogout}
                style={{ textDecoration: 'none', color: '#818080' }}
              >
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Navibar;
