import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Définition de la requête GraphQL pour récupérer un article
const GET_ARTICLE = gql`
  query GetArticle($id: Int!) {
    article(id: $id) {
      title
      content
      author {
        name
        avatarUrl
      }
      comments {
        content
        author {
          name
          avatarUrl
        }
      }
      likes {
        user {
          name
          avatarUrl
        }
      }
    }
  }
`;

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

interface ArticleData {
  title: string;
  content: string;
  author: Author;
  comments: Comment[];
  likes: Like[];
}

interface ArticleProps {
  articleId: number;
}

const Article: React.FC<ArticleProps> = ({ articleId }) => {
  // Utilisation du hook useQuery pour récupérer les données de l'article
  const { loading, error, data } = useQuery<{ article: ArticleData }>(GET_ARTICLE, {
    variables: { id: articleId },
  });

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  // Vérification que data et data.article sont définis
  if (!data || !data.article) return <p>Aucune donnée disponible</p>;

  const { title, content, author, comments, likes } = data.article;

  const handleLike = () => {
    console.log("Like functionality to be implemented");
  };

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Comment functionality to be implemented");
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex items-center">
        <Avatar className="mr-4">
          <AvatarImage src={author.avatarUrl} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-muted-foreground">Par {author.name}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
        <div>
          <h3>Commentaires</h3>
          {comments.map((comment, index) => (
            <div key={index} className="flex items-center mb-2">
              <Avatar className="mr-2">
                <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{comment.author.name}</p>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleLike}>Like ({likes.length})</Button>
        <form onSubmit={handleCommentSubmit} className="flex gap-2">
          <Label htmlFor="comment" className="sr-only">Commentaire</Label>
          <Input id="comment" type="text" placeholder="Ajouter un commentaire..." required />
          <Button type="submit">Envoyer</Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Article;
