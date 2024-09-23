const { chatController } = require("../../controllers");
const { Joi } = require("../../utils/joiUtils");

module.exports = [
    {
        method: 'GET',
        path: '/api/chat',
        joiSchemaForSwagger: {
            group: 'Chat',
            description: 'Get all chats',
            model: 'Chat',
            headers: {
                authorization: Joi.string().required()
            },
            query: {
                roomId: Joi.string().required(),
                limit: Joi.number().required().default(10),
                offset: Joi.number().required()
            }
        },
        handler: chatController.getChat
    }
]