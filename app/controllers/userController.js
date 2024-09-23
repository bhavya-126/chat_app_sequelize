const helpers = require("../helpers");
const { userServices } = require("../services");
const { MESSAGES, ERROR_TYPES } = require("../utils/constants");
const commonFunctions = require("../utils/utils");

const userController = {};

userController.register = async (payload) => {
    let { name, email, password } = payload;

    let user = await userServices.findOne({ where: { email: email } });
    if (user) return helpers.createErrorResponse(MESSAGES.USER_ALREADY_EXISTS, ERROR_TYPES.ALREADY_EXISTS);

    password = commonFunctions.hashPassword(password)
    user = await userServices.create({ name, email, password });

    let token = commonFunctions.encryptJwt({ id: user.id });

    await sessionServices.create({ token, userId: user.id });

    return helpers.createSuccessResponse(MESSAGES.USER_REGISTERED, { user, token });
}

userController.login = async (payload) => {
    const { email, password } = payload;

    let user = await userServices.findOne({
        where: {
            email: email
        }
    });

    if (!user) return helpers.createErrorResponse(MESSAGES.NO_USER_FOUND_WITH_THIS_EMAIL, ERROR_TYPES.DATA_NOT_FOUND);

    if (!commonFunctions.compareHash(password, user.password)) return helpers.createErrorResponse(MESSAGES.INVALID_PASSWORD, ERROR_TYPES.BAD_REQUEST);

    let token = commonFunctions.encryptJwt({ id: user.id });

    const session = await sessionServices.create({ token, userId: user.id });

    return helpers.createSuccessResponse(MESSAGES.USER_LOGGED_IN, { token, session });
}

userController.updateUser = async (payload) => {
    const { name } = payload;

    await userServices.update({ name }, { where: { id: payload.user.id } });

    return helpers.createSuccessResponse(MESSAGES.USER_UPDATED_SUCCESSFULLY);
}

userController.getUser = async (payload) => {

    const user = await userServices.findOne({ where: { id: payload.user.id } });

    return helpers.createSuccessResponse(MESSAGES.SUCCESS, user);
}

userController.deleteUser = async (payload) => {
    await userServices.destroy({ where: { id: payload.user.id } });

    return helpers.createSuccessResponse(MESSAGES.USER_DELETED);
}

userController.logout = async (payload) => {
    await sessionServices.destroy({ where: { userId: payload.user.id } });

    return helpers.createSuccessResponse(MESSAGES.LOGGED_OUT_SUCCESSFULLY);
}
module.exports = userController;