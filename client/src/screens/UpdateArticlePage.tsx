import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useArticle } from "@/context/ArticleContext";

export default function UpdateArticlePage({ className, ...props }: React.ComponentProps<"div">) {
    const { id } = useParams<{ id: string }>();
    const router = useNavigate();

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const { getArticle, updateArticle } = useArticle();

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;

            try {
                const article = await getArticle(parseInt(id));
                if (article) {
                    setTitle(article.title);
                    setContent(article.content);
                }
            } catch (err) {
                setError("Erreur lors de la récupération de l'article.");
            }
        };

        fetchArticle();
    }, [id, getArticle]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!title.trim() || !content.trim()) {
            setError("Le titre et le contenu sont obligatoires.");
            return;
        }

        try {
            await updateArticle(parseInt(id!), title, content);
            setSuccess(true);
            router("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur inconnue s'est produite.");
        }
    };

    return (
        <div className={cn("flex flex-col items-center justify-center min-h-screen py-6 bg-gray-100", className)} {...props}>
            <Card className="w-full max-w-lg p-6 md:p-8 bg-white shadow-md rounded-md">
                <h1 className="text-2xl font-bold text-center mb-4">Modifier un article</h1>
                <Separator className="my-4" />
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                {success && <div className="text-green-500 text-sm text-center">Article mis à jour avec succès !</div>}

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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

                    <Button type="submit" className="w-full" disabled={!title.trim() || !content.trim()}>
                        Mettre à jour
                    </Button>
                </form>
            </Card>
        </div>
    );
}