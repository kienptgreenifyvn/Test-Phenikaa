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
    location: [{ type: mongoose.Schema.Types.ObjectId, ref: 'locations', index: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('maps', mapSchema);
