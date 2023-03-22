const express = require('express');
const mapRoute = express.Router();
const { UserRole } = require('../constants/enum');
const mapController = require('../controllers/map');
const { requireLogin, checkPermissions } = require('../middleware/permission');

mapRoute.post('/', requireLogin, checkPermissions(UserRole.ADMIN), mapController.createMap);
mapRoute.get('/:_id', mapController.getMapById);
mapRoute.get('/', mapController.getAllMap);
mapRoute.put('/:_id', requireLogin, checkPermissions(UserRole.ADMIN), mapController.updateMap);
mapRoute.delete('/:_id', requireLogin, checkPermissions(UserRole.ADMIN), mapController.deletMap);

module.exports = mapRoute;
