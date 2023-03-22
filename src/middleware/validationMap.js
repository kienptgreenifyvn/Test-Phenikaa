// utils
const logger = require('../utils/logger');
const httpResponses = require('../utils/httpResponses');

// Service
const mapService = require('../services/map');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const validationCreateMap = async (req, res, next) => {
  try {
    const { title, center, price } = req.body;
    logger.debug(`[validationCreateMap]: body -> ${JSON.stringify(req.body)}`);

    const existedTitle = await mapService.getMap({ title: title });
    if (existedTitle) {
      logger.debug(`[validationCreateMap]: title -> ${httpResponses.MAP_TITLE_ALREADY_EXISTS}`);
      return res.badRequest(httpResponses.MAP_TITLE_ALREADY_EXISTS);
    }

    if (!center || !center.lat || !center.long) {
      logger.debug(`[validationCreateMap]: certer -> ${httpResponses.MAP_CERTER_NOT_EMPTY}`);
      return res.badRequest(httpResponses.MAP_CERTER_NOT_EMPTY);
    }

    if (typeof price != 'number') {
      logger.debug(`[validationCreateMap]: price -> ${httpResponses.MAP_PRICE_MUST_BE_NUMBER}`);
      return res.badRequest(httpResponses.MAP_PRICE_MUST_BE_NUMBER);
    }
    logger.debug(`[validationCreateMap]: validation -> ${httpResponses.SUCCESS}`);
    next();
  } catch (err) {
    logger.error(`[validationCreateMap]: error -> ${err.message}`);
    return res.internalServer(err.message);
  }
};

const validationUpdateMap = async (req, res, next) => {
  try {
    const { title } = req.body;
    logger.debug(`[validationUpdateMap]: body -> ${JSON.stringify(req.body)}`);

    const existedTitle = await mapService.getMap({ title: title });
    if (existedTitle) {
      logger.debug(`[validationUpdateMap]: title -> ${httpResponses.MAP_TITLE_ALREADY_EXISTS}`);
      return res.badRequest(httpResponses.MAP_TITLE_ALREADY_EXISTS);
    }

    logger.debug(`[validationUpdateMap]: validation -> ${httpResponses.SUCCESS}`);
    next();
  } catch (err) {
    logger.error(`[validationUpdateMap]: error -> ${err.message}`);
    return res.internalServer(err.message);
  }
};

module.exports = {
  validationCreateMap,
  validationUpdateMap,
};
