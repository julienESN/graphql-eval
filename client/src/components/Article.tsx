import React, {useState} from "react";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {LucideEdit, LucideHeart, LucideTrash, MessageCircle} from "lucide-react";
import {useArticle} from "@/context/ArticleContext";

interface ArticleProps {
  articleId: string;
  title: string;
  author_id: number;
  user_id: number;
  content: string;
  author: string;
  like: number;
  isLiked: boolean;
}

const Article: React.FC<ArticleProps> = ({articleId, title, content, author, author_id, user_id}) => {
  const {deleteArticle} = useArticle();


  const [stateDelete, setStateDelete] = useState<boolean>(false)

  const handleDelete = async () => {
    try {
      await deleteArticle(Number(articleId));
      console.log("Article supprimé avec succès");
      setStateDelete(true)
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
    }
  };

  if (stateDelete) {
    return
  }

  return (
    <Card className="mb-6 ">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex items-center cursor-pointer">
          <Avatar className="mr-4">
            <AvatarImage src={author?.url}/>
            <AvatarFallback>{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>@ {author}</CardTitle>
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
        <Button>
          <LucideHeart className="" fill="none"/>
          J'aime
        </Button>
        <Button>
          <MessageCircle className="" fill="none"/>
          Commentaire
        </Button>
        {user_id === author_id && (
          <div className="ml-auto flex gap-x-2">
            <Button className="bg-blue-500 hover:bg-blue-950">
              <LucideEdit className="" fill="none"/>
              Modifier
            </Button>
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