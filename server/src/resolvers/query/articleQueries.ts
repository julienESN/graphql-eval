import { PrismaClient } from '@prisma/client';

export const getArticle = async (
  { id }: { id: number },
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.article.findUnique({
    where: { id },
    include: { author: true, comments: true },
  });
};

export const getArticles = async ({ prisma }: { prisma: PrismaClient }) => {
  return prisma.article.findMany({
    include: { author: true, comments: true },
  });
};
