const express = require("express");
const router = express.Router();
const cors = require('cors');
const app = express();
app.use(cors());
app.use('/map',require('../controller/map'))

module.exports = app;