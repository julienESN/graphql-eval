import { PrismaClient, Like } from '@prisma/client';
import { gql } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { signIn } from '../resolvers/mutation/signIn';
import { signUp } from '../resolvers/mutation/signUp';
import { updateUser } from '../resolvers/mutation/updateUser';
import { deleteUser } from '../resolvers/mutation/deleteUser';
import { me, getUser, getUsers } from '../resolvers/query/userQueries';
import { getArticle, getArticles } from '../resolvers/query/articleQueries';
import {
  getComment,
  getComments,
  getCommentsByArticle,
} from '../resolvers/query/commentQueries';
import { createArticle } from '../resolvers/mutation/createArticle';
import { updateArticle } from '../resolvers/mutation/updateArticle';
import { deleteArticle } from '../resolvers/mutation/deleteArticle';
import { createComment } from '../resolvers/mutation/createComment';
import { updateComment } from '../resolvers/mutation/updateComment';
import { deleteComment } from '../resolvers/mutation/deleteComment';

// Import des nouvelles mutations pour les likes
import { likeArticle } from '../resolvers/mutation/likeArticle';
import { unlikeArticle } from '../resolvers/mutation/unlikeArticle';

const typeDefs = gql`
  scalar DateTime

  type Query {
    hello: String!
    me: User
    user(id: Int!): User
    users: [User!]!

    # Queries pour les articles
    article(id: Int!): Article
    articles: [Article!]!

    # Queries pour les commentaires
    comment(id: Int!): Comment
    comments: [Comment!]!
    commentsByArticle(articleId: Int!): [Comment!]!
  }

  type Mutation {
    signIn(email: String!, password: String!): SignInResponse!
    signUp(email: String!, password: String!, name: String!): SignUpResponse!
    updateUser(email: String, name: String): UserResponse!
    deleteUser: UserResponse!

    # Mutations pour les articles
    createArticle(title: String!, content: String!): ArticleResponse!
    updateArticle(id: Int!, title: String, content: String): ArticleResponse!
    deleteArticle(id: Int!): ArticleResponse!

    # Mutations pour les commentaires
    createComment(articleId: Int!, content: String!): CommentResponse!
    updateComment(id: Int!, content: String!): CommentResponse!
    deleteComment(id: Int!): CommentResponse!

    # Mutations pour les likes sur les articles
    likeArticle(articleId: Int!): LikeResponse!
    unlikeArticle(articleId: Int!): LikeResponse!
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

  type ArticleResponse {
    code: Int!
    success: Boolean!
    message: String!
    article: Article
  }

  type CommentResponse {
    code: Int!
    success: Boolean!
    message: String!
    comment: Comment
  }

  type LikeResponse {
    code: Int!
    success: Boolean!
    message: String!
    like: Like
  }

  type User {
    id: Int!
    email: String!
    name: String!
    articles: [Article!]!
    comments: [Comment!]!
  }

  type Article {
    id: Int!
    title: String!
    content: String!
    createdAt: DateTime!
    author: User!
    comments: [Comment!]!
    likes: [Like!]!
  }

  type Comment {
    id: Int!
    content: String!
    createdAt: DateTime!
    author: User!
    article: Article!
  }

  type Like {
    id: Int!
    user: User!
    article: Article!
  }
`;

// Définissez un type pour l'objet parent du resolver Article
interface ArticleParent {
  id: number;
}

// Définissez un type pour le contexte
interface Context {
  prisma: PrismaClient;
  // Ajoutez d'autres propriétés de contexte si nécessaire (par exemple, user)
}

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    me,
    user: getUser,
    users: getUsers,
    article: getArticle,
    articles: getArticles,
    comment: getComment,
    comments: getComments,
    commentsByArticle: getCommentsByArticle,
  },
  Mutation: {
    signIn,
    signUp,
    updateUser,
    deleteUser,
    createArticle,
    updateArticle,
    deleteArticle,
    createComment,
    updateComment,
    deleteComment,
    likeArticle,
    unlikeArticle,
  },
  Article: {
    likes: async (
      parent: ArticleParent,
      _args: {},
      { prisma }: { prisma: PrismaClient }
    ): Promise<Like[]> => {
      return prisma.like.findMany({
        where: { articleId: parent.id },
        include: { user: true, article: true },
      });
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
