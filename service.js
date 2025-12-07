const axios = require('axios');

const API_KEY = 'rnd_tCJcmiABQc013Xl3A9WWvXZNh3Pw'; // your valid API key

async function getServices() {
  try {
    const response = await axios.get('https://api.render.com/v1/services', {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
      },
    });
    console.log('Services:', response.data);
  } catch (err) {
    console.error('Error fetching services:', err.response?.data || err.message);
  }
}

getServices();

