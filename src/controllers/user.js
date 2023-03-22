const logger = require('../utils/logger');
const httpResponses = require('../utils/httpResponses');

const userService = require('../services/user');
const securityService = require('../services/security');

const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    logger.info(`[createUser]: req -> ${JSON.stringify(req.body)}`);

    const existedUser = await userService.getUserByEmail(email);
    if (existedUser) {
      logger.debug(`[createUser]: getUserByEmail -> ${httpResponses.EMAIL_ALREADY_EXISTS}`);
      return res.badRequest(httpResponses.EMAIL_ALREADY_EXISTS);
    }
    logger.debug(`[createUser]: getUserByEmail -> ${httpResponses.SUCCESS}`);

    const hashPassword = securityService.hashPassword(password);
    logger.debug(`[createUser]: hashPassword -> ${httpResponses.SUCCESS}`);

    const newUser = {
      email,
      password: hashPassword,
      role,
    };
    const user = await userService.createUser(newUser);
    logger.debug(`[createUser]: user -> ${httpResponses.SUCCESS}`);

    return res.status(httpResponses.HTTP_STATUS_OK).json({
      success: true,
      message: `${httpResponses.USER_CREATE_SUCCESSFULLY}`,
      user: user,
    });
  } catch (error) {
    logger.error(`[createUser]: error -> ${error.message}`);
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

const getProfileUser = async (req, res) => {
  try {
    const { _id } = req.params;
    logger.info(`[getProfileUser]: req -> ${JSON.stringify(req.params)}`);

    const getUser = await userService.getUserById(_id);
    if (!getUser) {
      logger.debug(`[getProfileUser]: getUserById -> ${httpResponses.USER_NOT_FOUND}`);
      return res.notFound(httpResponses.USER_NOT_FOUND);
    }
    return res.status(httpResponses.HTTP_STATUS_OK).json({
      success: true,
      message: `${httpResponses.SUCCESS}`,
      user: getUser,
    });
  } catch (error) {
    logger.error(`[getProfileUser]: error -> ${error.message}`);
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${error.message}`,
    });
  }
};
module.exports = {
  createUser,
  getProfileUser,
};
