const helpers = require("../helpers");
const { MESSAGES, ERROR_TYPES } = require("../utils/constants");

const chatController = {}

chatController.getChat = async (payload) => {
    const { roomId, limit, totalCount } = payload;

    const room = await roomService.findByPk(roomId);

    if (!room) return helpers.createErrorResponse(MESSAGES.SOCKET.ROOM_NOT_FOUND, ERROR_TYPES.DATA_NOT_FOUND);

    let chat = await chatServices.findAll({ where: { roomId }, limit, offset: totalCount })

    return helpers.createSuccessResponse(MESSAGES.SUCCESS, chat)
}

chatController.getUsers = async (payload) => {

    let users = await userServices.findAll({ raw: true });

    return helpers.createSuccessResponse(MESSAGES.SUCCESS, users);
}

chatController.getGroups = async (payload) => {
    let { sequelize } = payload;

    let groups = await sequelize.query('SELECT * FROM "rooms" WHERE "id" IN (SELECT "roomId" FROM "roomDetails" WHERE "userId" = :userId)', {
        type: QueryTypes.SELECT,
        replacements: {
            userId: payload.user.id
        }
    })

    return helpers.createSuccessResponse(MESSAGES.SUCCESS, groups);
}

chatController.getPreviouslyChatedUser = (payload) => {
    let users = sequelize.query(`
    SELECT 
        "user"."id" AS "id", 
        "user"."name" AS "name", 
        "user"."active" AS "isActive", 
        "msg"."message" AS "lastMessage", 
        "msg"."createdBy" AS "lastMsgTime" 
    FROM 
        (
            SELECT 
                "users"."id" AS "id", 
                "users"."name" AS "name", 
                "users"."active" AS "active", 
                "rooms"."id" 
            FROM 
                "users", 
                "rooms", 
                ( 
                    SELECT 
                        "roomId", 
                        "userId" 
                    FROM 
                        "roomDetails"
                    WHERE 
                        "roomId" IN ( SELECT "roomId" FROM "roomDetails" WHERE "userId" = :userId )
                ) AS rDetails 
            WHERE 
                "rDetails"."roomId" = "rooms"."id" 
                    AND 
                "users"."id" = "rDetails"."userId"
        ) AS "user", 
        (
            SELECT 
                "c1".* 
            FROM 
                "chats" AS "c1" 
                    INNER JOIN 
                (
                    SELECT 
                        "roomId", 
                        MAX("createdAt") AS "lastMsgTime" 
                    FROM 
                        "chats" 
                    GROUP BY 
                        "roomId"
                ) AS "c2"
            ON 
                "c1"."roomId" = "c2"."roomId" 
                    AND 
                "c1"."createdAt" = "c2"."lastMsgTime"
        ) AS "msg"`, {
        type: QueryTypes.SELECT,
        replacements: {
            userId: payload.user.id 
        }
    });

    return helpers.createSuccessResponse(MESSAGES.SUCCESS, users)
}
                     
module.exports = chatController