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
                password: Joi.string().pattern(PASSWORD_PATTER_REGEX)
            }
        },
        handler: userController.login
    }
]