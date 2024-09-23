'use strict';

const { FORCE } = require('sequelize/lib/index-hints');
/** *********** Modules ********** */
const { TOKEN_TYPES, USER_ROLES } = require('../utils/constants');
const { DataTypes } = require('sequelize')

// NOTE: this model is uses for development only( not live and staging server)
/** *********** User Session Model ********** */

module.exports = function (Sequelize) {
    const roomDetails = Sequelize.define('roomDetails', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        roomId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    }, {
        timestamps: true
    });

    roomDetails.associate = (models) => {
        roomDetails.belongTo(models.userModel, { foreignKey: 'userId', onDelete: 'CASCADE', })
        roomDetails.belongTo(models.roomModel, { foreignKey: 'roomId', onDelete: 'CASCADE', })
    }

    return roomDetails;
}
