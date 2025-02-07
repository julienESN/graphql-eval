import React, {useState} from "react";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {Button} from "@/components/ui/button";
import {useComment} from "../context/CommentContext";

interface CommentaryProps {
    id: number;
    user_id: number
    username: string;
    content: string;
    commentary_author_id: number;
}

const Commentary: React.FC<CommentaryProps> = ({id, user_id, username, content, commentary_author_id}) => {
    const {deleteComment, updateComment} = useComment();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedContent, setEditedContent] = useState<string>(content);

    const avatarLetter = username.charAt(0).toUpperCase();

    const handleDelete = async () => {
        try {
            await deleteComment(id);
            alert("Commentaire supprimé avec succès !");
        } catch (error) {
            console.error("Erreur lors de la suppression du commentaire :", error);
            alert("Une erreur est survenue lors de la suppression.");
        }
    };

    const handleUpdate = async () => {
        try {
            await updateComment(id, editedContent);
            alert("Commentaire modifié avec succès !");
            setIsEditing(false);
        } catch (error) {
            console.error("Erreur lors de la modification du commentaire :", error);
            alert("Une erreur est survenue lors de la modification.");
        }
    };

    return (
        <Card className={"my-3"}>
            <CardHeader className="flex">
                <div className="flex items-center cursor-pointer">
                    <Avatar className="mr-4">
                        <AvatarImage src={""}/>
                        <AvatarFallback>{avatarLetter}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>@ {username} {user_id} {commentary_author_id}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className={"ml-16"}>
                {isEditing ? (
                    <div>
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="border p-2 w-full"
                        />
                        <Button
                            className="mt-2"
                            onClick={handleUpdate}
                        >
                            Enregistrer
                        </Button>
                    </div>
                ) : (
                    <p>{content}</p>
                )}
            </CardContent>


            {user_id === commentary_author_id && (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="destructive" onClick={handleDelete}>
                        Supprimer
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing((prev) => !prev)}
                    >
                        {isEditing ? "Annuler" : "Modifier"}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};

export default Commentary;