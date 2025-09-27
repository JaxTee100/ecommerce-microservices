// services/userService.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userDAO } from "../DAO/userDAO";
import { refreshTokenDAO } from "../DAO/refreshTokenDAO";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

class UserService {
  async register(data: { email: string; password: string; name: string }) {
    const existing = await userDAO.findByEmail(data.email);
    if (existing) {
      throw new Error("Email already in use");
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await userDAO.create({ ...data, password: hashed });

    return user.id;
  }

  async login(email: string, password: string) {
    const user = await userDAO.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid credentials");

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    return token;
  }

  async refreshToken(token: string) {
    const storedToken = await refreshTokenDAO.findByToken(token);
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error("Invalid or expired token");
    }

    const user = await userDAO.findById(storedToken.userId);
    if (!user) throw new Error("User not found");

    return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  }

  async logout(refreshToken: string) {
    await refreshTokenDAO.deleteByToken(refreshToken);
  }

  // CRUD
  async getAllUsers() {
    return userDAO.findAll();
  }

  async getUserById(id: string) {
    const user = await userDAO.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUser(id: string, data: { name?: string; email?: string; password?: string }) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return userDAO.update(id, data);
  }

  async deleteUser(id: string) {
    return userDAO.delete(id);
  }
}

export const userService = new UserService();
