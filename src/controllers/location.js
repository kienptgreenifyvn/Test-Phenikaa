const logger = require('../utils/logger');
const httpResponses = require('../utils/httpResponses');
const locationService = require('../services/location');
const mapService = require('../services/map');
const typeEnum = require('../constants/enum');
const constants = require('../constants/constants');
const mongoose = require('mongoose');
const helper = require('../helper/helpFunction');

const createLocation = async (req, res) => {
  try {
    const { title, description, lat, long, alt, map, images, type } = req.body;
    logger.info(`[createLocation]: req -> ${JSON.stringify(req.body)}`);

    const newLocation = {
      title,
      description,
      lat,
      long,
      alt,
      map,
      images,
      type,
    };
    logger.info(`[createLocation]: newLocation -> ${JSON.stringify(newLocation)}`);

    const location = await locationService.createLocation(newLocation);
    logger.info(`[createLocation]: location -> ${httpResponses.SUCCESS}`);

    if (map) {
      const data = await mapService.getLocationForMap(map);
      logger.info(`[createLocation]: getLocationForMap -> ${httpResponses.SUCCESS}`);

      await mapService.updateLocationForMap(map, location?._id);
      logger.info(`[createLocation]: updateLocationForMap -> ${httpResponses.SUCCESS}`);

      await mapService.updateMap({ _id: map }, { center: helper.averageGeolocation(data.locations) });
      logger.info(`[createLocation]: updateMap -> ${httpResponses.SUCCESS}`);
    }

    io.emit('createLocation', location);
    return res.status(httpResponses.HTTP_STATUS_OK).json({
      success: true,
      message: `${httpResponses.LOCATION_CREATE_SUCCESSFULLY}`,
      data: location,
    });
  } catch (error) {
    logger.error(`[createLocation]: error -> ${error.message}`);
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const getLocationById = async (req, res) => {
  try {
    const { _id } = req.params;
    logger.info(`[getLocationById]: params -> ${JSON.stringify(req.params)}`);
    const getLocationById = await locationService.getLocation(_id);
    if (!getLocationById) {
      logger.debug(`[getLocationById]: getLocationById -> ${httpResponses.LOCATION_NOT_FOUND}`);
      return res.notFound(httpResponses.LOCATION_NOT_FOUND);
    }
    logger.debug(`[getLocationById]: getLocationById -> ${httpResponses.SUCCESS}`);

    return res.status(httpResponses.HTTP_STATUS_OK).json({
      success: true,
      message: `${httpResponses.SUCCESS}`,
      location: getLocationById,
    });
  } catch (error) {
    logger.error(`[getLocationById]: error -> ${error.message}`);
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const getAllLocation = async (req, res) => {
  try {
    const { search, limit, page } = req.query;
    logger.info(`[getAllLocation]: req -> ${JSON.stringify(req.query)}`);

    const pagination = {
      limit: +limit || constants.DEFAULT_LIMIT,
      page: +page || constants.DEFAULT_PAGE,
    };
    logger.info(`[getAllLocation]: pagination -> ${JSON.stringify(pagination)}`);

    const { locations, total } = await locationService.getAllLocation({}, search, pagination);

    return res.status(httpResponses.HTTP_STATUS_OK).json({
      success: true,
      message: `${httpResponses.SUCCESS}`,
      locations: locations,
      pagination: {
        ...pagination,
        total,
      },
    });
  } catch (error) {
    logger.error(`[getAllLocation]: error -> ${error.message}`);
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { _id } = req.params;
    const update = req.body;
    logger.debug(`[updateLocation] params -> ${JSON.stringify(req.params)} - body -> ${JSON.stringify(req.body)}.`);

    const getLocationById = await locationService.getLocationById(_id);
    if (!getLocationById) {
      logger.debug(`[updateLocation]: getLocationById -> ${httpResponses.LOCATION_NOT_FOUND}`);
      return res.notFound(httpResponses.LOCATION_NOT_FOUND);
    }
    logger.info(`[updateLocation]: getLocationById -> ${httpResponses.SUCCESS}`);

    const location = await locationService.updateLocation(_id, update);
    logger.info(`[updateLocation]: updateLocation -> ${httpResponses.SUCCESS}`);

    if (location?.map && (update.lat || update.long)) {
      const data = await mapService.getLocationForMap(location?.map);
      logger.info(`[createLocation]: getLocationForMap -> ${httpResponses.SUCCESS}`);

      await mapService.updateMap({ _id: location?.map }, { center: helper.averageGeolocation(data?.locations) });
      logger.info(`[createLocation]: updateMap -> ${httpResponses.SUCCESS}`);
    }
    io.emit('updateLocation', location);
    return res.ok(httpResponses.LOCATION_UPDATE_SUCCESSFULLY);
  } catch (error) {
    logger.error(`[updateLocation] error -> ${error.message}`);
    return res.internalServer(error.message);
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { _id } = req.params;
    logger.debug(`[deleteLocation] params -> ${_id}`);

    const getLocationById = await locationService.getLocationById(_id);
    if (!getLocationById) {
      logger.debug(`[deleteLocation]: getLocationById -> ${httpResponses.LOCATION_NOT_FOUND}`);
      return res.notFound(httpResponses.LOCATION_NOT_FOUND);
    }
    logger.info(`[deleteLocation]: getLocationById -> ${httpResponses.SUCCESS}`);

    const deleteLocation = await locationService.deleteLocationById(_id);
    logger.info(`[deleteLocation]: deleteLocationById -> ${JSON.stringify(deleteLocation)}`);

    if (deleteLocation.map) {
      await mapService.deleteLocationForMap(deleteLocation?.map, _id);
      logger.info(`[deleteLocation]: deleteLocationForMap -> ${httpResponses.SUCCESS}`);

      const data = await mapService.getLocationForMap(deleteLocation?.map);
      logger.info(`[createLocation]: getLocationForMap -> ${httpResponses.SUCCESS}`);

      await mapService.updateMap({ _id: deleteLocation?.map }, { center: helper.averageGeolocation(data?.locations) });
      logger.info(`[createLocation]: mapService -> ${httpResponses.SUCCESS}`);
    }
    io.emit('deleteLocation', deleteLocation);
    return res.ok(httpResponses.LOCATION_DELETE_SUCCESSFULLY);
  } catch (error) {
    logger.error(`[deleteLocation] error -> ${error.message}`);
    return res.internalServer(error.message);
  }
};

module.exports = { createLocation, getLocationById, getAllLocation, updateLocation, deleteLocation };
