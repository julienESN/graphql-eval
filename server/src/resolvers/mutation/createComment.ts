import { PrismaClient, Comment, User, Article } from '@prisma/client';

interface CreateCommentArgs {
  articleId: number;
  content: string;
}

interface CommentResponse {
  code: number;
  success: boolean;
  message: string;
  // On indique que le commentaire contient les relations "author" et "article"
  comment: (Comment & { author: User; article: Article }) | null;
}

export const createComment = async (
  _: {},
  { articleId, content }: CreateCommentArgs,
  { prisma, user }: { prisma: PrismaClient; user: { id: number } | null }
): Promise<CommentResponse> => {
  if (!user) {
    return {
      code: 401,
      success: false,
      message: 'Utilisateur non authentifié',
      comment: null,
    };
  }
  try {
    // Vérifier que l'article existe
    const articleExists = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!articleExists) {
      return {
        code: 404,
        success: false,
        message: "L'article n'existe pas",
        comment: null,
      };
    }
    // Créer le commentaire et inclure les relations "author" et "article"
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        authorId: user.id,
      },
      include: {
        author: true,
        article: true,
      },
    });
    return {
      code: 200,
      success: true,
      message: 'Commentaire créé avec succès',
      comment,
    };
  } catch (error) {
    console.error(error);
    return {
      code: 500,
      success: false,
      message: 'Erreur interne du serveur',
      comment: null,
    };
  }
};
