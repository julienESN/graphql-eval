import { PrismaClient } from '@prisma/client';

export const getArticle = async (
  _: unknown,
  { id }: { id: number },
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.article.findUnique({
    where: { id },
    include: { author: true, comments: true },
  });
};

export const getArticles = async (
  _: unknown,
  __: unknown,
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.article.findMany({
    include: { author: true, comments: true },
  });
};
