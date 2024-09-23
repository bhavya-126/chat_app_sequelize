/* eslint-disable no-console */
/** -- import all modules */
const { authService } = require('../services');
const { MESSAGES, SOCKET_EVENTS } = require('../utils/constants');

const socketConnection = {};

socketConnection.connect = (io) => {
  io.use(authService.socketAuthentication);
  io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
    console.log('connection established: ', socket.id);

    await userServices.update( {active: true}, { where: {id: socket.userId}})

    socket.use(async (packet, next) => {
      console.log('Socket hit:=>', packet);
      try {
        next();
      } catch (error) {
        packet[2]({ success: false, message: error.message });
      }
    });

    socket.on(SOCKET_EVENTS.TEST, (payload, callback) => {
      if(typeof callback === 'function' )
        callback({ success: true, message: MESSAGES.SOCKET.SOCKET_IS_RUNNING_FINE });
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
      await userServices.update( {active: false}, { where: {id: socket.userId}})
      console.log('Disconnected socket id: ', socket.id);
    });
  });
};

module.exports = socketConnection;
