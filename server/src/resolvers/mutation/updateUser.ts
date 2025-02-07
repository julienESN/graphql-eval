import { PrismaClient, User } from '@prisma/client';

interface UpdateUserArgs {
  email?: string;
  name?: string;
}

interface UserResponse {
  code: number;
  success: boolean;
  message: string;
  user: User | null;
}

export const updateUser = async (
  _: {},
  { email, name }: UpdateUserArgs,
  { prisma, user }: { prisma: PrismaClient; user: { id: number } | null }
): Promise<UserResponse> => {
  if (!user) {
    return {
      code: 401,
      success: false,
      message: 'Not authenticated',
      user: null,
    };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: email || undefined,
        name: name || undefined,
      },
    });
    return {
      code: 200,
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
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
