let { chatModel } = require("../models");

chatService = {}

chatService.create = async(data) => await chatModel.create(data)

chatService.findOne = async(criteria) => await chatModel.findOne(criteria)

chatService.findAll = async(criteria) => await chatModel.findAll(criteria)

chatService.findByPk = async(id) => await chatModel.findByPk(id)

chatService.findOrCreate = async(criteria) => await chatModel.findOrCreate(criteria);

chatService.update = async(data, criteria) => await chatModel.update(data, criteria);

chatService.destroy = async(criteria) => await chatModel.destroy(criteria)

module.exports = chatService