const { Router } = require('express');
const {
  listPublishedJobsFindByS3,
  listPublishedJobsFindByDB,
} = require('../services/FeedService');

const FeedController = new Router();

FeedController.get('/', listPublishedJobsFindByS3); // list the published jobs by s3
FeedController.get('/DB', listPublishedJobsFindByDB); // list the published jobs by searching the database

module.exports = { FeedController };
