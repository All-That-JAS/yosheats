import React from 'react';
import { Card, Container, Col,  } from 'react-bootstrap';

import bowser from '../images/bowsercollapse.webp';


const NotFound = () => {
  return (
    <div>
      <Container className='d-flex justify-content-center mt-1'>
        <Col>
          <Card className='text-white text-center rounded-pill ' >
            <div className=' text-center'>
              <Card.Img
                src={bowser}
                alt='bowser'
                style={{ width: '25rem' }}
                className='fw-bold fs-2 text-center my-4'
              />
            </div>

            <Card.ImgOverlay>
              <Card.Text className='fw-bold fs-2 text-center text-lowercase my-4' style = {{color: '#F19797'}}>
                Whoops, page not found!
              </Card.Text>
            </Card.ImgOverlay>
          </Card>
        </Col>
      </Container>
    </div>
  );
};

export default NotFound;
