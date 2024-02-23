require('dotenv').config();
const express = require('express');

const app = express();

const {
  CompaniesController,
  JobController,
} = require('./controllers');
const { FeedController } = require('./controllers/FeedController');

const PORT = process.env.PORT || 3001;

app.use((req, _res, next) => {
  console.log({
    data: new Date(),
    method: req.method,
    router: req.originalUrl,
  });
  next();
});

app.use(express.json());

app.use('/companies', CompaniesController);

app.use('/job', JobController);

app.use('/feed', FeedController);

app.use((err, _req, res) => {
  console.error({ err: err.message });
  res.status(500).json({ err: 'internal error' });
});

app.listen(PORT, () => console.log('running port', PORT));
