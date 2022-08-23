import React, { useState } from 'react';
import egg from './eggsoutline.png';
import { fetchNutrition } from '../api/fetchNutrition';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

import './Nutrition.css';

const App = () => {
  const [queryState, setQueryState] = useState('');
  const [nutrition, setNutrition] = useState({});

  const search = async (e) => {
    if (e.key === 'Enter') {
      const data = await fetchNutrition(queryState);
      console.log('hi from search', data);
      setNutrition(data);
      setQueryState('');
    }
  };
  const { currentUser } = useAuth();

  const date = new Date();
  const todayDate =
    Date().split(' ')[3] +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    Date().split(' ')[2];


const q = query(collection(db, 'user-days'), where('userId', '===', `${currentUser.uid}`));
 
//TODO: DO WE NEED THIS? Get rid of this if unused
// const userDaysCollection = db
  //   .collection('user-days')
  //   .where('userId', '===', `${currentUser.uid}`);

    // if (userDaysCollection)
/* if this collection includes today's day
*/

  const dayDoc = doc(db, 'user-days', todayDate);

  function handleSubmit(e) {
    e.preventDefault();
  }

  async function handleClick() {
 
    //add a check to see uuid
    // console.log('daydoc', dayDoc);
    // console.log('inside await - user', currentUser);
    // console.log('inside await - collection', userDaysCollection);

    await setDoc(dayDoc, {
      calories: nutrition.items[0].calories,
      totalFat: nutrition.items[0].fat_total_g,
      totalCarb: nutrition.items[0].carbohydrates_total_g,
      protein: nutrition.items[0].protein_g,
    });

    //TODO: work on getting each doc 
    const querySnapshot = await getDocs(q);
    await querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log('query', doc.id, " => ", doc.data());
      console.log('doc', doc)
    });

  }

  /* onsubmit - add item to doc with today's date
   */

  return (
    <div className='main-container'>
      <input
        type='text'
        className='search'
        placeholder='Search...'
        value={queryState}
        onChange={(e) => setQueryState(e.target.value)}
        onKeyPress={search}
      />
      {nutrition.items && (
        <div className='city'>
          <div className='city-name'>
            <h3>
              Food:{' '}
              {nutrition.items[0].name[0].toUpperCase() +
                nutrition.items[0].name.slice(1)}
            </h3>
            <h6>
              {/* 1 serving size = 100g / do some math here
allow user to toggle (-/+) size

 */}
              <p>Serving Size(g): {nutrition.items[0].serving_size_g}</p>
              <p>Calories: {nutrition.items[0].calories}</p>
              <p>Total Fat(g): {nutrition.items[0].fat_total_g}</p>
              <p>Sodium(mg): {nutrition.items[0].sodium_mg}</p>
              <p>
                Total Carbohydrates(g):{' '}
                {nutrition.items[0].carbohydrates_total_g}
              </p>
              <p>Sugar(g): {nutrition.items[0].sugar_g}</p>
              <p>Protein(g): {nutrition.items[0].protein_g}</p>
            </h6>
          </div>

          <button type='submit' onClick={handleClick}>
            Add to Log
          </button>

          <div className='info'>
            <img className='egg-icon' src={egg} alt={'yoshi egg'} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
