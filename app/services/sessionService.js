const { sessionModel } = require("../models");

sessionServices = {}

sessionServices.create = async(data) => await sessionModel.create(data)

sessionServices.findOne = async(criteria) => await sessionModel.findOne(criteria)

sessionServices.findAll = async(criteria) => await sessionModel.findAll(criteria)

sessionServices.findByPk = async(id) => await sessionModel.findByPk(id)

sessionServices.findOrCreate = async(criteria) => await sessionModel.findOrCreate(criteria)

module.exports = sessionServices