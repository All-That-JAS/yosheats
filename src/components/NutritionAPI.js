import React, { useState } from 'react';
import egg from './eggsoutline.png';
import { fetchNutrition } from '../api/fetchNutrition'

import './Nutrition.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [nutrition, setNutrition] = useState({});

  const search = async (e) => {
    if (e.key === 'Enter') {
      const data = await fetchNutrition(query);
      console.log(data);
      setNutrition(data);
      setQuery('');
    }
  };

  return (
    <div className='main-container'>
      <input
        type='text'
        className='search'
        placeholder='Search...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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

          <div className='info'>
            <img className='egg-icon' src={egg} alt={'yoshi egg'} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
