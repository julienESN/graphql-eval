// src/resolvers/mutation/signUp.ts
import { hashPassword, createJWT } from '../../modules/auth';
import { PrismaClient, User } from '@prisma/client';

interface SignUpArgs {
  email: string;
  password: string;
  name: string;
}

interface SignUpResponse {
  code: number;
  success: boolean;
  message: string;
  token: string | null;
}

// Le contexte doit contenir Prisma (ex: { prisma: PrismaClient })
export const signUp = async (
  _: {},
  { email, password, name }: SignUpArgs,
  { prisma }: { prisma: PrismaClient }
): Promise<SignUpResponse> => {
  try {
    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser: User | null = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        code: 400,
        success: false,
        message: 'User already exists',
        token: null,
      };
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer le nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Générer le token JWT pour le nouvel utilisateur
    const token = createJWT(newUser);

    return {
      code: 200,
      success: true,
      message: 'User successfully registered',
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
