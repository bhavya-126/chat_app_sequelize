'use strict';

const { FORCE } = require('sequelize/lib/index-hints');
/** *********** Modules ********** */
const { TOKEN_TYPES, USER_ROLES } = require('../utils/constants');
const { DataTypes } = require('sequelize')

// NOTE: this model is uses for development only( not live and staging server)
/** *********** room Model ********** */

module.exports = function (Sequelize) {
    const chat = Sequelize.define('chat', {
        senderId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        roomId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        paranoid: true,
    });

    chat.associate = (models) => {
        // chat.belongTo(models.userModel, { foreignKey: 'senderId', onDelete: 'NO ACTION', })
    }

    return chat;
}
