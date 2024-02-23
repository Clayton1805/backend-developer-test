require('dotenv').config();
const https = require('https');

function getRequest() {
  const url = `${process.env.BASE_URL}/feed/DB`;

  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let rawData = '';

      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (err) {
          reject(new Error(err));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(err));
      throw new Error(err);
    });
  });
}

module.exports = { getRequest };
