import { PrismaClient } from "@prisma/client";

// dao/userDAO.ts
const prisma = new PrismaClient();

class UserDAO {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.user.findMany();
  }

  async create(data: { email: string; password: string; name: string }) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Partial<{ email: string; password: string; name: string }>) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export const userDAO = new UserDAO();
