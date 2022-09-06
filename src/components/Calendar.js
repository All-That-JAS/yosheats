import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, Container, Col, Row, Button } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

import { motion } from 'framer-motion';


function CalendarApp() {
  const [date, setDate] = useState(new Date());
  const [foodList, setFoodList] = useState([]);
  const [pickedDate, setPickedDate] = useState();


  const { currentUser } = useAuth();

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

  async function handleClick() {
    const selectedDate =
      date.toDateString().split(' ')[3] +
      '-' +
      month +
      '-' +
      date.toDateString().split(' ')[2];

    const formattedDate = `${month}/${date.toDateString().split(' ')[2]}/${
      date.toDateString().split(' ')[3]
    }`;

    setPickedDate(formattedDate);

    const userSelectedDate = doc(db, 'user-days', selectedDate);
    const getUserSelectedDate = async () => {
      const selectedDateDocSnap = await getDoc(userSelectedDate);

      selectedDateDocSnap.exists() &&
      selectedDateDocSnap.data()[`${currentUser.uid}`]
        ? setFoodList(
            selectedDateDocSnap.data()[`${currentUser.uid}`].listOfFoods
          )
        : setFoodList([]);
    };
    getUserSelectedDate();
  }

  return (
    <motion.div
      className='app'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container>
        <Row>
          <Col>
            <Card className='my-2'>
              <Card.Header>
                <Card.Text className=' fw-bolder fs-4 text-center'>
                  Log History
                </Card.Text>
              </Card.Header>
              <Card.Body>
                <Card.Text className=' fs-6 text-center text-lowercase '>
                  Please select and submit a date
                  <br></br>to preview past food logs
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className='my-2 '>
            <div className='d-flex justify-content-center'>
              <div>
                <Calendar onChange={setDate} value={date} />
              </div>
              <p className='my-3' style={{ color: '#cccccc' }}></p>
            </div>
          </Col>
          <Col className='my-2 '>
            <Card className=''>
              <Card.Header>
                <Card.Text className=' fw-bolder fs-4 text-center'>
                  {pickedDate
                    ? `Food eaten on ${pickedDate}`
                    : `Date not submitted`}
                </Card.Text>
              </Card.Header>
              <Card.Body>
                <Card.Text className=' fs-6 text-center text-lowercase mb-2'>
                  {pickedDate
                    ? foodList.length > 0
                      ? foodList.map((food) => {
                          return (
                            <>
                              <span>
                                <strong>{Object.keys(food)[0]}: </strong>
                                {Math.round(Object.values(food)[0])} grams
                              </span>
                              <br></br>
                            </>
                          );
                        })
                      : "You don't have any entries for this date."
                    : null}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
          <Col>
            <div className='d-flex justify-content-center'>
              <Button variant='dark' onClick={() => handleClick()}>
                Submit
              </Button>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </motion.div>
  );
}

export default CalendarApp;
