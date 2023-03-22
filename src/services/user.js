const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getUser = async (filter) => {
  return await User.findOne(filter);
};

const createUser = async (user) => {
  const newUser = new User(user);
  return await newUser.save();
};

const getUserById = async (_id) => {
  return await User.findById(_id);
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const updateUser = async (filter, newModel) => {
  return await User.findByIdAndUpdate(filter, newModel);
};

const deleteUserById = async (_id) => {
  return await User.findByIdAndDelete(_id);
};

module.exports = {
  getUser,
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUserById,
};
