import { PrismaClient, Article, User } from '@prisma/client';

interface CreateArticleArgs {
  title: string;
  content: string;
}

interface ArticleResponse {
  code: number;
  success: boolean;
  message: string;
  article: (Article & { author: User }) | null;
}

export const createArticle = async (
  { title, content }: CreateArticleArgs,
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
    const article = await prisma.article.create({
      data: {
        title,
        content,
        authorId: user.id,
      },
      include: {
        author: true, // Cette option permet de récupérer l'utilisateur associé à l'article
      },
    });
    return {
      code: 200,
      success: true,
      message: 'Article créé avec succès',
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
