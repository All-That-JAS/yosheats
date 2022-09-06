//TODO: BROKEN
import React, { useState, useRef } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import app from '../firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  setDoc,
  getDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase';

import Chatroom from './Chatroom';
import { useAuth } from '../contexts/AuthContext';

export default function Chat() {
  const messagesRef = collection(db, 'messages');
  const chatQuery = query(messagesRef, orderBy('createdAt'), limit(25));
  //listen to data with hook
  //returns array of objects where each object is each chat msg in db
  const [messages] = useCollectionData(chatQuery, { idField: 'id' });
  const [formValue, setFormValue] = useState('');
  const [textArray, setTextArray] = useState([]);

  const { currentUser } = useAuth();
  const { text, uid, photoURL } = currentUser;
  // const dummy = useRef(null);

  const SendMessage = async (e) => {
    e.preventDefault();

    const messageDoc = doc(db, 'messages', currentUser.uid);
    const userMessage = doc(db, `messages/${currentUser.uid}`);
    const messageSnap = await getDoc(messageDoc);
    let docSnapTextArray = messageSnap.data().text;

    // if (messageSnap.exists() && messageSnap.data()[`${currentUser.uid}`])

    // let textArray = docSnapTextArray.push(formValue);
    let initialForm = formValue;
    console.log('docsnap', docSnapTextArray);
    console.log('text arry', textArray);

    //TODO: useState or useEffect

    if (messageSnap.exists()) {
      await updateDoc(messageDoc, {
        text: textArray,
        createdAt: serverTimestamp(),
        uid,
        photoURL,
        id: increment(1),
      });
    }
    if (!messageSnap.exists()) {
      setDoc(userMessage, {
        text: [formValue],
        createdAt: serverTimestamp(),
        uid,
        photoURL,
        id: 0,
      });
    }
    const docSnap = await getDocs(chatQuery);
    
    setFormValue('');
    setTextArray(docSnapTextArray.push(formValue));
    // dummy.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Card className='card text-white bg-secondary my-5'>
        <div className='message-container'>
          {console.log('msgs', messages)}
          {messages &&
            messages.map((msg) => <Chatroom key={msg.id} message={msg} />)}
        </div>
        <form onSubmit={SendMessage} className='message-form'>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder='say something nice'
          ></input>
          <Button type='submit' disabled={!formValue}>
            🕊️
          </Button>
        </form>
      </Card>
    </>
  );
}
