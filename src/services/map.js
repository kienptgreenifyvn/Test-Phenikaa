const Map = require('../models/map');
const mongoose = require('mongoose');

const getMap = async (filter) => {
  return await Map.findOne(filter);
};

const createMap = async (map) => {
  const newMap = new Map(map);
  return await newMap.save();
};

const getMapById = async (_id) => {
  return await Map.findById(_id);
};

const getAllMap = async (query, search, pagination) => {
  const pipeline = [
    {
      $match: { ...query },
    },
  ];
  if (search) {
    pipeline.push({ $match: { title: { $regex: search, $options: 'i' } } });
  }

  const data = await Map.aggregate(pipeline);
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
  const maps = await Map.aggregate(pipeline);

  return { maps, total };
};

const updateMap = async (filter, newModel) => {
  return await Map.findByIdAndUpdate(filter, newModel);
};

const deleteMapById = async (_id) => {
  return await Map.findByIdAndDelete(_id);
};

const getLocationForMap = async (map) => {
  return await Map.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(map),
      },
    },
    {
      $lookup: {
        from: 'locations',
        localField: '_id',
        foreignField: 'map',
        as: 'locations',
      },
    },
  ]).then((data) => data[0] || null);
};

module.exports = {
  getMap,
  createMap,
  getMapById,
  getAllMap,
  updateMap,
  deleteMapById,
  getLocationForMap,
};
