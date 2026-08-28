import { prisma } from '../config/prisma.js';

export const userRepository = {
  findByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  findById: (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  },

  create: (data: { name: string; email: string; passwordHash: string }) => {
    return prisma.user.create({ data });
  },

  findAll: () => {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },
};
