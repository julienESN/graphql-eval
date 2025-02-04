// src/utils/auth.ts

/**
 * Fonction qui décode le token et retourne un utilisateur fictif.
 * Remplacez cette logique par la vérification réelle de votre token.
 */
export function getUserFromToken(token: string) {
  // Si aucun token n'est fourni, retourner null
  if (!token) {
    return null;
  }
  // Pour l'instant, on retourne un utilisateur statique (exemple)
  return { id: 1, name: 'Utilisateur Test', email: 'test@example.com' };
}
