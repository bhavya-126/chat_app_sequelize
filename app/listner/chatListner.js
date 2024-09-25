const { roomService, roomDetailsService, chatService } = require("../services");
const { MESSAGES, SOCKET_EVENTS } = require("../utils/constants");

const chatListner = {}

chatListner.createGroup = async (socket, payload, callback) => {
    payload = JSON.parse(payload)

    let { name, users = [] } = payload;

    if (users.length < 1 && typeof callback === 'function')
        return callback({ success: false, MESSAGE: MESSAGES.SOCKET.GROUP_MUST_HAVE_ATLEAST_ONE_USER })

    let roomData = { isGroup: true, name };

    let room = await roomService.create({ ...roomData });

    if (users && users.length > 0) {
        let data = [{ roomId: room.id, userId: socket.userId }];
        for (let user of users) data.push({ roomId: room.Id, userId: user })

        roomDetailsService.bulkCreate(data)
    }
    socket.join(room.id);

    if (typeof callback === 'function') callback({ success: true, roomId: room.id, message: MESSAGES.SOCKET.ROOM_JOINED })
}

chatListner.joinRoom = async (socket, payload, callback) => {
    payload = JSON.parse(payload)
    let { userId } = payload;

    let roomId = [userId, socket.userId].sort().join('-')

    socket.join(roomId);

    if (typeof callback === 'function') callback({ success: true, roomId: roomId, message: MESSAGES.SOCKET.ROOM_JOINED })
}

chatListner.leaveRoom = async (socket, payload, callback) => {
    payload = JSON.parse(payload)
    let { roomId } = payload

    let room = await roomDetailsService.findOne({ where: { roomId: roomId, userId: socket.userId } })

    if (!room) {
        if (typeof callback === 'function') callback({ success: false, message: MESSAGES.SOCKET.ROOM_NOT_FOUND })
        return
    }

    await roomDetailsService.destroy({ where: { roomId: roomId, userId: socket.userId } })

    socket.leave(room.id);

    if (typeof callback === 'function') callback({ success: true, roomId: room.id, message: MESSAGES.SOCKET.ROOM_LEFT })
}

chatListner.sendMessage = async (socket, payload, callback) => {
    payload = JSON.parse(payload)
    let { roomId, message } = payload;

    let messageData = await chatService.create({ roomId, message, senderId: socket.userId });

    socket.to(roomId).emit(SOCKET_EVENTS.MESSAGE, messageData);
    socket.emit(SOCKET_EVENTS.MESSAGE, messageData)

    if (typeof callback === 'function') callback({ success: true, message: MESSAGES.SOCKET.MESSAGE_SENT })
}


module.exports = chatListner