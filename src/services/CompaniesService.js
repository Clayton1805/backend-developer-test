const { companies } = require('../sequelizeOrm/models');
const { BAD_REQUEST, OK } = require('../utils/allStatusCode');

const listAllCompanies = async (_req, res) => {
  const companieList = await companies.findAll();
  return res.status(OK).json(companieList);
};

const getCompanieById = async (req, res) => {
  const { company_id } = req.params;
  const companie = await companies.findByPk(company_id);

  if (companie) return res.status(OK).json(companie);
  return res.status(BAD_REQUEST).json({
    err: 'the company id does not exist',
  });
};

module.exports = { listAllCompanies, getCompanieById };
