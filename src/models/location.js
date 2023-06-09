const mongoose = require('mongoose');

const locationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      index: true,
    },
    description: {
      type: String,
    },
    lat: {
      type: Number,
    },
    long: {
      type: Number,
    },
    alt: {
      type: Number,
    },
    map: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'maps',
      index: true,
    },
    images: [{ type: String }],
    type: {
      type: String,
      enum: ['CHARGING', 'STATION', 'WAITING'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('locations', locationSchema);
