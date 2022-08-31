import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, Container, Col, Row } from 'react-bootstrap';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

function CalendarApp() {
  const [date, setDate] = useState(new Date());

  let month = date.toDateString().split(' ')[1];
  switch (month) {
    case 'Jan':
      month = '1';
      break;
    case 'Feb':
      month = '2';
      break;
    case 'Mar':
      month = '3';
      break;
    case 'Apr':
      month = '4';
      break;
    case 'May':
      month = '5';
      break;
    case 'Jun':
      month = '6';
      break;
    case 'Jul':
      month = '7';
      break;
    case 'Aug':
      month = '8';
      break;
    case 'Sep':
      month = '9';
      break;
    case 'Oct':
      month = '10';
      break;
    case 'Nov':
      month = '11';
      break;
    default:
      month = '12';
  }

  const selectedDate =
    date.toDateString().split(' ')[3] +
    '-' +
    month +
    '-' +
    date.toDateString().split(' ')[2];

  const userSelectedDate = doc(db, 'user-days', selectedDate);
  const getUserSelectedDate = async () => {
    await getDoc(userSelectedDate);
    return userSelectedDate;
  };

  return (
    <div className="app">
      <Container>
        <Row>
          <Col></Col>
          <Col>
            <Card className="my-4 " style={{ width: '24rem' }}>
              <Card.Header>
                <Card.Text className=" fw-bolder fs-4 text-center">
                  User History
                </Card.Text>
              </Card.Header>
              <Card.Body>
                <Card.Text className=" fs-6 text-center text-lowercase mb-2">
                  Choose a date to preview past food logs
                </Card.Text>
              </Card.Body>
            </Card>

            <div className="calendar-container ">
              <Calendar onChange={setDate} value={date} />
            </div>
            <p className="my-3" style={{ color: '#cccccc' }}>
              {/* <span className="bold">Selected Date:</span> {date.toDateString()} */}
            </p>

            <button onClick={() => console.log(getUserSelectedDate())}>
              date
            </button>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}

export default CalendarApp;
