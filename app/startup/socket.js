/* eslint-disable no-console */
/** -- import all modules */
const { QueryTypes } = require('sequelize');
const chatListner = require('../listner/chatListner');
const { authService, userServices, validateService } = require('../services');
const { MESSAGES, SOCKET_EVENTS } = require('../utils/constants');

const socketConnection = {};

socketConnection.connect = (io, sequelize) => {
  io.use(authService.socketAuthentication);
  io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
    console.log('connection established: ', socket.id);

    socket.use(validateService.validateSocketEvent)

    await userServices.update({ active: true }, { where: { id: socket.userId } })

    let users = await userServices.findAll({ raw: true });

    for (let user of users) {
      let room = [user.id, socket.userId].sort().join('-');
      socket.join(room)
    }

    let groups = await sequelize.query(`SELECT "id" FROM "rooms" 
      WHERE "isGroup" = :isGroup 
        AND 
      "id" IN ( SELECT "roomId" FROM "roomDetails" WHERE "userId" = :userId)`, {
      type: QueryTypes.SELECT,
      replacements: {
        isGroup: true,
        userId: socket.userId,
      }
    })

    for (let group of groups) socket.join(group.id)

    socket.on(SOCKET_EVENTS.CREATE_GROUP, async (payload, callback) => chatListner.createGroup(socket, payload, callback))

    socket.on(SOCKET_EVENTS.JOIN_ROOM, async (payload, callback) => chatListner.joinRoom(socket, payload, callback))

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, async (payload, callback) => chatListner.leaveRoom(socket, payload, callback))

    socket.on(SOCKET_EVENTS.MESSAGE, (payload, callback) => chatListner.sendMessage(socket, payload, callback))

    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
      await userServices.update({ active: false }, { where: { id: socket.userId } })

      console.log('Disconnected socket id: ', socket.id);
    });
  });
};

module.exports = socketConnection;
