const logger = require('../utils/logger');
const httpResponses = require('../utils/httpResponses');
const mapService = require('../services/map');
const locationService = require('../services/location');
const { uniqueLocation } = require('../helper/helpFunction');
const constants = require('../constants/constants');
const typeEnum = require('../constants/enum');

const createMap = async (req, res) => {
  try {
    const { title, description, center, contact, openingTime, price, location } = req.body;
    logger.info(`[createMap]: req -> ${JSON.stringify(req.body)}`);

    if (location) {
      logger.info(`[createMap]: newMap -> ${JSON.stringify(location)}`);
      let count = 0;
      for (const l of location) {
        const typeLocation = await locationService.getLocationById(l);
        if (typeLocation?.type === typeEnum.typeLocation.CHARGING) {
          count++;
        }
        if (count > 1) {
          return res.status(httpResponses.HTTP_STATUS_OK).json({
            success: true,
            message: `${httpResponses.MAP_ALREADY_HAS_A_LOCATION_CHARGING}`,
          });
        }
      }
    }

    const newMap = {
      title,
      description,
      center: center,
      contact: contact,
      openingTime,
      price,
      location: uniqueLocation(location),
    };
    logger.info(`[createMap]: newMap -> ${JSON.stringify(newMap)}`);

    const map = await mapService.createMap(newMap);
    logger.info(`[createMap]: createMap -> ${httpResponses.SUCCESS}`);

    await locationService.updateManyMapIdForLocation({ _id: { $in: location } }, map._id);
    logger.info(`[createMap]: updateManyMapIdForLocation -> ${httpResponses.SUCCESS}`);

    return res.status(httpResponses.HTTP_STATUS_OK).json({
      success: true,
      message: `${httpResponses.MAP_CREATE_SUCCESSFULLY}`,
      data: map,
    });
  } catch (error) {
    logger.error(`[createMap]: error -> ${error.message}`);
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const getMapById = async (req, res) => {
  try {
    const { _id } = req.params;
    logger.info(`[getMapById]: req -> ${JSON.stringify(req.params)}`);
    const getMapById = await mapService.getMapById(_id);
    if (!getMapById) {
      logger.debug(`[getMapById]: getMapById -> ${httpResponses.MAP_NOT_FOUND}`);
      return res.notFound(httpResponses.MAP_NOT_FOUND);
    }
    return res.status(httpResponses.HTTP_STATUS_OK).json({
      success: true,
      message: `${httpResponses.SUCCESS}`,
      map: getMapById,
    });
  } catch (error) {
    logger.error(`[getMapById]: error -> ${error.message}`);
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const getAllMap = async (req, res) => {
  try {
    const { search, limit, page } = req.query;
    logger.info(`[getAllMap]: req -> ${JSON.stringify(req.query)}`);

    const pagination = {
      limit: +limit || constants.DEFAULT_LIMIT,
      page: +page || constants.DEFAULT_PAGE,
    };
    logger.info(`[getAllMap]: pagination -> ${JSON.stringify(pagination)}`);

    const { maps, total } = await mapService.getAllMap({}, search, pagination);

    return res.status(httpResponses.HTTP_STATUS_OK).json({
      success: true,
      message: `${httpResponses.SUCCESS}`,
      maps: maps,
      pagination: {
        ...pagination,
        total,
      },
    });
  } catch (error) {
    logger.error(`[getProfileUser]: error -> ${error.message}`);
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const updateMap = async (req, res) => {
  try {
    const { _id } = req.params;
    const update = req.body;
    logger.debug(`[updateMap] params -> ${JSON.stringify(req.params)} - body -> ${JSON.stringify(req.body)}.`);

    const getMapById = await mapService.getMapById(_id);
    if (!getMapById) {
      logger.debug(`[updateMap]: getMapById -> ${httpResponses.MAP_NOT_FOUND}`);
      return res.notFound(httpResponses.MAP_NOT_FOUND);
    }

    await mapService.updateMap(_id, update);
    logger.info(`[updateMap]: updateMap -> ${httpResponses.SUCCESS}`);

    return res.ok(httpResponses.MAP_UPDATE_SUCCESSFULLY);
  } catch (error) {
    logger.error(`[updateMap] error -> ${error.message}`);
    return res.internalServer(error.message);
  }
};

const deletMap = async (req, res) => {
  try {
    const { _id } = req.params;
    logger.debug(`[deletMap] params -> ${_id}`);

    const getMapById = await mapService.getMapById(_id);
    if (!getMapById) {
      logger.debug(`[deletMap]: getMapById -> ${httpResponses.MAP_NOT_FOUND}`);
      return res.notFound(httpResponses.MAP_NOT_FOUND);
    }

    const deleteMap = await mapService.deleteMapById(_id);
    logger.info(`[deleteMap]: deleteMapById -> ${JSON.stringify(deleteMap)}`);

    await locationService.deleteManyLocation(deleteMap._id);
    logger.info(`[deleteMap]: deleteManyLocation -> ${httpResponses.SUCCESS}`);

    return res.ok(httpResponses.MAP_DELETE_SUCCESSFULLY);
  } catch (error) {
    logger.error(`[deletMap] error -> ${error.message}`);
    return res.internalServer(error.message);
  }
};

module.exports = { createMap, getMapById, getAllMap, updateMap, deletMap };
