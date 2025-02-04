// src/index.ts
import { ApolloServer } from 'apollo-server';
import { schema } from './schema/schema'; // À créer : votre schéma GraphQL (typeDefs et resolvers)
import { getUserFromToken } from './utils/auth'; // Exemple de fonction pour décoder le token
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    // Récupération du token dans les headers d'authorization
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    return { prisma, user };
  },
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
