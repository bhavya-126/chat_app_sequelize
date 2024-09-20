'use strict';

const { userModel } = require('../models');
const { userServices } = require('../services');
const { createSuccessResponse, createErrorResponse } = require('../helpers');
const { } = require('../utils/utils');
const { MESSAGES } = require('../utils/constants');

/** ************************************************
 ***************** User Controller ***************
 ************************************************* */
const serverController = {};

/**
 * function to get server response.
 * @returns
 */
serverController.checkServerStatus = async () => {

    let user = await userServices.findAll({ 
        where: {
            isDeleted: false
        }
    });
    return createSuccessResponse(MESSAGES.SERVER_IS_WORKING_FINE, user)
};

module.exports = serverController;
