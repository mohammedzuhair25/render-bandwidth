const express = require('express');
const renderApi = require('@api/render-api');
const path = require('path');

const app = express();
const PORT = 3000;

// Your Render API key
const API_KEY = 'rnd_tCJcmiABQc013Xl3A9WWvXZNh3Pw';
renderApi.auth(API_KEY);

// Replace with your service ID
const RESOURCE_ID = 'srv-d4pe8cruibrs738pg3e0';

// Serve static files (for index.html)
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch bandwidth data
app.get('/api/bandwidth', async (req, res) => {
  try {
    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endTime = now.toISOString();

    const { data } = await renderApi.getBandwidth({
      startTime,
      endTime,
      resource: RESOURCE_ID
    });

    let totalBandwidth = 0;

    data.forEach(metric => {
      metric.values.forEach(valueObj => {
        for (const key in valueObj) {
          if (typeof valueObj[key] === 'number') {
            totalBandwidth += valueObj[key];
          }
        }
      });
    });

    res.json({
      totalBandwidth,
      unit: data[0]?.unit || 'mb',
      rawData: data
    });
  } catch (err) {
    res.status(500).json({ error: err.message || err });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
