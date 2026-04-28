import * as addressService from "../services/addressService.js";

export const addAddress = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const address = await addressService.addAddress(userId, req.body);
    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

export const getAllAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getAllAddresses();
    
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ 
      message: error.message 
    });
  }
};

export const getMyAddresses = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const addresses = await addressService.getUserAddresses(userId);
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

export const makeDefault = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const addressId = req.params?.id;
    const updated = await addressService.setAsDefault(userId, addressId);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const updateMyAddress = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const addressId = req.params?.id;
    const updated = await addressService.updateAddress(userId, addressId, req.body);
    res.status(200).json({
      message: "Address updated successfully",
      address: updated
    });
  } catch (error) {
    next(error);
  }
};