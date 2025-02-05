import { PrismaClient, Article } from '@prisma/client';

interface UpdateArticleArgs {
  id: number;
  title?: string;
  content?: string;
}

interface ArticleResponse {
  code: number;
  success: boolean;
  message: string;
  article: Article | null;
}

export const updateArticle = async (
  _: unknown,
  { id, title, content }: UpdateArticleArgs,
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
        message: "Vous n'êtes pas autorisé à modifier cet article",
        article: null,
      };
    }
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: title || undefined,
        content: content || undefined,
      },
    });
    return {
      code: 200,
      success: true,
      message: 'Article mis à jour avec succès',
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
