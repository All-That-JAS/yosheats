import axios from 'axios';

// require('dotenv').config();
// const API_KEY = process.env.NUTRITION_API_KEY
const API_KEY = 'facb73a640msh588e2977227516ep15652fjsnec1bb3f103ac';

const URL = 'https://calorieninjas.p.rapidapi.com/v1/nutrition';

export const fetchNutrition = async (query) => {
  // const token - needed?
  const { data } = await axios.get(URL, {
    params: {
      query: query,
        units: 'metric',
    },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'calorieninjas.p.rapidapi.com',
    },
  });
  return data;
};
