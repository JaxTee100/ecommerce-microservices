"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDAO = void 0;
const client_1 = require("@prisma/client");
// dao/userDAO.ts
const prisma = new client_1.PrismaClient();
class UserDAO {
    async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }
    async findById(id) {
        return prisma.user.findUnique({ where: { id } });
    }
    async findAll() {
        return prisma.user.findMany();
    }
    async create(data) {
        return prisma.user.create({ data });
    }
    async update(id, data) {
        return prisma.user.update({ where: { id }, data });
    }
    async delete(id) {
        return prisma.user.delete({ where: { id } });
    }
}
exports.userDAO = new UserDAO();
