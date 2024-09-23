const { DataTypes } = require('sequelize');
const sequelize = require('../config');

 const config = sequelize.define('config',{
    ipAdress : {
        type : DataTypes.STRING
    },
    url :{
        type : DataTypes.STRING
    }
 });
 config.sync({alter:true})
 .then((data)=>{
    console.log('config table is created');
 })
 .catch((err)=>{
    console.log(err);
 });
 module.exports = config
