import React, {useState} from 'react';
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useNavigate} from "react-router";
import {useAuth} from "@/context/AuthContext";

export function SignUpForm({
                               className,
                               ...props
                           }: React.ComponentProps<"div">) {
    const router = useNavigate();
    const {register} = useAuth();

    const [email, setEmail] = useState<string>("");
    const [emailConf, setEmailConf] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConf, setPasswordConf] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null); // Réinitialiser les erreurs

        // Vérifier les champs de confirmation
        if (email !== emailConf) {
            setError("Les emails ne correspondent pas.");
            return;
        }

        if (password !== passwordConf) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await register(email, password, name); // Appel de la fonction register
            router("/"); // Redirection vers la page d'accueil après inscription
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
                                    Créez votre compte
                                </p>
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Votre nom"
                                    required
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="emailConf">Confirmation de l'email</Label>
                                <Input
                                    id="emailConf"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={emailConf}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailConf(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="passwordConf">Confirmation du mot de passe</Label>
                                <Input
                                    id="passwordConf"
                                    type="password"
                                    required
                                    value={passwordConf}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConf(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Créer un compte
                            </Button>

                            <div className="text-center text-sm">
                                Déjà un compte ?{" "}
                                <a
                                    onClick={() => router("/login")}
                                    className="underline underline-offset-4 cursor-pointer"
                                >
                                    Se connecter
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