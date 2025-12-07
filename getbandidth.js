const renderApi = require('@api/render-api');

const API_KEY = 'rnd_tCJcmiABQc013Xl3A9WWvXZNh3Pw';
renderApi.auth(API_KEY);

const now = new Date();
const startTime = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
const endTime = now.toISOString();

const RESOURCE_ID = 'srv-d4pe8cruibrs738pg3e0';

async function fetchBandwidth() {
  try {
    const { data } = await renderApi.getBandwidth({
      startTime,
      endTime,
      resource: RESOURCE_ID
    });

    let totalBandwidth = 0;

    data.forEach(metric => {
      metric.values.forEach(valueObj => {
        // Some values might have nested numeric fields like { total: 123 }
        for (const key in valueObj) {
          if (typeof valueObj[key] === 'number') {
            totalBandwidth += valueObj[key];
          }
        }
      });
    });

    console.log(`Total bandwidth for service ${RESOURCE_ID} this month: ${totalBandwidth} ${data[0]?.unit || 'mb'}`);
  } catch (err) {
    console.error('Error fetching bandwidth:', err);
  }
}

fetchBandwidth();

