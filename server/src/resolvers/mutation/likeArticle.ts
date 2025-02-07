import { PrismaClient, Like, User, Article } from '@prisma/client';
import { MutationResolvers } from '../../generated/graphql';

interface LikeArticleArgs {
  articleId: number;
}

export interface LikeResponse {
  code: number;
  success: boolean;
  message: string;
  like: (Like & { user: User; article: Article }) | null;
}

export const likeArticle: MutationResolvers['likeArticle'] = async (
  _,
  { articleId },
  { prisma, user }
): Promise<LikeResponse> => {
  if (!user) {
    return {
      code: 401,
      success: false,
      message: 'Utilisateur non authentifié',
      like: null,
    };
  }
  try {
    // Vérifier que l'article existe
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      return {
        code: 404,
        success: false,
        message: "L'article n'existe pas",
        like: null,
      };
    }
    // Vérifier si le like existe déjà (grâce à la contrainte unique [userId, articleId])
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId,
        },
      },
    });
    if (existingLike) {
      return {
        code: 400,
        success: false,
        message: 'Article déjà liké',
        like: null,
      };
    }
    // Créer le like et inclure les relations
    const like = await prisma.like.create({
      data: {
        articleId,
        userId: user.id,
      },
      include: {
        user: true,
        article: true,
      },
    });
    return {
      code: 200,
      success: true,
      message: 'Article liké avec succès',
      like,
    };
  } catch (error) {
    console.error(error);
    return {
      code: 500,
      success: false,
      message: 'Erreur interne du serveur',
      like: null,
    };
  }
};
