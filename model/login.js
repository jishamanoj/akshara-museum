const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const login = sequelize.define('login',{
email : {
  type:DataTypes.STRING
},
password : {
    type : DataTypes.STRING
}
});
login.sync({alter : true})
.then((data)=>{
console.log('login table created');
})
.catch((err)=>{
    console.log(err);
});
module.exports = login;