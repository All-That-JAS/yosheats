import React, { useState, useEffect } from 'react';
import { db } from '../firebase'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';

/* NOTES from CRUD Firebase Video
use effect hooks occurs when page renders
    good place to do api call
getDocs is built in function in firebase
addDoc will be a way to create new user - 2 parameters (ref, obj with payload to add)
*/



const UserDisplay = () => {
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, 'users');

  const createUser = async () => {
    await addDoc(usersCollectionRef, { name: newName, age: newAge });
  };

  const updateUser = async (id, age) => {
    //need to get id of document
    const userDoc = doc(db, 'users', id);
    const newFields = { age: Number(age) + 1 };
    await updateDoc(userDoc, newFields);
  };
  const deleteUser = async (id) => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
  };
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      console.log(data.docs)
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);
  return (
    <div>
      {/* <Navbar /> */}
      <input
        placeholder='Name'
        onChange={(event) => setNewName(event.target.value)}
      />
      <input
        type='number'
        placeholder='Age'
        onChange={(event) => setNewAge(event.target.value)}
      />
      <button onClick={createUser}>Create User</button>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <h1>Name: {user.name}</h1>
            <h1>Age: {user.age}</h1>
            <button onClick={() => updateUser(user.id, user.age)}>
              Increase Age
            </button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
};

export default UserDisplay;