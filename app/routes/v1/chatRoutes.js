const { chatController } = require("../../controllers");
const { Joi } = require("../../utils/joiUtils");

module.exports = [
    {
        method: 'GET',
        path: '/api/chat',
        auth: true,
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
    },
    {
        method: "GET",
        path: '/api/chat/users',
        auth: true,
        joiSchemaForSwagger: {
            group: 'Chat',
            description: 'Get all users',
            model: 'Chat',
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: chatController.getUsers
    },
    {
        method: "GET",
        path: '/api/chat/groups',
        auth: true,
        joiSchemaForSwagger: {
            group: 'Chat',
            description: 'Get all groups',
            model: 'Chat',
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: chatController.getGroups
    },
    {
        method: "GET",
        path: '/api/chat/previous/users',
        auth: true,
        joiSchemaForSwagger: {
            group: 'Chat',
            description: 'Get all previously chated users',
            model: 'Chat',
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: chatController.getPreviouslyChatedUser
    }
]