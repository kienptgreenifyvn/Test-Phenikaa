const express = require('express');
const userRoute = express.Router();
const { UserRole } = require('../constants/enum');
const userController = require('../controllers/user');
const { requireLogin, checkPermissions } = require('../middleware/permission');
const { addUserValidation } = require('../validation/user.validation');

userRoute.post('/', requireLogin, checkPermissions(UserRole.ADMIN), addUserValidation, userController.createUser);
userRoute.get('/:_id', requireLogin, checkPermissions(UserRole.ADMIN), userController.getProfileUser);

module.exports = userRoute;
