import React, { useState } from 'react';
import { Card, Button, Alert, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { getDoc, setDoc, updateDoc, doc } from 'firebase/firestore';

export default function DailyGoals() {
  const { currentUser, logout } = useAuth();
  let userID = currentUser.uid;
  const date = new Date();
  const todayDate =
    Date().split(' ')[3] +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    Date().split(' ')[2];

  let goalSnap;

  async function handleDailyGoals() {
    const goalDoc = doc(db, 'user-goals', userID);
    const goalSnap = await getDoc(goalDoc);
    console.log('goal daydoc', goalSnap.data());
    goalSnap = goalSnap.data();
    return goalSnap;
  }
  
  return (
    <div>
      {' '}
      hi
      {goalSnap}
    </div>
  );
}
