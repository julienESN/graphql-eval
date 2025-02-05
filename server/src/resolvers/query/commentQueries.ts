// src/resolvers/query/commentQueries.ts
import { PrismaClient } from '@prisma/client';

export const getComment = async (
  _: unknown,
  { id }: { id: number },
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.comment.findUnique({
    where: { id },
    include: { author: true, article: true },
  });
};

export const getComments = async (
  _: unknown,
  __: unknown,
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.comment.findMany({
    include: { author: true, article: true },
  });
};

export const getCommentsByArticle = async (
  _: unknown,
  { articleId }: { articleId: number },
  { prisma }: { prisma: PrismaClient }
) => {
  return prisma.comment.findMany({
    where: { articleId },
    include: { author: true, article: true },
  });
};
