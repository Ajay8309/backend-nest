// app.js
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');

const app = express();

// Allow JSON payloads
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// Base API prefix: /api/v1
app.use('/api/v1', routes);

// health
app.get('/', (req, res) => res.send('JobNest API is running'));

module.exports = app;
