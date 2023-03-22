// utils
const logger = require('../utils/logger');
const httpResponses = require('../utils/httpResponses');

// Service
const mapService = require('../services/map');
const locationService = require('../services/location');
const typeEnum = require('../constants/enum');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const validationCreateLocation = async (req, res, next) => {
  try {
    const { title, lat, long, alt, map, type } = req.body;
    logger.info(`[validationCreateLocation]: req -> ${JSON.stringify(req.body)}`);

    const existedTitle = await mapService.getMap({ title: title });
    if (existedTitle) {
      logger.debug(`[validationCreateLocation]: title -> ${httpResponses.MAP_TITLE_ALREADY_EXISTS}`);
      return res.badRequest(httpResponses.MAP_TITLE_ALREADY_EXISTS);
    }

    if (map) {
      const data = await mapService.getLocationForMap(map);
      if (!data) {
        logger.debug(`[validationCreateLocation]: getLocationForMap -> ${httpResponses.MAP_NOT_FOUND}`);
        return res.notFound(httpResponses.MAP_NOT_FOUND);
      }

      if (type === typeEnum.typeLocation.CHARGING) {
        for (const l of data?.locations) {
          const typeLocation = await locationService.getLocationById(l?._id);
          if (typeLocation?.type === typeEnum.typeLocation.CHARGING) {
            logger.debug(
              `[validationCreateLocation]: getLocationById -> ${httpResponses.MAP_ALREADY_HAS_A_LOCATION_CHARGING}`
            );
            return res.badRequest(httpResponses.MAP_ALREADY_HAS_A_LOCATION_CHARGING);
          }
        }
      }
    }

    if (!lat || !long || !alt) {
      logger.debug(`[validationCreateLocation]: lat, long, alt -> ${httpResponses.LOCATION_CERTER_NOT_EMPTY}`);
      return res.badRequest(httpResponses.LOCATION_CERTER_NOT_EMPTY);
    }

    logger.debug(`[validationCreateLocation]: validation -> ${httpResponses.SUCCESS}`);
    next();
  } catch (err) {
    logger.error(`[validationCreateLocation]: error -> ${err.message}`);
    return res.internalServer(err.message);
  }
};

const validationUpdateLocation = async (req, res, next) => {
  try {
    const { title } = req.body;
    logger.debug(`[validationUpdateLocation]: body -> ${JSON.stringify(req.body)}`);

    const existedTitle = await mapService.getMap({ title: title });
    if (existedTitle) {
      logger.debug(`[validationUpdateLocation]: title -> ${httpResponses.MAP_TITLE_ALREADY_EXISTS}`);
      return res.badRequest(httpResponses.MAP_TITLE_ALREADY_EXISTS);
    }

    logger.debug(`[validationUpdateLocation]: validation -> ${httpResponses.SUCCESS}`);
    next();
  } catch (err) {
    logger.error(`[validationUpdateLocation]: error -> ${err.message}`);
    return res.internalServer(err.message);
  }
};

module.exports = {
  validationCreateLocation,
  validationUpdateLocation,
};
