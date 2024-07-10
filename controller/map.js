const express = require('express');
const indianLanguages = require('../model/india_language');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config');
const Polygon = require('../model/Polygon');

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
            const query = `SELECT Name FROM aksharamuseum.languageinfos WHERE Name LIKE :firstLetterPattern`;
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
      try {
          const { coordinates,state,language,country } = req.body;
          if (!Array.isArray(coordinates)) {
              return res.status(400).json({ error: 'Coordinates must be an array' });
          }
          if (!Array.isArray(language)) {
            return res.status(400).json({ error: 'Language must be an array' });
        }
  
        const polygon = await Polygon.create({ coordinates, state, language, country });
        res.status(201).json(polygon);
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Server error' });
      }
  });

router.get('/language-details/:language', async (req, res) => {
    const language = req.params.language;

    try {
        // Fetch details from languageinfos table
        const languageQuery = `SELECT * FROM aksharamuseum.languageinfos WHERE Name = ?`;
        const [languageResult] = await sequelize.query(languageQuery, {
            replacements: [language],
            type: sequelize.QueryTypes.SELECT,
        });

        // Fetch details from Polygon table
        const polygonQuery = `SELECT coordinates, state, country FROM polygons WHERE JSON_CONTAINS(language, '["${language}"]')`;
        const [polygonResults] = await sequelize.query(polygonQuery);

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


module.exports = router;
