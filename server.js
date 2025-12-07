// server.js
const express = require('express');
const renderApi = require('@api/render-api');
const path = require('path');
require('dotenv').config(); // load environment variables

const createServer = () => {
  const app = express();

  const PORT = process.env.PORT || 3000;
  const API_KEY = process.env.RENDER_API_KEY;
  const RESOURCE_ID = process.env.RENDER_RESOURCE_ID;

  if (!API_KEY || !RESOURCE_ID) {
    throw new Error('RENDER_API_KEY and RENDER_RESOURCE_ID must be set in .env');
  }

  renderApi.auth(API_KEY);

  // Serve static files
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

  return {
    app,
    start: () => app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
  };
};

module.exports = { createServer };
