import { PrismaClient } from '@prisma/client';

export const getComment = async (
  _: {},
  { id }: { id: number },
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.comment.findUnique({
    where: { id },
    include: { author: true, article: true },
  });
};

export const getComments = async (
  _: {},
  __: {},
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.comment.findMany({
    include: { author: true, article: true },
  });
};

export const getCommentsByArticle = async (
  _: {},
  { articleId }: { articleId: number },
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.comment.findMany({
    where: { articleId },
    include: { author: true, article: true },
  });
};
