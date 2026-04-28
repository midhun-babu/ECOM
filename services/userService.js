import User from "../models/userModel.js";
import * as UserQueries from "../dbqueries/userQueries.js";
import bcrypt from "bcrypt";

// CREATE USER
export const createUser = async ({ name, uname, email, password, role }) => {
  if (!name || !uname || !email || !password) {
    throw new Error("All required fields must be provided");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return await User.create({
    name,
    uname,
    email,
    password: hashedPassword,
    role: role || "user",
  });
};

// GET USER BY ID
export const getUserById = async (id) => {
  if (!id) throw new Error("User ID is required");

  const user = await UserQueries.getUserById(id);

  if (!user) throw new Error("User not found");

  return user;
};

// GET ALL USERS
export const fetchAllUsers = async ({ limit, skip }) => {
  return await UserQueries.getAllUsers(limit, skip);
};


// EDIT USER
export const editUser = async (id, updateData) => {
  if (!id) throw new Error("User ID is required");

  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }
  const updatedUser = await UserQueries.updateUser(id, updateData);

  if (!updatedUser) throw new Error("User not found");

  return updatedUser;
};

//DELETE USER 
export const softDeleteUser = async (id) => {
  if (!id) throw new Error("User ID is required");

  const user = await UserQueries.getUserById(id);
  if (!user) throw new Error("User not found");


  if (user.role === "admin") {
    const adminCount = await User.countDocuments({
      role: "admin",
      isDeleted: false,
    });

    if (adminCount <= 1) {
      throw new Error("Cannot delete the last admin");
    }
  }

  const deletedUser = await UserQueries.deleteUser(id);

  if (!deletedUser) throw new Error("User not found");

  return deletedUser;
};