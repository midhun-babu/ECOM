import Product from "../models/productModel.js";

export const createProduct = async (productData) => {
  return await Product.create(productData);
};

export const getAllProducts = async () => {
  return await Product.find({ is_deleted: false });
};

export const getAllProductsPaginated = async (skip, limit, filters = {}) => {
  const query = { is_deleted: false, ...filters };
  return await Product.find(query)
    .skip(skip)
    .limit(limit);
};

export const getProductsCount = async (filters = {}) => {
  return await Product.countDocuments({ is_deleted: false, ...filters });
};

export const findProductById = async (productId) => {
  return await Product.findOne({ _id: productId, is_deleted: false });
};

export const getProductByPid = async (pid) => {
  return await Product.findOne({ pid, is_deleted: false });
};

export const updateProduct = async (pid, updateData) => {
  return await Product.findOneAndUpdate(
    { pid, is_deleted: false },
    updateData,
    { returnDocument:'after' }
  );
};

export const deleteProduct = async (pid) => {
  return await Product.findOneAndUpdate(
    { pid, is_deleted: false },
    { is_deleted: true },
    { returnDocument:'after' }
  );
};

export const hardDeleteProduct = async (pid) => {
  return await Product.findOneAndDelete({ pid });
};