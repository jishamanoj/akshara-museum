const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const states = sequelize.define('states', {
    country :{
        type : DataTypes.STRING
    },
    state :{
        type : DataTypes.STRING
    }
});
states.sync({alter : true})
.then((data)=>{
console.log('states table created');
})
.catch((err)=>{
    console.log(err);
});
module.exports = states