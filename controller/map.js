const express = require('express');
const indianLanguages = require('../model/india_language');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config');
const Polygon = require('../model/Polygon');
const login = require('../model/login');
const conf = require('../model/config');
const states = require('../model/state');

router.post('/indian-languages', async (req, res) => {

        const languages = req.body;
        console.log(!Array.isArray(languages));

        // Validate that the request body is an array
        if (Array.isArray(languages)) {
            try{
                await indianLanguages.bulkCreate(languages);
                res.status(200).send({ message: "data added to the database successfully" });

            }
            catch(err){
                console.error(err);
                res.status(500).send({ message:"internal server error" });
        }
    }
        else {
            res.status(400).send({ message:"Invalid data format. Please send an array of objects." });

        }
    });

 router.get('/languages', async (req, res) => {
        try {
          const languages = await indianLanguages.findAll({
            where: {
              Macroarea: {
                [Op.ne]: null
              },
              Countries: {
                [Op.startsWith]: 'India'
              }
            }
          });
          res.json(languages);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
        }
      });

 router.get('/languages/search', async (req, res) => {
        const firstLetter = req.query.firstLetter;
    
    
        try {
            const query = `SELECT Name FROM aksharaMuseum.LanguageInfos WHERE Name LIKE :firstLetterPattern`;
            const results = await sequelize.query(query, {
                replacements: { firstLetterPattern: `${firstLetter}%` },
                type: sequelize.QueryTypes.SELECT
            });
            res.json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    });

 router.post('/polygons', async (req, res) => {
  console.log("....enter...");
      try {
          const { coordinates,state,language,country,strokeColor,fillColor } = req.body;
          console.log(coordinates)
          if (!Array.isArray(Array(coordinates))) {
              return res.status(400).json({ error: 'Coordinates must be an array' });
          }
          if (!Array.isArray(language)) {
            return res.status(400).json({ error: 'Language must be an array' });
        }
  
        const polygon = await Polygon.create({ coordinates:Array(coordinates),state,language,country,strokeColor,fillColor });
        res.status(201).json(polygon);
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Server error' });
      }
  });

router.post('/language-details', async (req, res) => {
    const language = req.body.language;

    try {
        // Fetch details from languageinfos table
        const languageQuery = `SELECT * FROM aksharaMuseum.LanguageInfos WHERE Name = "${language}"`;
        const [languageResult] = await sequelize.query(languageQuery, {
            replacements: [language],
            type: sequelize.QueryTypes.SELECT,
        });
        console.log("................",languageQuery);

        // Fetch details from Polygon table
        const polygonQuery = `SELECT coordinates, state, country FROM aksharaMuseum.Polygons WHERE JSON_CONTAINS(language, '["${language}"]')`;
        const [polygonResults] = await sequelize.query(polygonQuery);
//console.log(polygonResults);
        // Combine the results
        const response = {
            languageDetails: languageResult,
            polygons: polygonResults
        };

        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// router.post('/login', async (req, res) => {
//     console.log("..................enter...........")
//     try {
//       console.log("login");
//       const { email, password } = req.body;
     
  
//       const user = await login.findOne({
//         where: {
//             email,
//         },
//       });
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       const isPasswordValid = await bcrypt.compare(password, user.password);
  
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Invalid password' });
//       }
//         return res.status(200).json({ message: 'Login successful',user});
  
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });

//   router.post('/insert-ipadress', async (req, res) => {
//     try {
//       const { ipadress, url } = req.body;
  
//       if (!ipadress || !url) {
//         return res.status(400).json({ error: 'Both ipadress and url are required' });
//       }
  
//       await conf.create({ ipadress, url });
//       return res.status(200).json({ message: 'Insert successful' });
  
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
//   router.get('/get-url',async(req,res)=>{
//     try{
//       const ()
//     }
//   })

  router.post('/list-states', async (req, res) => {
    const { country } = req.body;
  
    if (!country) {
      return res.status(400).json({ message: 'Country is required' });
    }
  
    try {
      const stateRecords = await states.findAll({
        where: { country },
        attributes: ['state'] 
      });
  
      // If no states found, return appropriate response
      if (stateRecords.length === 0) {
        return res.status(404).json({ message: 'No states found for the given country' });
      }
  
      // Extract states from the records into a single array
      const stateList = stateRecords.map(record => record.state);
      const languageRecords = await indianLanguages.findAll({
        attributes: ['Name']
      });
  
      // If no languages found, return appropriate response
      if (languageRecords.length === 0) {
        return res.status(404).json({ message: 'No languages found' });
      }
  
      // Extract languages from the records into a single array
      const languageList = languageRecords.map(record => record.Name);
  
      // Return the list of languages in a single array
      return res.status(200).json({ message: 'Languages retrieved successfully', languages: languageList,states: stateList });
   
      // Return the list of states in a single array
    //  return res.status(200).json({ message: 'States retrieved successfully', states: stateList });
    } catch (error) {
      console.error('Error fetching states:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  



router.post('/add-states', async (req, res) => {
    const { country, states: statesArray } = req.body; 
  
    if (!country || !Array.isArray(statesArray) || statesArray.length === 0) {
      return res.status(400).json({ message: 'Country and states array are required' });
    }
  
    try {
      const statesData = statesArray.map(state => ({ country, state }));
  
      await states.bulkCreate(statesData);
  
      return res.status(201).json({ message: 'States added successfully' });
    } catch (error) {
      console.error('Error adding states:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  router.get('/listLanguage', async (req, res) => {
    try {
      console.log("...................enter..................")
      // Fetch all languages from the indianLanguages table
      const languageRecords = await indianLanguages.findAll({
        attributes: ['Name']
      });
  
      // If no languages found, return appropriate response
      if (languageRecords.length === 0) {
        return res.status(404).json({ message: 'No languages found' });
      }
  
      // Extract languages from the records into a single array
      const languageList = languageRecords.map(record => record.Name);
  
      // Return the list of languages in a single array
      return res.status(200).json({ message: 'Languages retrieved successfully', languages: languageList });
    } catch (error) {
      console.error('Error fetching languages:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });




  // router.post('/list-language', async (req, res) => {
  //   const { country } = req.body;
  
  //   // Check if the country parameter is provided
  //   if (!country) {
  //     return res.status(400).json({ message: 'Country is required' });
  //   }
  
  //   try {
  //     // Fetch languages based on the country from the database
  //     const languages = await indianLanguages.findAll({
  //       where: { Countries: country }, // Use the correct column name 'Countries'
  //       attributes: ['Name'] 
  //     });
  
  //     // Check if any languages were found
  //     if (languages.length === 0) {
  //       return res.status(404).json({ message: 'No languages found for the given country' });
  //     }
  
  //     // Return the fetched languages
  //     return res.status(200).json({ languages });
  //   } catch (error) {
  //     // Handle errors
  //     console.error(error);
  //     return res.status(500).json({ message: 'An error occurred while fetching languages' });
  //   }
  // });
  
  
 
 
  router.post('/list-language', async (req, res) => {
    const { country } = req.body;
  
    // Check if the country parameter is provided
    if (!country) {
      return res.status(400).json({ message: 'Country is required' });
    }
  
    try {
      // Fetch languages based on the country from the database
      const languages = await indianLanguages.findAll({
        where: { Countries: country }, // Use the correct column name 'Countries'
        attributes: ['Name']
      });
  
      // Check if any languages were found
      if (languages.length === 0) {
        return res.status(404).json({ message: 'No languages found for the given country' });
      }
  
      // Extract the names of the languages into a single array
      const languageNames = languages.map(language => language.Name);
  
      // Return the extracted names
      return res.status(200).json({ languages: languageNames });
    } catch (error) {
      // Handle errors
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while fetching languages' });
    }
  });
  
  
module.exports = router;
