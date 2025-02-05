import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useArticle } from "@/context/ArticleContext";

export default function CreateArticlePage({ className, ...props }: React.ComponentProps<"div">) {
    const router = useNavigate();

    // États pour stocker les données du formulaire
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    // Utiliser le contexte ArticleContext
    const { createArticle } = useArticle();

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Vérification des champs obligatoires
        if (!title.trim() || !content.trim()) {
            setError("Le titre et le contenu sont obligatoires.");
            return;
        }

        try {
            // Envoi des données au serveur via le contexte
            await createArticle(title, content);
            setSuccess(true);
            setTitle("");
            setContent("");
            router("/"); // Redirection après succès
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur inconnue s'est produite.");
        }
    };

    return (
        <div className={cn("flex flex-col items-center justify-center min-h-screen py-6 bg-gray-100", className)} {...props}>
            <Card className="w-full max-w-lg p-6 md:p-8 bg-white shadow-md rounded-md">
                <h1 className="text-2xl font-bold text-center mb-4">Créer un article</h1>
                <Separator className="my-4" />
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                {success && <div className="text-green-500 text-sm text-center">Article publié avec succès !</div>}

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {/* Champ pour le titre de l'article */}
                    <div className="grid gap-2">
                        <Label htmlFor="title">Titre</Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="Titre de l'article"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={title.trim() === "" ? "border-red-500" : ""}
                        />
                    </div>

                    {/* Champ pour le contenu de l'article */}
                    <div className="grid gap-2">
                        <Label htmlFor="content">Contenu</Label>
                        <Input
                            id="content"
                            type="text"
                            placeholder="Écrivez le contenu de votre article..."
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={content.trim() === "" ? "border-red-500" : ""}
                        />
                    </div>

                    {/* Bouton de soumission */}
                    <Button type="submit" className="w-full" disabled={!title.trim() || !content.trim()}>
                        Publier
                    </Button>
                </form>
            </Card>
        </div>
    );
}