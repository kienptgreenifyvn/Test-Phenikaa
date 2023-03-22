const express = require('express');
const mapRoute = express.Router();
const { UserRole } = require('../constants/enum');
const mapController = require('../controllers/map');
const { requireLogin, checkPermissions } = require('../middleware/permission');

mapRoute.post('/', mapController.createMap);
mapRoute.get('/:_id', mapController.getMapById);
mapRoute.get('/', mapController.getAllMap);
mapRoute.put('/:_id', mapController.updateMap);
mapRoute.delete('/:_id', mapController.deletMap);

module.exports = mapRoute;
