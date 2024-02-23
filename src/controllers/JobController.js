const { Router } = require('express');
const {
  createJob,
  publishJob,
  updateJob,
  deleteJob,
  archiveJob,
} = require('../services/JobService');

const JobController = new Router();

JobController.post('/', createJob); // Create a job posting draft.
JobController.put('/:job_id/publish', publishJob); // Publish a job posting draft.
JobController.put('/:job_id', updateJob); // Edit a job posting draft (title, location, description).
JobController.delete('/:job_id', deleteJob); // Delete a job posting draft.
JobController.put('/:job_id/archive', archiveJob); // Archive an active job posting.

module.exports = { JobController };
