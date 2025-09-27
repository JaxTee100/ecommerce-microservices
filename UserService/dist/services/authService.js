"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
// services/userService.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userDAO_1 = require("../DAO/userDAO");
const refreshTokenDAO_1 = require("../DAO/refreshTokenDAO");
const JWT_SECRET = process.env.JWT_SECRET || "change-me";
class UserService {
    async register(data) {
        const existing = await userDAO_1.userDAO.findByEmail(data.email);
        if (existing) {
            throw new Error("Email already in use");
        }
        const hashed = await bcrypt_1.default.hash(data.password, 10);
        const user = await userDAO_1.userDAO.create({ ...data, password: hashed });
        return user.id;
    }
    async login(email, password) {
        const user = await userDAO_1.userDAO.findByEmail(email);
        if (!user)
            throw new Error("Invalid credentials");
        const ok = await bcrypt_1.default.compare(password, user.password);
        if (!ok)
            throw new Error("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        return token;
    }
    async refreshToken(token) {
        const storedToken = await refreshTokenDAO_1.refreshTokenDAO.findByToken(token);
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new Error("Invalid or expired token");
        }
        const user = await userDAO_1.userDAO.findById(storedToken.userId);
        if (!user)
            throw new Error("User not found");
        return jsonwebtoken_1.default.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    }
    async logout(refreshToken) {
        await refreshTokenDAO_1.refreshTokenDAO.deleteByToken(refreshToken);
    }
    // CRUD
    async getAllUsers() {
        return userDAO_1.userDAO.findAll();
    }
    async getUserById(id) {
        const user = await userDAO_1.userDAO.findById(id);
        if (!user)
            throw new Error("User not found");
        return user;
    }
    async updateUser(id, data) {
        if (data.password) {
            data.password = await bcrypt_1.default.hash(data.password, 10);
        }
        return userDAO_1.userDAO.update(id, data);
    }
    async deleteUser(id) {
        return userDAO_1.userDAO.delete(id);
    }
}
exports.userService = new UserService();
