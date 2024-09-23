'use strict';

const { FORCE } = require('sequelize/lib/index-hints');
/** *********** Modules ********** */
const { TOKEN_TYPES, USER_ROLES } = require('../utils/constants');
const { DataTypes } = require('sequelize')

// NOTE: this model is uses for development only( not live and staging server)
/** *********** room Model ********** */

module.exports = function (Sequelize) {
    const room = Sequelize.define('room', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true
    });

    return room;
}
