const logger = require('../utils/logger');
const httpResponses = require('../utils/httpResponses');
const locationService = require('../services/location');
const mapService = require('../services/map');
const typeEnum = require('../constants/enum');
const constants = require('../constants/constants');
const mongoose = require('mongoose');

const createLocation = async (req, res) => {
  try {
    const { title, description, lat, long, alt, map, images, type, center } = req.body;
    logger.info(`[createLocation]: req -> ${JSON.stringify(req.body)}`);

    // if (map) {
    //   const data = await mapService.getLocationForMap(map);
    //   if (!data) {
    //     logger.debug(`[createLocation]: getLocationForMap -> ${httpResponses.MAP_NOT_FOUND}`);
    //     return res.notFound(httpResponses.MAP_NOT_FOUND);
    //   }

    //   if (type === typeEnum.typeLocation.CHARGING) {
    //     for (const l of data?.locations) {
    //       const typeLocation = await locationService.getLocationById(l?._id);
    //       if (typeLocation?.type === typeEnum.typeLocation.CHARGING) {
    //         logger.debug(`[createLocation]: getLocationById -> ${httpResponses.MAP_ALREADY_HAS_A_LOCATION_CHARGING}`);
    //         return res.badRequest(httpResponses.MAP_ALREADY_HAS_A_LOCATION_CHARGING);
    //       }
    //     }
    //   }
    // }

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
      await mapService.updateMap({ _id: map }, { center });
      logger.info(`[createLocation]: updateMap -> ${httpResponses.SUCCESS}`);
    }
    return res.status(httpResponses.HTTP_STATUS_OK).json({
      success: true,
      message: `${httpResponses.MAP_CREATE_SUCCESSFULLY}`,
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

    if (location.map) {
      await mapService.updateMap({ _id: location?.map }, { center: update?.center });
      logger.info(`[createLocation]: updateMap -> ${httpResponses.SUCCESS}`);
    }

    return res.ok(httpResponses.MAP_UPDATE_SUCCESSFULLY);
  } catch (error) {
    logger.error(`[updateLocation] error -> ${error.message}`);
    return res.internalServer(error.message);
  }
};

const deletLocation = async (req, res) => {
  try {
    const { _id } = req.params;
    const { center } = req.body;
    logger.debug(`[deletLocation] params -> ${_id} - body -> ${center}`);

    const getLocationById = await locationService.getLocationById(_id);
    if (!getLocationById) {
      logger.debug(`[deletLocation]: getLocationById -> ${httpResponses.LOCATION_NOT_FOUND}`);
      return res.notFound(httpResponses.LOCATION_NOT_FOUND);
    }
    logger.info(`[deletLocation]: getLocationById -> ${httpResponses.SUCCESS}`);

    const deletLocation = await locationService.deleteLocationById(_id);
    logger.info(`[deletLocation]: deleteLocationById -> ${JSON.stringify(deletLocation)}`);

    if (deletLocation.map) {
      await mapService.updateMap({ _id: deletLocation?.map }, { center });
      logger.info(`[createLocation]: mapService -> ${httpResponses.SUCCESS}`);
    }

    return res.ok(httpResponses.MAP_DELETE_SUCCESSFULLY);
  } catch (error) {
    logger.error(`[deletLocation] error -> ${error.message}`);
    return res.internalServer(error.message);
  }
};

module.exports = { createLocation, getLocationById, getAllLocation, updateLocation, deletLocation };
