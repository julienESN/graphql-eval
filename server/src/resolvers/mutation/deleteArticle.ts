import { PrismaClient, Article } from '@prisma/client';

interface DeleteArticleArgs {
  id: number;
}

interface ArticleResponse {
  code: number;
  success: boolean;
  message: string;
  article: Article | null;
}

export const deleteArticle = async (
  _: unknown,
  { id }: DeleteArticleArgs,
  { prisma, user }: { prisma: PrismaClient; user: { id: number } | null }
): Promise<ArticleResponse> => {
  if (!user) {
    return {
      code: 401,
      success: false,
      message: 'Utilisateur non authentifié',
      article: null,
    };
  }
  try {
    const existingArticle = await prisma.article.findUnique({ where: { id } });
    if (!existingArticle) {
      return {
        code: 404,
        success: false,
        message: "L'article n'existe pas",
        article: null,
      };
    }
    if (existingArticle.authorId !== user.id) {
      return {
        code: 403,
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer cet article",
        article: null,
      };
    }
    const article = await prisma.article.delete({ where: { id } });
    return {
      code: 200,
      success: true,
      message: 'Article supprimé avec succès',
      article,
    };
  } catch (error) {
    console.error(error);
    return {
      code: 500,
      success: false,
      message: 'Erreur interne du serveur',
      article: null,
    };
  }
};
