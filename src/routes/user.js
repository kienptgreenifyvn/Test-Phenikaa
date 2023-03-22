const express = require('express');
const userRoute = express.Router();
const { UserRole } = require('../constants/enum');
const userController = require('../controllers/user');
const { requireLogin, checkPermissions } = require('../middleware/permission');

userRoute.post('/', requireLogin, checkPermissions(UserRole.ADMIN), userController.createUser);
userRoute.get('/:_id', requireLogin, checkPermissions(UserRole.ADMIN), userController.getProfileUser);

module.exports = userRoute;
