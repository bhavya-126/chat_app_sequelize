const { Sequelize } = require('sequelize');
const models = require('./../models')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
})

module.exports = async () => {
    await sequelize.authenticate();

    for (let key in models) {
        let model = models[key](sequelize)

        if (models[key].associate) models[key].associate(models)
        models[key] = model;
    }

    await sequelize.sync({})
    console.log(`Connection to postgres has been established successfully`);
}