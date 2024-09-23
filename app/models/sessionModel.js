'use strict';

const { FORCE } = require('sequelize/lib/index-hints');
/** *********** Modules ********** */
const { TOKEN_TYPES, USER_ROLES } = require('../utils/constants');
const { DataTypes } = require('sequelize')

// NOTE: this model is uses for development only( not live and staging server)
/** *********** User Session Model ********** */

module.exports = function (Sequelize) {
    const session = Sequelize.define('session', {
        tokenType: {
            type: DataTypes.INTEGER,
            defaultValue: TOKEN_TYPES.LOGIN
        },
        token: {
            type: DataTypes.STRING
        },
        userId: {
            type: DataTypes.UUID,
        }
    }, {
        timestamps: true
    });

    session.associate = (models) => {
        session.belongsTo(models.userModel, { foreignKey: 'userId', onDelete: 'CASCADE', });
    }

    return session;
}
