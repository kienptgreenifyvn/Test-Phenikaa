const mongoose = require('mongoose');

const localionchema = mongoose.Schema(
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

module.exports = mongoose.model('locations', localionchema);
