const mongoose = require('mongoose');

const mapSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    description: {
      type: String,
    },
    center: {
      lat: Number,
      long: Number,
    },
    contact: {
      phone: String,
      website: String,
    },
    openingTime: {
      type: Date,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('maps', mapSchema);
