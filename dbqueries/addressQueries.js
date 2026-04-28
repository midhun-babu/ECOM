import Address from "../models/addressModel.js";

export const getAllAddresses = async()=>await Address.find();

export const getAddressesByUserId = async (userId) => await Address.find({ userId });

export const getDefaultAddress = async (userId) => await Address.findOne({ userId, isDefault: true });

export const unsetDefaults = async (userId) => await Address.updateMany({ userId }, { isDefault: false });

export const createAddress = async (data) => await Address.create(data);

export const updateAddressById = async (id, userId, data) => {
  return await Address.findOneAndUpdate(
    { _id: id, userId }, 
    { $set: data }, 
    { new: true, runValidators: true }
  );
};

export const updateAddress = async (id, userId, data) => 
  await Address.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteAddress = async (id, userId) => await Address.findOneAndDelete({ _id: id, userId });
