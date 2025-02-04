import { gql } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { signIn } from '../resolvers/mutation/signIn';
import { signUp } from '../resolvers/mutation/signUp'; // On l'importera après

const typeDefs = gql`
  type Query {
    hello: String!
  }

  type Mutation {
    signIn(email: String!, password: String!): SignInResponse!
    signUp(email: String!, password: String!, name: String!): SignUpResponse!
  }

  type SignInResponse {
    code: Int!
    success: Boolean!
    message: String!
    token: String
  }

  type SignUpResponse {
    code: Int!
    success: Boolean!
    message: String!
    token: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
  Mutation: {
    signIn,
    signUp, // Ajout du resolver pour signUp
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
