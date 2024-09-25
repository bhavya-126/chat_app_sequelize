'use strict';

/** ******************************
 **** Managing all the services ***
 ********* independently ********
 ******************************* */
module.exports = {
    dbService: require('./dbService'),
    swaggerService: require('./swaggerService'),
    authService: require('./authService'),
    fileUploadService: require('./fileUploadService'),
    sessionServices: require('./sessionService'),
    userServices: require('./userService'),
    roomService: require('./roomService'),
    roomDetailsService: require('./roomDetailsService'),
    chatService: require('./chatService'),
    validateService: require('./validateService')
};
