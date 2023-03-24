const express = require('express');
const mapRoute = express.Router();
const { UserRole } = require('../constants/enum');
const mapController = require('../controllers/map');
const { requireLogin, checkPermissions } = require('../middleware/permission');
const { addMapValidation } = require('../validation/map.validation');

mapRoute.post('/', requireLogin, checkPermissions(UserRole.ADMIN), addMapValidation, mapController.createMap);

mapRoute.get('/:_id', mapController.getMapById);

mapRoute.get('/', mapController.getAllMap);

mapRoute.put('/:_id', requireLogin, checkPermissions(UserRole.ADMIN), mapController.updateMap);

mapRoute.delete('/:_id', requireLogin, checkPermissions(UserRole.ADMIN), mapController.deleteMap);

module.exports = mapRoute;
