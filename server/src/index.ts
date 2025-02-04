// src/index.ts (extrait)
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import { schema } from './schema/schema';
import { getUserFromToken } from './modules/auth';

const prisma = new PrismaClient();

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    return { prisma, user };
  },
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
