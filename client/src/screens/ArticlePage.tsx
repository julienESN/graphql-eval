import {useParams} from 'react-router';
import {useEffect, useState} from 'react';
import {useArticle} from '../context/ArticleContext';
import {useComment} from '../context/CommentContext';
import {GetArticleQuery, GetCommentsByArticleQuery, MeQuery, MeQueryVariables} from '../generated/graphql';
import {gql, useQuery} from "@apollo/client";
import Article from "@/components/Article";
import {Button} from "@/components/ui/button.tsx";
import Commentary from "@/components/Commentary.tsx";
import {Input} from "@/components/ui/input.tsx";

interface ArticlePageParams {
    id: string;
}

// Définir la requête GraphQL pour récupérer les données de l'utilisateur connecté
const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
    }
  }
`;

export default function ArticlePage(): JSX.Element {
    const {id} = useParams<ArticlePageParams>();
    const {getArticle} = useArticle();
    const {getCommentsByArticle, createComment} = useComment();
    const [article, setArticle] = useState<GetArticleQuery['article'] | null>(null);
    const [comments, setComments] = useState<GetCommentsByArticleQuery['commentsByArticle'] | null>(null);
    const [newComment, setNewComment] = useState<string>(''); // État pour le nouveau commentaire
    const [error, setError] = useState<string | null>(null);

    // Utiliser la requête Me pour obtenir les données utilisateur
    const {data: userData, loading: userLoading} = useQuery<MeQuery, MeQueryVariables>(ME_QUERY);

    useEffect(() => {
        if (id) {
            const fetchArticle = async (): Promise<void> => {
                try {
                    const articleData = await getArticle(Number(id));
                    setArticle(articleData);
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError('Une erreur inconnue est survenue.');
                    }
                }
            };

            const fetchComments = async (): Promise<void> => {
                try {
                    const commentsData = await getCommentsByArticle(Number(id));
                    setComments(commentsData);
                } catch (err: unknown) {
                    console.error('Erreur lors de la récupération des commentaires:', err);
                }
            };

            fetchArticle();
            fetchComments();
        }
    }, [id, getArticle, getCommentsByArticle]);

    const handleSendComment = async (): Promise<void> => {
        if (!newComment.trim()) {
            alert("Le commentaire ne peut pas être vide.");
            return;
        }

        if (!id) {
            console.error("L'ID de l'article est introuvable.");
            return;
        }

        try {
            await createComment(Number(id), newComment);
            setNewComment(''); // Réinitialiser le champ de commentaire
            const updatedComments = await getCommentsByArticle(Number(id)); // Rafraîchir les commentaires
            setComments(updatedComments);
        } catch (err: unknown) {
            console.error('Erreur lors de l\'envoi du commentaire:', err);
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!article || userLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="mx-32">

            <div className={"my-5"}>

                <Button
                    onClick={() => window.history.back()}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Retour
                </Button>

            </div>


            <Article
                key={article.id}
                articleId={article.id}
                author={article.author.name}
                author_id={parseInt(article.author.id, 10)}
                user_id={userData?.me?.id || 0}
                title={article.title}
                content={article.content}
                like={article.likes.length}
                showCommentary={false}
                isLiked={article.likes.some((like) => like.user.id === userData?.me?.id)}
            />

            <div className="flex items-center mt-4 space-x-4 px-4">
                <Input
                    type="text"
                    placeholder="Ajouter un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 py-2 px-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={handleSendComment}
                >
                    Envoyer
                </Button>
            </div>

            <div className={"px-16 mt-3.5"}>
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <Commentary
                            key={comment.id}
                            id={comment.id}
                            user_id={userData?.me?.id || 0}
                            commentary_author_id={comment.author.id}

                            content={comment.content}
                            username={comment.author.name}
                        />
                    ))
                ) : (
                    <div>Aucun commentaire pour cet article.</div>
                )}
            </div>
        </div>
    );
}