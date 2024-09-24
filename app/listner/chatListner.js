const { roomService, roomDetailsService, chatService } = require("../services");
const { MESSAGES, SOCKET_EVENTS } = require("../utils/constants");

const chatListner = {}

// chatListner.createRoom = async (socket, payload, callback) => {

//     let { name, users, isGroup } = payload

//     let roomData = { isGroup };

//     if (isGroup) roomData.name = name
//     else roomData.id = [String(users[0].id), String(payload.userId)].sort((a, b) => a > b ? 1 : -1).join('-');

//     let room = await roomService.create({ ...roomData });

//     if (users && users.length > 0) {
//         await roomDetailsService.create({ roomId: room.id, userId: socket.userId });

//         for (let user of users) await roomDetailsService.create({ roomId: room.Id, userId: user })
//     }
//     socket.join(room.id);

//     if (typeof callback === 'function') callback({ success: true, roomId: room.id, message: MESSAGES.SOCKET.ROOM_JOINED })
// }

chatListner.joinRoom = async (socket, payload, callback) => {
    let { roomId } = payload

    let room = await roomService.findOne({ where: { id: roomId } })
    if (!room) await roomService.create({id: roomId});

    let roomDetails = await roomDetailsService.findOne({where: {roomId, userId: socket.userId}});
    if(!roomDetails) await roomDetailsService.create({roomId, userId: socket.userId});

    socket.join(room.id);

    if (typeof callback === 'function') callback({ success: true, roomId: room.id, message: MESSAGES.SOCKET.ROOM_JOINED })
}

chatListner.leaveRoom = async (socket, payload, callback) => {
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
    let { roomId, message } = payload;

    let room = await roomService.findOne({ where: { id: roomId } })

    if(!room) {
        if (typeof callback === 'function') callback({ success: false, message: MESSAGES.SOCKET.ROOM_NOT_FOUND })
        return
    }

    let messageData = await chatService.create({roomId, message, senderId: socket.userId});

    socket.to(room.id).emit(SOCKET_EVENTS.MESSAGE, messageData);
}


module.exports = chatListner