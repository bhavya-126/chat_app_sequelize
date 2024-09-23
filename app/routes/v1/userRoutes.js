const { userController } = require("../../controllers");
const { NAME_REGEX, EMAIL_REGEX, PASSWORD_PATTER_REGEX } = require("../../utils/constants");
const { Joi } = require("../../utils/joiUtils");


module.exports = [
    {
        method: "POST",
        path: "/api/register",
        joiSchemaForSwagger: {
            group: "User",
            description: "register user",
            model: "registerUser",
            body: {
                name: Joi.string().pattern(NAME_REGEX).required(),
                email: Joi.string().pattern(EMAIL_REGEX).required(),
                password: Joi.string().pattern(PASSWORD_PATTER_REGEX)
            }
        },
        handler: userController.register
    },
    {
        method: "POST",
        path: "/api/login",
        joiSchemaForSwagger: {
            group: "User",
            description: "Login user",
            model: "loginUser",
            body: {
                email: Joi.string().pattern(EMAIL_REGEX).required(),
                password: Joi.string().pattern(PASSWORD_PATTER_REGEX).required()
            }
        },
        handler: userController.login
    },
    {
        method: "PUT",
        path: "/api/user",
        auth: true,
        joiSchemaForSwagger: {
            group: "User",
            description: "Update user",
            model: "updateUser",
            body: {
                name: Joi.string().pattern(NAME_REGEX).required()
            },
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: userController.updateUser
    },
    {
        method: "GET",
        path: "/api/user",
        auth: true,
        joiSchemaForSwagger: {
            group: "User",
            description: "Get user",
            model: "getUser",
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: userController.getUser
    },
    {
        method: "POST",
        path: "/api/logout",
        auth: true,
        joiSchemaForSwagger: {
            group: "User",
            description: "Logout user",
            model: "logoutUser",
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: userController.logout
    },
    {
        method: "DELETE",
        path: "/api/user",
        auth: true,
        joiSchemaForSwagger: {
            group: "User",
            description: "Delete user",
            model: "DeleteUser",
            headers: {
                authorization: Joi.string().required()
            }
        },
        handler: userController.deleteUser
    }
]