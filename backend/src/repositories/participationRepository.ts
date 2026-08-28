import { prisma } from '../config/prisma.js';

export const participationRepository = {
  findByMatchAndUser: (matchId: string, userId: string) => {
    return prisma.participation.findUnique({
      where: { matchId_userId: { matchId, userId } },
    });
  },

  create: (matchId: string, userId: string) => {
    return prisma.participation.create({
      data: { matchId, userId, status: 'CONFIRMADA' },
    });
  },

  reactivate: (id: string) => {
    return prisma.participation.update({
      where: { id },
      data: { status: 'CONFIRMADA' },
    });
  },

  cancel: (id: string) => {
    return prisma.participation.update({
      where: { id },
      data: { status: 'CANCELADA' },
    });
  },

  findConfirmedByMatch: (matchId: string) => {
    return prisma.participation.findMany({
      where: { matchId, status: 'CONFIRMADA' },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  },
};
