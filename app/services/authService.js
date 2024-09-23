'use strict';

const { API_AUTH_KEY } = require('../../config');
const CONFIG = require('../../config');
const { decryptJwt } = require('../utils/utils');
const { createErrorResponse } = require('../helpers');
const dbService = require('./dbService');
const { conversationRoomModel, sessionModel, userModel } = require('../models');
const {
    MESSAGES, ERROR_TYPES, NORMAL_PROJECTION, TOKEN_TYPES
} = require('../utils/constants');
const CONSTANTS = require('../utils/constants');
const commonFunctions = require('../utils/utils');
// const { userServices, sessionServices } = require('./index');
const userServices = require('./userService')
const sessionService = require('./sessionService')
const helpers = require('../helpers');


const authService = {};

/**
 * function to validate user's token and fetch its details from the system.
 * @param {} request
 */
authService.validateUser = () => async (req, res, next) =>  {
    try {
        let token = req.headers.authorization;
        let result = commonFunctions.decryptJwt(token);

        let user = await userServices.findOne({ where: { id: result.id } });

        if(!user) throw Error(MESSAGES.UNAUTHORIZED);

        let checkToken = await sessionServices.findOne({where: {token, userId: user.id}});

        if(!checkToken) throw Error(MESSAGES.UNAUTHORIZED);

        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json(helpers.createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED));
    }
};

/*
 * function to authenticate socket token
 */
authService.socketAuthentication = async (socket, next) => {
    try {
        const session = await decryptJwt(socket.handshake.query.authorization);
        if (!session) {
            return next({ success: false, message: MESSAGES.UNAUTHORIZED });
        }

        const user = await dbService.findOne(userModel, { _id: session.userId }, NORMAL_PROJECTION);
        if (!user) {
            return next({ success: false, message: MESSAGES.UNAUTHORIZED });
        }
        const userId = session.userId.toString();
        socket.join(userId); // -- user to join room
        socket.userId = userId;

        const groupData = await dbService.find(conversationRoomModel, { 'members.userId': { $eq: socket.userId } });
        if (!groupData) {
            return ({ success: false, message: MESSAGES.NOT_FOUND });
        }

        for (let i = 0; i < groupData.length; i++) {
            socket.join(groupData[i].uniqueCode);
        }

        return next();
    } catch (err) {
        return next({ success: false, message: MESSAGES.SOMETHING_WENT_WRONG });
    }
};

module.exports = authService;
