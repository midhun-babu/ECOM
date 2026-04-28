import * as productService from "../services/productService.js";

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.addProduct(req.body);
    res.status(201).json({ success: true, message: "Product Added", product });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { page, limit } = req.pagination;
    const { search, minPrice, maxPrice } = req.query;

    const result = await productService.fetchAllProducts({ page, limit, search, minPrice, maxPrice });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.fetchProductByPid(req.params.pid);
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.removeProduct(req.params.pid);
    if (!product) {
      throw { statusCode: 404, message: "Product not found" };
    }
    res.status(200).json({ success: true, message: "Product soft-deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const product = await productService.editProduct(req.params.pid, req.body);
    if (!product) {
      throw { statusCode: 404, message: "Product not found" };
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};
