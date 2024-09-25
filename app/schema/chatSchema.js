const { NAME_REGEX } = require("../utils/constants");
const { Joi } = require("../utils/joiUtils");

const chatSchema = {};

chatSchema.createGroup = Joi.object({
    name: Joi.string().pattern(NAME_REGEX), 
    users: Joi.array().items(Joi.string().required())
})

chatSchema.joinRoom = Joi.object({
    userId: Joi.string().required()
})

chatSchema.leaveRoom = Joi.object({
    roomId: Joi.string().required()
})

chatSchema.sendMessageSchema = Joi.object({
    message: Joi.string().required(),
    roomId: Joi.string().required()
})

module.exports = chatSchema