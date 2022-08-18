import React, { useState } from 'react';

import { fetchNutrition } from './api/fetchNutrition';
import './App.css';

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
//   let foodItem = nutrition.items[0];

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
          <h2 className='city-name'>
            <span>{nutrition.items[0].name}</span>

            <span>{nutrition.items[0].calories}</span>
          </h2>

          <div className='info'>
            {/* <img
              className='city-icon'
              src={`https://opennutritionmap.org/img/wn/${nutrition.nutrition[0].icon}@2x.png`}
              alt={nutrition.nutrition[0].description}

            /> */}
            {/* <p>{nutrition.nutrition[0].description}</p> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
