import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, Container, Col, Row } from 'react-bootstrap';

function CalendarApp() {
  const [date, setDate] = useState(new Date());

  return (
    <div className='app'>
      <Container>
        <Row>
          <Col></Col>
          <Col>
            <Card className='my-4 ' style={{ width: '24rem' }}>
              <Card.Header>
                <Card.Text className=' fw-bolder fs-4 text-center'>
                  User History
                </Card.Text>
              </Card.Header>
              <Card.Body>
                <Card.Text className=' fs-6 text-center text-lowercase mb-2'>
                  Choose a date to preview past food logs
                </Card.Text>
              </Card.Body>
            </Card>

            <div className='calendar-container '>
              <Calendar onChange={setDate} value={date} />
            </div>
            <p className='my-3' style={{ color: '#cccccc' }}>
              <span className='bold'>Selected Date:</span> {date.toDateString()}
            </p>
          </Col>

          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}

export default CalendarApp;
