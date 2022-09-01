import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Nav,
  Navbar,
  Container,
  NavLink,
  NavDropdown,
  Card,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import party from 'party-js';
import logo from '../images/logo.png';

export default function Navibar() {
  const [error, setError] = useState('');
  const { logout, currentUser } = useAuth();
  let navigate = useNavigate();

  async function handleLogout() {
    setError('');
    try {
      await logout();
      navigate('/');
    } catch {
      setError('Failed to log out');
    }
  }
  return (
    <>
      <Navbar
        bg='light'
        variant='light'
        style={{ maxHeight: '55px' }}
        className='container-fluid'
      >
        <Container>
          <Navbar.Brand>
            <Link
              style={{ textDecoration: 'none', color: '#818080' }}
              to='/'
              id='button'
              onClick={(ev) => party.confetti(ev.target)}
            >
              <img src={logo} width='50' height='50' alt='egg' />
            </Link>
          </Navbar.Brand>
          <div
            className='container-fluid d-flex justify-content-between'
            style={{ fontWeight: 'bolder' }}
          >
            {!currentUser ? null : (
              <>
                <Nav>
                  <NavLink>
                    <Link
                      style={{ textDecoration: 'none', color: '#818080' }}
                      to='/'
                    >
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
                      to='/dailylog'
                    >
                      Daily
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
                </Nav>
                <div>
                  <NavDropdown
                    title='🍄'
                    id='collasible-nav-dropdown'
                    className='mt-2 text-center'
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
                        to='/update-user'
                      >
                        Goals
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
                </div>
              </>
            )}
          </div>
        </Container>
      </Navbar>
    </>
  );
}
