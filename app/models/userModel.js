'use strict';

const { DataTypes } = require('sequelize')

module.exports = function (connection) {
    let user = connection.define("user", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: true
    });

    user.associate = (models) => {
        user.hasMany(models.sessionModel, {
            foreignKey: {
              name: 'userId',
              allowNull: false, 
              onDelete: 'CASCADE', 
            },
          });  
    }

    return user;
};