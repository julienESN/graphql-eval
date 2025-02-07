// src/resolvers/mutation/signIn.ts
import { comparePasswords, createJWT } from '../../modules/auth';
import { PrismaClient, User } from '@prisma/client';

interface SignInArgs {
  email: string;
  password: string;
}

interface SignInResponse {
  code: number;
  success: boolean;
  message: string;
  token: string | null;
}

// Note : le contexte de notre Apollo Server doit inclure l'instance Prisma, par exemple : { prisma: PrismaClient }
export const signIn = async (
  { email, password }: SignInArgs,
  { prisma }: { prisma: PrismaClient }
): Promise<SignInResponse> => {
  try {
    // Recherche de l'utilisateur par email
    const user: User | null = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return {
        code: 404,
        success: false,
        message: 'User not found',
        token: null,
      };
    }

    // Comparaison du mot de passe fourni avec le hash stocké
    const valid = await comparePasswords(password, user.password);
    if (!valid) {
      return {
        code: 401,
        success: false,
        message: 'Invalid password',
        token: null,
      };
    }

    // Création du token JWT
    const token = createJWT(user);
    return {
      code: 200,
      success: true,
      message: 'User is signed in',
      token,
    };
  } catch (error) {
    console.error(error);
    return {
      code: 500,
      success: false,
      message: 'Internal server error',
      token: null,
    };
  }
};
