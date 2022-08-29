import axios from 'axios';

const REACT_APP_NUTRITION_API_KEY = process.env.REACT_APP_NUTRITION_API_KEY;

const URL = 'https://calorieninjas.p.rapidapi.com/v1/nutrition';

export const fetchNutrition = async (query) => {
  // const token - needed?
  const { data } = await axios.get(URL, {
    params: {
      query: query,
      units: 'metric',
    },
    headers: {
      'X-RapidAPI-Key': REACT_APP_NUTRITION_API_KEY,
      'X-RapidAPI-Host': 'calorieninjas.p.rapidapi.com',
    },
  });
  return data;
};
