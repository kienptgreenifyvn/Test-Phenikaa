const express = require('express');
const locationRoute = express.Router();
const { UserRole } = require('../constants/enum');
const locationController = require('../controllers/location');
const { requireLogin, checkPermissions } = require('../middleware/permission');

const { validationCreateLocation, validationUpdateLocation } = require('../middleware/validationLocation');

locationRoute.post(
  '/',
  requireLogin,
  checkPermissions(UserRole.ADMIN),
  validationCreateLocation,
  locationController.createLocation
);

locationRoute.get('/:_id', locationController.getLocationById);

locationRoute.get('/', locationController.getAllLocation);

locationRoute.put(
  '/:_id',
  requireLogin,
  checkPermissions(UserRole.ADMIN),
  validationUpdateLocation,
  locationController.updateLocation
);

locationRoute.delete('/:_id', requireLogin, checkPermissions(UserRole.ADMIN), locationController.deleteLocation);

module.exports = locationRoute;
