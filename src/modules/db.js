require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

module.exports.initDbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    logger.debug('[Phenikaa] Database connect successfully.');
  } catch (err) {
    logger.error(`[Phenikaa] Error connecting: ${err.message}`);
    process.exit(1);
  }
};
