const logger = require('../utils/logger');
const httpResponses = require('../utils/httpResponses');

const userService = require('../services/user');
const authService = require('../services/auth');
const securityService = require('../services/security');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`[login]: req -> ${JSON.stringify(req.body)}`);

    const existedUser = await userService.getUser({ email: email });
    if (!existedUser) {
      logger.debug(`[login]: getUser -> ${httpResponses.USER_NOT_FOUND}`);
      return res.status(httpResponses.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: `${httpResponses.USER_NOT_FOUND}`,
      });
    }
    logger.debug(`[login]: getUser -> ${httpResponses.SUCCESS}`);

    const isComparedPassword = securityService.comparePassword(password, existedUser.password);
    if (!isComparedPassword) {
      logger.debug(`[login]: comparePassword -> ${httpResponses.ERROR_PASSWORD_INCORRECT}`);
      return res.status(httpResponses.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: `${httpResponses.ERROR_PASSWORD_INCORRECT}`,
      });
    }
    logger.debug(`[login]: comparePassword -> ${httpResponses.SUCCESS}`);

    let user = {
      _id: existedUser._id,
      role: existedUser.role,
    };
    const tokenAuth = authService.generateToken(user);
    logger.debug(`[login]: generateToken -> ${httpResponses.SUCCESS}`);

    return res.status(httpResponses.HTTP_STATUS_OK).json({
      success: true,
      message: `${httpResponses.SUCCESS}`,
      token: tokenAuth,
    });
  } catch (error) {
    logger.error(`[login]: error -> ${error.message}`);
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

module.exports = {
  login,
};
