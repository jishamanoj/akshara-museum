const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("aksharaMuseum", "root","pass@123", {
    dialect: "mysql",
        host: "localhost"
});

module.exports = sequelize;
