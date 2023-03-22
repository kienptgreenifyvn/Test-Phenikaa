const express = require('express');
const indexRoute = express.Router();

const userRoute = require('./user');
const authRoute = require('./auth');
const mapRoute = require('./map');
const locationRoute = require('./location');

indexRoute.use('/user', userRoute);
indexRoute.use('/auth', authRoute);
indexRoute.use('/map', mapRoute);
indexRoute.use('/location', locationRoute);

module.exports = indexRoute;
