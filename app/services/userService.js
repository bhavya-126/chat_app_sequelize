let { userModel } = require("../models");

userServices = {}

userServices.create = async(data) => await userModel.create(data)

userServices.findOne = async(criteria) => await userModel.findOne(criteria)

userServices.findAll = async(criteria) => await userModel.findAll(criteria)

userServices.findByPk = async(id) => await userModel.findByPk(id)

userServices.findOrCreate = async(criteria) => await userModel.findOrCreate(criteria)

module.exports = userServices