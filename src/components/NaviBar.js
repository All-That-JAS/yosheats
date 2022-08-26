import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function Navibar() {
  return (
    <>
      <Navbar bg='light' variant='light'>
        <Container>
          <Navbar.Brand>
            <Link style={{ textDecoration: 'none', color: '#818080' }} to='/'>
              Yosheats
            </Link>
          </Navbar.Brand>
          <Nav className='me-auto'>
            <NavLink>
              <Link style={{ textDecoration: 'none', color: '#818080' }} to='/'>
                Home
              </Link>
            </NavLink>
            <NavLink>
              <Link style={{ textDecoration: 'none', color: '#818080' }} to='/nutrition'>
                Nutrition
              </Link>
            </NavLink>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navibar;
