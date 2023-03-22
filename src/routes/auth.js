const express = require('express');
const authRoute = express.Router();
const authController = require('../controllers/auth');

authRoute.post('/login', authController.login);

module.exports = authRoute;
