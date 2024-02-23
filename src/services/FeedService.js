const { Sequelize } = require('sequelize');
const { S3 } = require('../aws/S3');
const { jobs } = require('../sequelizeOrm/models');
const { companies } = require('../sequelizeOrm/models');
const { OK, NOT_FOUND } = require('../utils/allStatusCode');
const { enumStatusJobs } = require('../utils/statusJobs');

const listPublishedJobsFindByS3 = async (_req, res) => {
  const s3Instance = new S3();

  const jsonSting = await s3Instance.getFile();

  if (jsonSting) return res.status(OK).send(jsonSting);
  return res.status(NOT_FOUND).json();
};

const listPublishedJobsFindByDB = async (_req, res) => {
  const publishedJobsList = await jobs.findAll({
    attributes: ['id', 'title', 'description', 'created_at', [Sequelize.col('companies.name'), 'company_name']],
    where: { status: enumStatusJobs.published },
    include: [{
      model: companies,
      as: 'companies',
      attributes: ['name'],
    }],
  });

  const publishedJobsListClean = publishedJobsList.map((feed) => {
    const feedObj = { ...feed.dataValues };
    delete feedObj.companies;
    return feedObj;
  });

  return res.status(OK).json(publishedJobsListClean);
};

module.exports = {
  listPublishedJobsFindByS3,
  listPublishedJobsFindByDB,
};
