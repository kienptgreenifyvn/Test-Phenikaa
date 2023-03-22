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
  return await Map.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(_id) },
    },
    {
      $lookup: {
        from: 'locations',
        as: 'locations',
        let: {
          location: '$location',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$location'],
              },
            },
          },
        ],
      },
    },
  ]).then((data) => data[0] || null);
};

const getAllMap = async (query, search, pagination) => {
  const pipeline = [
    {
      $match: { ...query },
    },
    {
      $lookup: {
        from: 'locations',
        as: 'locations',
        let: {
          location: '$location',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$location'],
              },
            },
          },
        ],
      },
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

const updateLocationForMap = async (map, locationId) => {
  return await Map.updateOne({ _id: new mongoose.Types.ObjectId(map) }, { $push: { location: locationId } });
};

const deleteLocationForMap = async (map, locationId) => {
  return await Map.updateOne({ _id: new mongoose.Types.ObjectId(map) }, { $pull: { location: locationId } });
};

module.exports = {
  getMap,
  createMap,
  getMapById,
  getAllMap,
  updateMap,
  deleteMapById,
  updateLocationForMap,
  deleteLocationForMap,
};
