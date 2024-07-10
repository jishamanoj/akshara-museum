const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use('/api/v1', require('./routing/routing'));

module.exports = app;