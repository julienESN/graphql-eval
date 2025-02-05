import React, {useState, useEffect} from 'react';
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
    const [passwordStrength, setPasswordStrength] = useState<{
        hasMinLength: boolean;
        hasUpperCase: boolean;
        hasLowerCase: boolean;
        hasNumber: boolean;
        hasSpecialChar: boolean;
    }>({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });
    const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);

    // Ajout des états de validation
    const [validations, setValidations] = useState<{
        email: {
            isValid: boolean;
            message: string;
        };
        emailFormat: {
            isValid: boolean;
            message: string;
        };
    }>({
        email: {
            isValid: true,
            message: "",
        },
        emailFormat: {
            isValid: true,
            message: "",
        },
    });

    // Fonction pour vérifier la force du mot de passe
    const checkPasswordStrength = (password: string) => {
        setPasswordStrength({
            hasMinLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    // Mise à jour de la vérification à chaque changement du mot de passe
    useEffect(() => {
        checkPasswordStrength(password);
    }, [password]);

    // Validation du format de l'email
    const validateEmailFormat = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailRegex.test(email);
        setValidations(prev => ({
            ...prev,
            emailFormat: {
                isValid,
                message: isValid ? "" : "Format d'email invalide"
            }
        }));
        return isValid;
    };

    // Gestionnaires d'événements pour les champs
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        validateEmailFormat(newEmail);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);

        // Vérifier que toutes les conditions du mot de passe sont remplies
        const isPasswordValid = Object.values(passwordStrength).every(value => value);
        if (!isPasswordValid) {
            setError("Le mot de passe ne respecte pas les critères de sécurité.");
            return;
        }

        // Vérifier la correspondance des emails
        if (email !== emailConf) {
            setError("Les emails ne correspondent pas.");
            return;
        }

        // Vérifier la correspondance des mots de passe
        if (password !== passwordConf) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await register(email, password, name);
            router("/");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Une erreur inconnue s'est produite.");
            }
        }
    };

    // Fonction pour vérifier si le formulaire est valide
    const isFormValid = (): boolean => {
        const isPasswordValid = Object.values(passwordStrength).every(value => value);
        return (
            name.trim() !== "" &&
            email !== "" &&
            emailConf !== "" &&
            password !== "" &&
            passwordConf !== "" &&
            email === emailConf &&
            password === passwordConf &&
            isPasswordValid &&
            validations.emailFormat.isValid
        );
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
                                    onChange={(e) => setName(e.target.value)}
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
                                    onChange={handleEmailChange}
                                    className={!validations.emailFormat.isValid ? "border-red-500" : ""}
                                />
                                {!validations.emailFormat.isValid && (
                                    <p className="text-red-500 text-sm">{validations.emailFormat.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="emailConf">Confirmation de l'email</Label>
                                <Input
                                    id="emailConf"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={emailConf}
                                    onChange={(e) => setEmailConf(e.target.value)}
                                    className={email !== emailConf && emailConf ? "border-red-500" : ""}
                                />
                                {email !== emailConf && emailConf && (
                                    <p className="text-red-500 text-sm">Les emails ne correspondent pas</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                />
                                {(isPasswordFocused || password) && (
                                    <div className="text-sm space-y-1 mt-2">
                                        <p className="font-semibold text-muted-foreground">Le mot de passe doit contenir :</p>
                                        <ul className="space-y-1">
                                            <li className={`flex items-center gap-2 ${passwordStrength.hasMinLength ? 'text-green-500' : 'text-red-500'}`}>
                                                {passwordStrength.hasMinLength ? '✓' : '×'} Au moins 8 caractères
                                            </li>
                                            <li className={`flex items-center gap-2 ${passwordStrength.hasUpperCase ? 'text-green-500' : 'text-red-500'}`}>
                                                {passwordStrength.hasUpperCase ? '✓' : '×'} Une majuscule
                                            </li>
                                            <li className={`flex items-center gap-2 ${passwordStrength.hasLowerCase ? 'text-green-500' : 'text-red-500'}`}>
                                                {passwordStrength.hasLowerCase ? '✓' : '×'} Une minuscule
                                            </li>
                                            <li className={`flex items-center gap-2 ${passwordStrength.hasNumber ? 'text-green-500' : 'text-red-500'}`}>
                                                {passwordStrength.hasNumber ? '✓' : '×'} Un chiffre
                                            </li>
                                            <li className={`flex items-center gap-2 ${passwordStrength.hasSpecialChar ? 'text-green-500' : 'text-red-500'}`}>
                                                {passwordStrength.hasSpecialChar ? '✓' : '×'} Un caractère spécial
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="passwordConf">Confirmation du mot de passe</Label>
                                <Input
                                    id="passwordConf"
                                    type="password"
                                    required
                                    value={passwordConf}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConf(e.target.value)}
                                    className={password !== passwordConf && passwordConf ? "border-red-500" : ""}
                                />
                                {password !== passwordConf && passwordConf && (
                                    <p className="text-red-500 text-sm">Les mots de passe ne correspondent pas</p>
                                )}
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={!isFormValid()}
                                style={{ opacity: isFormValid() ? 1 : 0.5 }}
                            >
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