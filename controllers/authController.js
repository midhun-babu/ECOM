import { createUser } from "../services/userService.js";
import { validatePassword, generateTokens } from "../services/authService.js";
import * as invitationService from "../services/invitationService.js";
import * as UserQueries from "../dbqueries/userQueries.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, uname, email, password, role } = req.body;

    if (!name || !uname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserQueries.findUserByIdentifier(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await createUser({ name, uname, email, password, role });

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        uname: user.uname,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    // res.status(500).json({ message: error.message });
    next(error);
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password required" });
    }

    const user = await UserQueries.findUserForLogin(identifier);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isDeleted) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isMatch = await validatePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Login error: " + error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.refresh_token);

    const user = await UserQueries.getUserById(decoded.id);
    if (!user || user.isDeleted) {
      return res.status(403).json({ message: "Invalid user" });
    }

    const tokens = generateTokens(user);

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout error: " + error.message });
  }
};




export const registerFromInvite = async (req, res, next) => {
  try {
    const { token, name, uname, password } = req.body;

    if (!token || !name || !uname || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const invite = await invitationService.validateInviteToken(token);
    const existingUser = await UserQueries.findUserByIdentifier(invite.email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await createUser({ 
      name, 
      uname, 
      email: invite.email,
      password, 
      role: invite.role
    });

    await invitationService.acceptInvitation(token);

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(201).json({
      message: "Registration successful via invitation",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};