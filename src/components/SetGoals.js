import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

export default function SetGoals() {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState({});

  let userID = currentUser.uid;

  useEffect(() => {
    const getGoals = async () => {
      const goalDoc = doc(db, 'user-goals', userID);
      let data = await getDoc(goalDoc);
      setGoals(data.data());
    };

    getGoals();
  }, [userID]);

  return (
    <>
      {goals.dailyCalories ? (
        <div>
          <Card.Text className=" fw-bolder fs-5 text-center text-decoration-underline">
            Your daily goals
          </Card.Text>
          <Card.Text>Daily Calories: {goals.dailyCalories}</Card.Text>
          <Card.Text>Daily Carbohydrates(g): {goals.dailyCarbs}</Card.Text>
          <Card.Text>Daily Fat(g): {goals.dailyFat}</Card.Text>
          <Card.Text>Daily Protein(g): {goals.dailyProtein}</Card.Text>
        </div>
      ) : (
        <div>
          <Card.Text>
            Please update goals{' '}
            <Link
              style={{ textDecoration: 'none', color: '#818080' }}
              to="/update-user"
            >
              here
            </Link>
            .
          </Card.Text>
        </div>
      )}
    </>
  );
}
