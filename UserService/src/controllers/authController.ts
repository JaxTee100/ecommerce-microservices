// controllers/userController.ts
import { Request, Response } from "express";
import { userService } from "../services/authService";
import { validateLogin, validateRegistration } from "../utils/validation";
import { logger } from "../utils/logger";

export async function register(req: Request, res: Response) {
  try {
    const { error } = validateRegistration(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const userId = await userService.register(req.body);
    res.status(201).json({ success: true, message: "User registered successfully", user: userId });
  } catch (err: any) {
    logger.error("Registration error", err);
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const token = await userService.login(req.body.email, req.body.password);
    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (err: any) {
    logger.warn("Login failed", err.message);
    res.status(401).json({ success: false, message: err.message });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "Token is required" });

    const newToken = await userService.refreshToken(token);
    res.status(200).json({ success: true, message: "Token refreshed successfully", token: newToken });
  } catch (err: any) {
    logger.error("Error refreshing token", err);
    res.status(401).json({ success: false, message: err.message });
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: "refresh token missing" });

    await userService.logout(refreshToken);
    res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// CRUD Controllers
export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, user });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ success: true, message: "User updated successfully", user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
}
