// src/schema.ts
import { gql } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { signIn } from '../resolvers/mutation/signIn';
import { signUp } from '../resolvers/mutation/signUp';
import { updateUser } from '../resolvers/mutation/updateUser';
import { deleteUser } from '../resolvers/mutation/deleteUser';
import { me, getUser, getUsers } from '../resolvers/query/userQueries';

const typeDefs = gql`
  type Query {
    hello: String!
    me: User
    user(id: Int!): User
    users: [User!]!
  }

  type Mutation {
    signIn(email: String!, password: String!): SignInResponse!
    signUp(email: String!, password: String!, name: String!): SignUpResponse!
    updateUser(email: String, name: String): UserResponse!
    deleteUser: UserResponse!
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

  type UserResponse {
    code: Int!
    success: Boolean!
    message: String!
    user: User
  }

  type User {
    id: Int!
    email: String!
    name: String!
    # Vous pouvez ajouter ici d'autres champs, par exemple articles, commentaires, etc.
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    me,
    user: getUser,
    users: getUsers,
  },
  Mutation: {
    signIn,
    signUp,
    updateUser,
    deleteUser,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
