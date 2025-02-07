import React, {useState} from "react";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {LucideEdit, LucideHeart, LucideTrash, MessageCircle} from "lucide-react";
import {useArticle} from "@/context/ArticleContext";
import {useNavigate, NavLink} from 'react-router';


// Typage strict des props basé sur les types générés
interface ArticleProps {
  articleId: string; // ID de l'article
  title: string; // Titre de l'article
  author_id: number; // ID de l'auteur
  user_id: number; // ID de l'utilisateur actuel
  content: string; // Contenu de l'article
  author: string; // Nom de l'auteur
  like: number; // Nombre de likes
  isLiked: boolean; // Indique si l'utilisateur a liké
  showCommentary: boolean;
}

const Article: React.FC<ArticleProps> = ({
                                           articleId,
                                           title,
                                           content,
                                           author,
                                           author_id,
                                           user_id,
                                           like,
                                           isLiked,
                                           showCommentary
                                         }) => {
  const {deleteArticle, likeArticle, unlikeArticle} = useArticle(); // Hooks pour les mutations
  const [currentLike, setCurrentLike] = useState<number>(like);
  const [liked, setLiked] = useState<boolean>(isLiked);
  const [stateDelete, setStateDelete] = useState<boolean>(false);

  const navigate = useNavigate();


  // Gestion du like/unlike
  const handleLike = async (): Promise<void> => {
    try {
      if (liked) {
        await unlikeArticle(Number(articleId));
        setCurrentLike((prev) => Math.max(prev - 1, 0));
      } else {
        await likeArticle(Number(articleId));
        setCurrentLike((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Erreur lors du traitement du like/dislike:", error);
    }
  };

  // Gestion de la suppression
  const handleDelete = async (): Promise<void> => {
    try {
      await deleteArticle(Number(articleId));
      console.log("Article supprimé avec succès");
      setStateDelete(true);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
    }
  };

  // Couleur du bouton de like
  const colorLike = (): string => (liked ? "red" : "none");

  // Si l'article est supprimé, ne rien afficher
  if (stateDelete) {
    return null;
  }

  return (
    <Card className="mb-6 ">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex items-center cursor-pointer">
          <Avatar className="mr-4">
            <AvatarImage src={""}/>
            <AvatarFallback>{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>@ {author} {user_id} == {author_id}</CardTitle>
          </div>
        </div>
        <div className="flex flex-1 justify-center cursor-pointer">
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter className="flex gap-x-5">
        <Button onClick={handleLike}>
          {currentLike}
          <LucideHeart className="" fill={colorLike()}/>
          J'aime
        </Button>

        {showCommentary && (<Button onClick={() => {

            navigate(`/articlepage/${articleId}`);
          }}>

            <MessageCircle className="" fill="none"/>
            Voir les commentaires
          </Button>

        )}

        {user_id === author_id && (
          <div className="ml-auto flex gap-x-2">
            <NavLink to={`/updatearticle/${articleId}`}>
              <Button className="bg-blue-500 hover:bg-blue-950">
                <LucideEdit className="" fill="none" />
                Modifier
              </Button>
            </NavLink>
            <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-950">
              <LucideTrash className="" fill="none"/>
              Supprimer
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Article;