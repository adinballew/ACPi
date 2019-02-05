const Sequelize = require("sequelize");
const sequelize = require("../db");

const sensordata = sequelize.define("sensordata", {
    Date: Sequelize.DATE,
    Temperature: Sequelize.NUMERIC,
    Humidity: Sequelize.NUMERIC,
    Pressure: Sequelize.NUMERIC,
    Lux: Sequelize.NUMERIC
});

module.exports = sensordata;