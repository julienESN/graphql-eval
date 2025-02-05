import { PrismaClient, Like, User, Article } from '@prisma/client';

interface UnlikeArticleArgs {
  articleId: number;
}

export interface LikeResponse {
  code: number;
  success: boolean;
  message: string;
  like: (Like & { user: User; article: Article }) | null;
}

export const unlikeArticle = async (
  _: unknown,
  { articleId }: UnlikeArticleArgs,
  { prisma, user }: { prisma: PrismaClient; user: { id: number } | null }
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
    // Rechercher le like existant pour cet utilisateur et cet article
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId,
        },
      },
    });
    if (!existingLike) {
      return {
        code: 404,
        success: false,
        message: "Vous n'avez pas liké cet article",
        like: null,
      };
    }
    // Supprimer le like et retourner les données supprimées avec les relations
    const deletedLike = await prisma.like.delete({
      where: { id: existingLike.id },
      include: { user: true, article: true },
    });
    return {
      code: 200,
      success: true,
      message: 'Like retiré avec succès',
      like: deletedLike,
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
