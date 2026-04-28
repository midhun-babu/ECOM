import * as addressQueries from "../dbqueries/addressQueries.js";



export const getAllAddresses= async () => {
  try {
    return await addressQueries.getAllAddresses();
    
  } catch (error) {
    throw new Error("Error fetching addresses from database: " + error.message);
  }
};


export const addAddress = async (userId, addressData) => {
  if (!userId) throw { statusCode: 401, message: "Unauthorized" };

  const existing = await addressQueries.getAddressesByUserId(userId);

  const isDuplicate = existing.find(addr =>
    addr.addressLine1?.toLowerCase() === addressData.addressLine1?.toLowerCase() &&
    addr.postalCode === addressData.postalCode
  );

  if (isDuplicate) {
    return await addressQueries.updateAddressById(isDuplicate._id, userId, addressData);
  }

  if (existing.length === 0) {
    addressData.isDefault = true;
  } else if (addressData.isDefault) {
    await addressQueries.unsetDefaults(userId);
  }

  return await addressQueries.createAddress({ ...addressData, userId });
};

export const setAsDefault = async (userId, addressId) => {
  if (!userId) throw { statusCode: 401, message: "Unauthorized" };
  if (!addressId) throw { statusCode: 400, message: "Address ID required" };

  await addressQueries.unsetDefaults(userId);
  return await addressQueries.updateAddressById(addressId, userId, { isDefault: true });
};

export const getUserAddresses = async (userId) => {
  if (!userId) throw { statusCode: 401, message: "Unauthorized" };
  return await addressQueries.getAddressesByUserId(userId);
};

export const updateAddress = async (userId, addressId, updateData) => {
  if (!userId) throw { statusCode: 401, message: "Unauthorized" };
  if (!addressId) throw { statusCode: 400, message: "Address ID required" };

  if (updateData.isDefault === true) {
    await addressQueries.unsetDefaults(userId);
  }

  const updatedAddress = await addressQueries.updateAddressById(addressId, userId, updateData);

  if (!updatedAddress) {
    throw { statusCode: 404, message: "Address not found or unauthorized" };
  }

  return updatedAddress;
};