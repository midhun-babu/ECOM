import User from "../models/userModel.js";

export const insertUser = async (userData) => {
  return await User.create(userData);
};

export const getUserById = async (id) => {
  return await User.findOne({ _id: id, isDeleted: false }).select("-password");
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email, isDeleted: false }).select("-password");
};

export const getAllUsers = async (limit, skip) => {
  return await User.find({ isDeleted: false })
    .select("-password")
    .skip(skip)
    .limit(limit);
};


export const updateUser = async (id, updateData) => {
  return await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { new: true }
  ).select("-password");
};

export const deleteUser = async (id) => {
  return await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
};

export const permanentDelete = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const findUserByIdentifier = async (identifier) => {
  return await User.findOne({
    email: identifier,
    isDeleted: false,
  }).select("-password");
};

export const findUserForLogin = async (identifier) => {
  return await User.findOne({
    isDeleted: false,
    $or: [
      { email: { $regex: `^${identifier}$`, $options: "i" } },
      { uname: { $regex: `^${identifier}$`, $options: "i" } },
    ],
  });
};