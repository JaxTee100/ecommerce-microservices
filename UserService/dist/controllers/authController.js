"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refreshToken = refreshToken;
exports.logoutUser = logoutUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const authService_1 = require("../services/authService");
const validation_1 = require("../utils/validation");
const logger_1 = require("../utils/logger");
async function register(req, res) {
    try {
        const { error } = (0, validation_1.validateRegistration)(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message });
        const userId = await authService_1.userService.register(req.body);
        res.status(201).json({ success: true, message: "User registered successfully", user: userId });
    }
    catch (err) {
        logger_1.logger.error("Registration error", err);
        res.status(400).json({ success: false, message: err.message });
    }
}
async function login(req, res) {
    try {
        const { error } = (0, validation_1.validateLogin)(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message });
        const token = await authService_1.userService.login(req.body.email, req.body.password);
        res.status(200).json({ success: true, message: "Login successful", token });
    }
    catch (err) {
        logger_1.logger.warn("Login failed", err.message);
        res.status(401).json({ success: false, message: err.message });
    }
}
async function refreshToken(req, res) {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(400).json({ success: false, message: "Token is required" });
        const newToken = await authService_1.userService.refreshToken(token);
        res.status(200).json({ success: true, message: "Token refreshed successfully", token: newToken });
    }
    catch (err) {
        logger_1.logger.error("Error refreshing token", err);
        res.status(401).json({ success: false, message: err.message });
    }
}
async function logoutUser(req, res) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(400).json({ success: false, message: "refresh token missing" });
        await authService_1.userService.logout(refreshToken);
        res.status(200).json({ success: true, message: "User logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
// CRUD Controllers
async function getAllUsers(req, res) {
    try {
        const users = await authService_1.userService.getAllUsers();
        res.status(200).json({ success: true, users });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
async function getUserById(req, res) {
    try {
        const user = await authService_1.userService.getUserById(req.params.id);
        res.status(200).json({ success: true, user });
    }
    catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
}
async function updateUser(req, res) {
    try {
        const user = await authService_1.userService.updateUser(req.params.id, req.body);
        res.status(200).json({ success: true, message: "User updated successfully", user });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}
async function deleteUser(req, res) {
    try {
        await authService_1.userService.deleteUser(req.params.id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}
