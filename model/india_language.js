const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const LanguageInfo = sequelize.define('LanguageInfo', {
    Sl_No: {
        type: DataTypes.BIGINT,

    },
    Name: {
        type: DataTypes.STRING,
  
    },
    WALS_code:{
        type: DataTypes.STRING,
    
    },
    ISO_639_3:{
        type: DataTypes.STRING,
    },
    Genus:{
        type: DataTypes.STRING,
    },
    Family: {
        type: DataTypes.STRING,
    
    },
    Macroarea: {
        type: DataTypes.STRING,
      
    },
    Latitude:{
        type: DataTypes.STRING
    },
    Longitude:{
        type: DataTypes.STRING
    },
    Countries: {
        type: DataTypes.STRING,
    
    },
    Current_Status: {
        type: DataTypes.STRING,
   
    },
    Script_Yes_No: {
        type: DataTypes.ENUM('yes', 'no'),
      
    },
    Using_Scripts: {
        type: DataTypes.STRING,
    
    },
    Alphabets:{
        type: DataTypes.STRING,
    },
    Sub_Languages:{
        type: DataTypes.STRING
    },
    Reference: {
        type: DataTypes.TEXT,
  
    },
    Tribal_Language_Yes_No:{
        type: DataTypes.ENUM('yes', 'no'),
    },
   
    No_of_speakers: {
        type: DataTypes.TEXT,
     
    },
    Census_Year:{
        type: DataTypes.TEXT,
    },
    Other_Names: {
        type: DataTypes.TEXT,
     
    }
});

LanguageInfo.sync({ alter: false })
    .then((data) => {
        console.log('LanguageInfo table created');
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = LanguageInfo;