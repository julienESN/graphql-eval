// src/modules/auth.ts
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const createJWT = (user: User): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      // Vous pouvez ajouter d'autres informations, par exemple : name, role, etc.
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );
};

export type AuthenticatedUser = Pick<User, 'id' | 'email'>;

export const getUserFromToken = (token: string): AuthenticatedUser | null => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as AuthenticatedUser;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const comparePasswords = (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string): Promise<string> => {
  // Vous pouvez ajuster le nombre de rounds (ici 10)
  return bcrypt.hash(password, 10);
};
