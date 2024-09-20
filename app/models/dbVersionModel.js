'use strict';

/** *********** Modules ********** */
const {DataTypes} = require('sequelize')

/** *********** DB version Model ********** */

module.exports = function(Sequelize) {
    const dbVersion = Sequelize.define('dbVersion', {
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        timestamps: false
    });
    return dbVersion;
}
