import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, Container, Col, Row } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

function CalendarApp() {
  const [date, setDate] = useState(new Date());
  const [foodList, setFoodList] = useState([]);
  // const [gramsList, setGramsList] = useState([]);

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

    const userSelectedDate = doc(db, 'user-days', selectedDate);
    const getUserSelectedDate = async () => {
      const selectedDateDocSnap = await getDoc(userSelectedDate);
      let foodArray = [];
      let gramsArray = [];
      selectedDateDocSnap
        .data()
        [`${currentUser.uid}`].listOfFoods.forEach((eachFood) =>
          foodArray.push(Object.keys(eachFood)[0])
        );
      selectedDateDocSnap
        .data()
        [`${currentUser.uid}`].listOfFoods.forEach((eachFood) =>
          gramsArray.push(Object.values(eachFood)[0])
        );

      setFoodList(selectedDateDocSnap.data()[`${currentUser.uid}`].listOfFoods);
    };
    getUserSelectedDate();
  }

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

            <button onClick={() => handleClick()}>Submit</button>
          </Col>
          <Col></Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col>
            <Card className="my-4 " style={{ width: '24rem' }}>
              <Card.Header>
                <Card.Text className=" fw-bolder fs-4 text-center">
                  Foods on {month}/{date.toDateString().split(' ')[2]}/
                  {date.toDateString().split(' ')[3]}:
                </Card.Text>
              </Card.Header>
              <Card.Body>
                <Card.Text className=" fs-6 text-center text-lowercase mb-2">
                  {foodList.map((food) => {
                    return (
                      <>
                        <span>
                          <strong>{Object.keys(food)[0]}: </strong>
                          {Math.round(Object.values(food)[0])} grams
                        </span>
                        <br></br>
                      </>
                    );
                  })}
                  {console.log(foodList)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CalendarApp;
