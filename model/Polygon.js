const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Polygon = sequelize.define('Polygon', {
    coordinates: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    state :{
        type : DataTypes.STRING,
    },
    language: {
        type: DataTypes.JSON,
    },
    country :{
        type:DataTypes.STRING,
    },
    strokeColor :{
        type:DataTypes.STRING,

    },

    fillColor:{
        type:DataTypes.STRING,
    }
});

Polygon.sync({ alter: true })
    .then((data) => {
        console.log('Polygon table created');
    })
    .catch((err) => {
        console.log(err);
    });
module.exports = Polygon;