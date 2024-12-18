const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Root route: Welcomes users to the API
app.get('/', (req, res) => {
  res.send('Welcome to the Dishcovery API!');
});

// Random meal endpoint
app.get('/api/random', async (req, res) => {
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
    res.json(response.data.meals[0]);
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    res.status(500).json({ error: 'Failed to fetch random recipe' });
  }
});

// Search meals endpoint
app.get('/api/search', async (req, res) => {
  const query = req.query.q; // e.g., ?q=chicken
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    res.json(response.data.meals || []);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// search for specific food item
app.get('/api/meal/:id', async (req, res) => {
    const mealId = req.params.id;
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      res.json(response.data.meals[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch meal details' });
    }
  });

  // get cuisines 
  app.get('/api/cuisines', async (req, res) => {
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
      res.json(response.data.meals);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cuisines' });
    }
  });

  // get meals by area
  app.get('/api/meals/:area', async (req, res) => {
    const area = req.params.area;
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
      res.json(response.data.meals);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch meals for area: ${area}` });
    }
  });
  
const PORT = 5001; // Use port 5001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
