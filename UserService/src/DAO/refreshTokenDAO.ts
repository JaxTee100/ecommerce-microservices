import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class RefreshTokenDAO {
  async findByToken(token: string) {
    return prisma.refresh.findUnique({ where: { token } });
  }

  async deleteByToken(token: string) {
    return prisma.refresh.delete({ where: { token } });
  }
}

export const refreshTokenDAO = new RefreshTokenDAO();
