const models = require("../models");

const {sessionModel} = models

sessionServices = {}

sessionServices.create = async(data) => await sessionModel.create(data)

sessionServices.findOne = async(criteria) => await sessionModel.findOne(criteria)

sessionServices.findAll = async(criteria) => await sessionModel.findAll(criteria)

sessionServices.findByPk = async(id) => await sessionModel.findByPk(id)

sessionServices.findOrCreate = async(criteria) => await sessionModel.findOrCreate(criteria)

sessionServices.destroy = async(criteria) => await sessionModel.destroy(criteria)

module.exports = sessionServices