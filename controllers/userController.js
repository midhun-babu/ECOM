import * as userService from "../services/userService.js";

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, skip } = req.pagination;
    const users = await userService.fetchAllUsers({ page, limit, skip });

    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const user = await userService.editUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.softDeleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
