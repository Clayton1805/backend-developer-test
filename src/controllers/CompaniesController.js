const { Router } = require('express');
const {
  listAllCompanies,
  getCompanieById,
} = require('../services/CompaniesService');

const CompaniesController = new Router();

CompaniesController.get('/', listAllCompanies); // List existing companies.
CompaniesController.get('/:company_id', getCompanieById); // Fetch a specific company by ID.

module.exports = { CompaniesController };
