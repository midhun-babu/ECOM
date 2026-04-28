import * as productQueries from "../dbqueries/productQueries.js";
import * as stockQueries from "../dbqueries/stockQueries.js";

export const addProduct = async (productData) => {
  const existing = await productQueries.getProductByPid(productData.pid);

  if (existing) {
    throw { statusCode: 400, message: "Product with this PID already exists" };
  }

  if (productData.price < 1) {
    throw { statusCode: 400, message: "Minimum price should be 1" };
  }

  const product = await productQueries.createProduct(productData);

  // Auto-create stock
  await stockQueries.createStock({
    pid: product._id,
    available_products: productData.initialStock || 0,
    lowStockThreshold: productData.lowStockThreshold || 10
  });

  return product;
};

export const fetchAllProducts = async ({ page, limit, search, minPrice, maxPrice }) => {
  const skip = (page - 1) * limit;

  const filters = {};
  if (search) {
    filters.$or = [
      { pname: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }
  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }

  const products = await productQueries.getAllProductsPaginated(skip, limit, filters);
  const total = await productQueries.getProductsCount(filters);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    products,
  };
};

export const fetchProductByPid = async (pid) => {
  const product = await productQueries.getProductByPid(pid);
  if (!product) throw new Error("Product not found");
  return product;
};

export const editProduct = async (pid, updateData) => {
  return await productQueries.updateProduct(pid, updateData);
};

export const removeProduct = async (pid) => {
  return await productQueries.deleteProduct(pid);
};