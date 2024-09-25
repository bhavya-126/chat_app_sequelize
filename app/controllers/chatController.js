const { QueryTypes } = require("sequelize");
const helpers = require("../helpers");
const { chatService } = require("../services");
const { MESSAGES, ERROR_TYPES } = require("../utils/constants");

const chatController = {}

chatController.getChat = async (payload) => {
    const { roomId, limit, totalCount } = payload;

    let chat = await chatService.findAll({ where: { roomId }, limit, offset: totalCount })

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

chatController.getPreviouslyChatedUser = async (payload) => {
    let { sequelize } = payload
    // let users = await sequelize.query(`
    //     SELECT
    //         "user"."id", 
    //         "user"."name", 
    //         "msg"."message", 
    //         "msg"."createdAt"
    //     FROM
    //         "users" AS "user"
    //     LEFT OUTER JOIN
    //         (
    //             SELECT 
    //                 "c1"."roomId" AS "roomId", 
    //                 "c1"."message" AS "message", 
    //                 "c1"."createdAt" AS "createdAt"
    //             FROM 
    //                 "chats" AS "c1"
    //             INNER JOIN 
    //                 (
    //                     SELECT 
    //                         "roomId", 
    //                         MAX("createdAt") AS "lastMsgTime"
    //                     FROM 
    //                         "chats"
    //                     GROUP BY 
    //                         "roomId"
    //                 ) AS "c2" 
    //             ON 
    //                 "c1"."roomId" = "c2"."roomId" 
    //                 AND "c1"."createdAt" = "c2"."lastMsgTime"
    //         ) AS "msg" 
    //     ON
    //         "msg"."roomId" LIKE "user"."id" || '%'
    //     WHERE
    //         "msg"."roomId" LIKE '%' || "user"."id"
    // `, {
    //     type: QueryTypes.SELECT,
    //     replacements: {
    //         userId: payload.user.id
    //     }
    // });

    let users = await sequelize.query(`
        SELECT
            "user"."id",
            "user"."name" AS userName,
            "user"."active" AS "isActive",
            "msg"."roomId",
            "msg"."message",
            "msg"."createdAt",
            "room"."name" AS "roomName"
        FROM
            "users" AS "user"
        RIGHT OUTER JOIN
            (
                SELECT 
                    "c1"."roomId", 
                    "c1"."message", 
                    "c1"."createdAt"
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
                    AND "c1"."createdAt" = "c2"."lastMsgTime"
            ) AS "msg"
        ON
            "msg"."roomId" LIKE ( "user"."id" || '-' || :userId )
                OR
            "msg"."roomId" LIKE ( :userId || '-' || "user"."id" )
        LEFT OUTER JOIN 
            (
                SELECT 
                    "room"."name",
                    "room"."id"
                FROM
                    "rooms" AS "room"
                WHERE
                    "room"."id" IN (
                        SELECT 
                            "roomId"
                        FROM 
                            "roomDetails"
                        WHERE 
                            "userId" = :userId
                    )
            ) AS "room"
        ON
            "room"."id"::text = "msg"."roomId"
    `, {
        type: QueryTypes.SELECT,
        replacements: {
            userId: payload.user.id
        }
    })


    return helpers.createSuccessResponse(MESSAGES.SUCCESS, users)
}

module.exports = chatController