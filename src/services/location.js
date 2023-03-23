const Location = require('../models/location');
const mongoose = require('mongoose');

const getLocation = async (_id) => {
  return await Location.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(_id) },
    },
    {
      $lookup: {
        from: 'maps',
        localField: 'map',
        foreignField: '_id',
        as: 'map',
      },
    },
    { $unwind: { path: '$map', preserveNullAndEmptyArrays: true } },
  ]).then((data) => data[0] || null);
};

const findLocation = async (filter) => {
  return await Location.findOne(filter);
};

const createLocation = async (location) => {
  const newLocation = new Location(location);
  return await newLocation.save();
};

const getLocationById = async (_id) => {
  return await Location.findById(_id);
};

const updateLocation = async (filter, newModel) => {
  return await Location.findByIdAndUpdate(filter, newModel);
};

const updateManyMapIdForLocation = async (filter, newModel) => {
  return await Location.updateMany(filter, { $set: { map: newModel } });
};

const deleteLocationById = async (_id) => {
  return await Location.findByIdAndDelete(_id);
};

const deleteManyLocation = async (map) => {
  return await Location.deleteMany({ map: new mongoose.Types.ObjectId(map) });
};

const getAllLocation = async (query, search, pagination) => {
  const pipeline = [
    {
      $match: { ...query },
    },
    {
      $lookup: {
        from: 'maps',
        localField: 'map',
        foreignField: '_id',
        as: 'map',
      },
    },
    { $unwind: { path: '$map', preserveNullAndEmptyArrays: true } },
  ];
  if (search) {
    pipeline.push({ $match: { title: { $regex: search, $options: 'i' } } });
  }

  const data = await Location.aggregate(pipeline);
  const total = data.length;

  if (pagination) {
    pipeline.push(
      {
        $skip: pagination.page * pagination.limit - pagination.limit,
      },
      {
        $limit: pagination.limit,
      }
    );
  }
  const locations = await Location.aggregate(pipeline);
  return { locations, total };
};

module.exports = {
  getLocation,
  createLocation,
  getLocationById,
  updateLocation,
  deleteLocationById,
  deleteManyLocation,
  updateManyMapIdForLocation,
  getAllLocation,
  findLocation,
};
