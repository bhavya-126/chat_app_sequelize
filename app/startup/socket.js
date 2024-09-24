/* eslint-disable no-console */
/** -- import all modules */
const { QueryTypes } = require('sequelize');
const chatListner = require('../listner/chatListner');
const { authService, userServices } = require('../services');
const { MESSAGES, SOCKET_EVENTS } = require('../utils/constants');

const socketConnection = {};

socketConnection.connect = (io, sequelize) => {
  io.use(authService.socketAuthentication);
  io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
    console.log('connection established: ', socket.id);

    await userServices.update({ active: true }, { where: { id: socket.userId } })

    let users = await userServices.findAll({raw: true});
    let groups = await sequelize.query('SELECT "roomId" FROM "roomDetails" WHERE "userId" = :userId', {
      type: QueryTypes.SELECT,
      replacements: {
        userId: socket.userId
      }
    })
    
    for( let user of users ) {
      let room = [user.id, socket.userId].sort((a, b)=> a-b).join('-');
      socket.join(room)
    }

    for( let group of groups )  socket.join(group.roomId)

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
