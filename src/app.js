require('dotenv').config();
const express = require('express');
const httpResponses = require('./utils/httpResponses');
const cors = require('cors');
const session = require('express-session');
const rateLimit = require('express-rate-limit');

const app = express();

const indexRoute = require('./routes/index');
const { initDbConnection } = require('./modules/db');
const logger = require('./utils/logger');
const keys = require('./constants/constants');

initDbConnection();

// Setup cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: keys.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: `Too many accounts created from this IP, please try again after an hour`,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use((req, res, next) => {
  res.unauthorized = () => {
    return res.status(httpResponses.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: `${httpResponses.UNAUTHORIZED}`,
    });
  };
  res.badRequest = (message) => {
    return res.status(httpResponses.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: message,
    });
  };
  res.notFound = (message) => {
    return res.status(httpResponses.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: message,
    });
  };
  res.internalServer = (message) => {
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: message,
    });
  };
  res.ok = (message, data) => {
    const responseObj = {
      success: true,
    };
    message && (responseObj.message = message);
    data && (responseObj.data = data);
    return res.status(httpResponses.HTTP_STATUS_OK).json(responseObj);
  };
  res.created = (message, data) => {
    const responseObj = {
      success: true,
      message: message,
    };
    data && (responseObj.data = data);
    return res.status(httpResponses.HTTP_STATUS_CREATED).json(responseObj);
  };
  res.response = (statusCode, success, message) => {
    return res.status(statusCode).json({
      success: success,
      message: message,
    });
  };

  next();
});

app.use('/api', indexRoute);

app.get('/phenikaa', function (req, res) {
  logger.debug('[Phenikaa] -> test');
  res.send('Phenikaa-Backend.');
});

module.exports = app;
