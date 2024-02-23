const { jobs } = require('../sequelizeOrm/models');
const { BAD_REQUEST, OK } = require('../utils/allStatusCode');
const { cleanEmptyKeys } = require('../utils/cleanEmptyKeys');
const { enumStatusJobs } = require('../utils/statusJobs');

const createJob = async (req, res) => {
  const {
    body: {
      company_id,
      title,
      description,
      location,
      notes,
    },
  } = req;

  const jobFields = {
    company_id,
    title,
    description,
    location,
    notes,
    status: enumStatusJobs.draft,
  };

  try {
    const jobCreate = await jobs.create(jobFields);

    return res.status(OK).json(jobCreate);
  } catch (error) {
    return res.status(BAD_REQUEST).json();
  }
};

const publishJob = async (req, res) => {
  const { job_id } = req.params;

  const status = enumStatusJobs.published;

  const jobPublish = await jobs.update({ status }, { where: { id: job_id } });

  if (jobPublish[0]) return res.status(OK).json();
  return res.status(BAD_REQUEST).json({ err: 'job id does not exist' });
};

const updateJob = async (req, res) => {
  const { job_id } = req.params;

  const {
    body: {
      title,
      description,
      location,
    },
  } = req;

  const jobFields = cleanEmptyKeys({
    title,
    description,
    location,
  });

  const jobPublish = await jobs.update(jobFields, { where: { id: job_id } });

  if (jobPublish[0]) return res.status(OK).json();
  return res.status(BAD_REQUEST).json();
};

const deleteJob = async (req, res) => {
  const { job_id } = req.params;

  const jobPublish = await jobs.destroy({ where: { id: job_id } });

  if (jobPublish) return res.status(OK).json();
  return res.status(BAD_REQUEST).json({ err: 'job id does not exist' });
};

const archiveJob = async (req, res) => {
  const { job_id } = req.params;

  const status = enumStatusJobs.archived;

  const jobPublish = await jobs.update({ status }, { where: { id: job_id } });

  if (jobPublish[0]) return res.status(OK).json();
  return res.status(BAD_REQUEST).json({ err: 'job id does not exist' });
};

module.exports = {
  createJob,
  publishJob,
  updateJob,
  deleteJob,
  archiveJob,
};
