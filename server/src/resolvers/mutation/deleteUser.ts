// src/resolvers/mutation/deleteUser.ts
import { PrismaClient, User } from '@prisma/client';

interface UserResponse {
  code: number;
  success: boolean;
  message: string;
  user: User | null;
}

export const deleteUser = async ({
  prisma,
  user,
}: {
  prisma: PrismaClient;
  user: { id: number } | null;
}): Promise<UserResponse> => {
  if (!user) {
    return {
      code: 401,
      success: false,
      message: 'Not authenticated',
      user: null,
    };
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: user.id },
    });
    return {
      code: 200,
      success: true,
      message: 'User deleted successfully',
      user: deletedUser,
    };
  } catch (error) {
    console.error(error);
    return {
      code: 500,
      success: false,
      message: 'Internal server error',
      user: null,
    };
  }
};
