const mongoose = require('mongoose');

const mapSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    center: {
      lat: String,
      long: String,
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
