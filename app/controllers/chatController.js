const helpers = require("../helpers");
const { MESSAGES, ERROR_TYPES } = require("../utils/constants");

const chatController = {}

chatController.getChat = async(payload) => {
    const { roomId, limit, totalCount } = payload;

    const room = await roomService.findByPk(roomId);

    if(!room) return helpers.createErrorResponse( MESSAGES.SOCKET.ROOM_NOT_FOUND, ERROR_TYPES.DATA_NOT_FOUND);

    let chat = await chatServices.findAll({ where: { roomId }, limit, offset: totalCount })

    return helpers.createSuccessResponse(MESSAGES.SUCCESS, chat)
}

module.exports = chatController