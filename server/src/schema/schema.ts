// src/schema.ts
import { gql } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Définition des types GraphQL (ici un exemple simple)
const typeDefs = gql`
  type Query {
    hello: String!
  }
`;

// Définition des resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

// Création du schéma exécutable
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
