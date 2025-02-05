import React, {useState} from 'react';
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useNavigate} from "react-router";
import {useAuth} from "@/context/AuthContext";

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentProps<"div">) {
  const router = useNavigate();
  const {login} = useAuth(); // Utilisation du contexte AuthContext
  const [email, setEmail] = useState<string>(""); // Typage explicite de l'état
  const [password, setPassword] = useState<string>(""); // Typage explicite de l'état
  const [error, setError] = useState<string | null>(null); // Typage pour les erreurs

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null); // Réinitialiser les erreurs

    try {
      await login(email, password); // Appel de la fonction login
      router("/"); // Redirection vers la page d'accueil après connexion
    } catch (err) {
      // Vérification stricte du type de l'erreur
      if (err instanceof Error) {
        setError(err.message); // Récupération du message d'erreur
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenue</h1>
                <p className="text-balance text-muted-foreground">
                  Connectez-vous à votre compte
                </p>
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} // Typage de l'événement
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} // Typage de l'événement
                />
              </div>
              <Button type="submit" className="w-full">
                Connexion
              </Button>

              <div className="text-center text-sm">
                Pas de compte ?{" "}
                <a
                  onClick={() => {
                    router("/signup");
                  }}
                  className="underline underline-offset-4 cursor-pointer"
                >
                  S'inscrire
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/ryoji-iwata-IBaVuZsJJTo-unsplash.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}