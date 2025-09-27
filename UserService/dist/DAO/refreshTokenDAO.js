"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenDAO = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RefreshTokenDAO {
    async findByToken(token) {
        return prisma.refresh.findUnique({ where: { token } });
    }
    async deleteByToken(token) {
        return prisma.refresh.delete({ where: { token } });
    }
}
exports.refreshTokenDAO = new RefreshTokenDAO();
