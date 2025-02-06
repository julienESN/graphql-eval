import React from "react";
import {useQuery, gql} from "@apollo/client";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {LucideHeart, MessageCircle} from "lucide-react";

// Définition de la requête GraphQL pour récupérer un article


// Définition des types TypeScript pour les données de l'article
interface Author {
  name: string;
  avatarUrl?: string;
}

interface Comment {
  content: string;
  author: Author;
}

interface Like {
  user: Author;
}


interface ArticleProps {
  articleId: number;
  title: string;
  content: string;
  author: string;
}

const Article: React.FC<ArticleProps> = ({articleId, title, content, author}) => {


  const handleLike = () => {
    console.log("like");
  };


  return (
    <Card className="mb-6">
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
        <Button onClick={handleLike}> <LucideHeart className="" fill="none"/>
          Like 0</Button>
        <Button> <MessageCircle className="" fill="none"/>
          Commentaire</Button>

      </CardFooter>
    </Card>
  );
};

export default Article;
