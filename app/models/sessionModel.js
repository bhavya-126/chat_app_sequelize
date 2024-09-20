'use strict';

/** *********** Modules ********** */
const { TOKEN_TYPES, USER_ROLES } = require('../utils/constants');
const { DataTypes} = require('sequelize')

// NOTE: this model is uses for development only( not live and staging server)
/** *********** User Session Model ********** */

module.exports = function(Sequelize) {
    const session = Sequelize.define('session', {
        tokenType: {
            type: DataTypes.INTEGER,
            defaultValue: TOKEN_TYPES.LOGIN
        },
        token: {
            type: DataTypes.STRING
        },
        tokenExpiryDate: {
            type: DataTypes.DATE
        }
    }, {
        timestamps: true
    });

    session.associate = (models) => {
        session.belongsTo(models.users, { foreignKey: 'userId', targetKey: 'id' });
    }

    return session;
}
