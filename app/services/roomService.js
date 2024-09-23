let { roomModel } = require("../models");

roomService = {}

roomService.create = async(data) => await roomModel.create(data)

roomService.findOne = async(criteria) => await roomModel.findOne(criteria)

roomService.findAll = async(criteria) => await roomModel.findAll(criteria)

roomService.findByPk = async(id) => await roomModel.findByPk(id)

roomService.findOrCreate = async(criteria) => await roomModel.findOrCreate(criteria);

roomService.update = async(data, criteria) => await roomModel.update(data, criteria);

roomService.destroy = async(criteria) => await roomModel.destroy(criteria)

module.exports = roomService