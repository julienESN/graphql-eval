import { PrismaClient, Comment } from '@prisma/client';

interface UpdateCommentArgs {
  id: number;
  content: string;
}

interface CommentResponse {
  code: number;
  success: boolean;
  message: string;
  comment: Comment | null;
}

export const updateComment = async (
  _: {},
  { id, content }: UpdateCommentArgs,
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
    const existingComment = await prisma.comment.findUnique({ where: { id } });
    if (!existingComment) {
      return {
        code: 404,
        success: false,
        message: "Le commentaire n'existe pas",
        comment: null,
      };
    }
    if (existingComment.authorId !== user.id) {
      return {
        code: 403,
        success: false,
        message: "Vous n'êtes pas autorisé à modifier ce commentaire",
        comment: null,
      };
    }
    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
    });
    return {
      code: 200,
      success: true,
      message: 'Commentaire mis à jour avec succès',
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
