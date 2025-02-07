import { PrismaClient } from '@prisma/client';

export const getComment = async (
  { id }: { id: number },
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.comment.findUnique({
    where: { id },
    include: { author: true, article: true },
  });
};

export const getComments = async ({ prisma }: { prisma: PrismaClient }) => {
  return prisma.comment.findMany({
    include: { author: true, article: true },
  });
};

export const getCommentsByArticle = async (
  { articleId }: { articleId: number },
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.comment.findMany({
    where: { articleId },
    include: { author: true, article: true },
  });
};
