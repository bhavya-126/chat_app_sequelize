let { roomDetailsModel } = require("../models");

roomDetailsService = {}

roomDetailsService.create = async(data) => await roomDetailsModel.create(data)

roomDetailsService.findOne = async(criteria) => await roomDetailsModel.findOne(criteria)

roomDetailsService.findAll = async(criteria) => await roomDetailsModel.findAll(criteria)

roomDetailsService.findByPk = async(id) => await roomDetailsModel.findByPk(id)

roomDetailsService.findOrCreate = async(criteria) => await roomDetailsModel.findOrCreate(criteria);

roomDetailsService.update = async(data, criteria) => await roomDetailsModel.update(data, criteria);

roomDetailsService.destroy = async(criteria) => await roomDetailsModel.destroy(criteria)

module.exports = roomDetailsService