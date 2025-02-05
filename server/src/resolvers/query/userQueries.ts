import { PrismaClient } from '@prisma/client';
import { AuthenticatedUser } from '../../modules/auth';

// Récupere l'user identfié par le token
export const me = async (
  _: unknown,
  __: unknown,
  { prisma, user }: { prisma: PrismaClient; user: AuthenticatedUser | null }
) => {
  if (!user) {
    // L'utilisateur n'est pas authentifié
    return null;
  }
  return prisma.user.findUnique({
    where: { id: user.id },
  });
};
// Récupure l'user identifié par son id
export const getUser = async (
  _: unknown,
  { id }: { id: number },
  { prisma }: { prisma: PrismaClient }
) => {
  const foundUser = await prisma.user.findUnique({ where: { id } });
  if (!foundUser) {
    throw new Error('User not found');
  }
  return foundUser;
};

// Récupère tous les users
export const getUsers = async (
  _: unknown,
  __: unknown,
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.user.findMany();
};
