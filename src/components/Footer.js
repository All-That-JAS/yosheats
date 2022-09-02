import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <>
      <footer>
        <Container>
          <Row>
            <Col className='text-center fw-bolder my-3' style = {{color: '#ffffff',letterSpacing: '3px'}}>
              Copyright &copy; Yosheats
              <br></br>
              *Not affiliated with Nintendo
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}
