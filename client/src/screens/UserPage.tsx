/**
 * Page de profil utilisateur
 * @file UserPage.tsx
 * 
 * Ce composant affiche le profil de l'utilisateur avec ses informations personnelles
 * et la liste de ses articles. Il permet également de modifier les informations du profil.
 */

import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Interface pour les données utilisateur
interface UserData {
  name: string;
  email: string;
  avatarUrl?: string;
}

// Liste des images de bannière disponibles
const BANNER_IMAGES = [
  "/psg1.webp",
  "/psg2.webp",
  // Ajoutez ici toutes les images .webp disponibles
];

// Interface pour les données d'article (à développer plus tard)
// interface Article {
//   id: number;
//   title: string;
//   // ... autres propriétés à ajouter
// }

export default function UserPage() {
  // États pour gérer les données utilisateur et la modale
  const [userData, setUserData] = useState<UserData>({
    name: "João Neves",
    email: "joaoneves@psg.com",
  });
  const [bannerImage, setBannerImage] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  // Effet pour charger une image de bannière aléatoire
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BANNER_IMAGES.length);
    setBannerImage(BANNER_IMAGES[randomIndex]);
  }, []);

  // Fonction pour gérer la mise à jour du profil
  const handleUpdateProfile = (newData: Partial<UserData>) => {
    console.log("Mise à jour du profil avec les données:", newData);
    // TODO: Implémenter la mutation GraphQL pour mettre à jour le profil
    setUserData(prevData => ({...prevData, ...newData}));
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col min-h-full w-full">
      {/* En-tête du profil */}
      <div className="relative w-full">
        {/* Bannière */}
        <div 
          className="w-full h-48 bg-cover bg-center rounded-bl-lg shadow-lg"
          style={{ 
            backgroundImage: `url(${bannerImage})`,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backgroundBlendMode: 'overlay'
          }}
        />

        {/* Informations utilisateur */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 px-6 w-full">
          <div className="bg-background rounded-lg p-6 shadow-lg max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={userData.avatarUrl} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-muted-foreground">{userData.email}</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Modifier le profil</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier le profil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        defaultValue={userData.name}
                        onChange={(e) => 
                          handleUpdateProfile({ name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={userData.email}
                        onChange={(e) => 
                          handleUpdateProfile({ email: e.target.value })
                        }
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleUpdateProfile(userData)}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des articles */}
      <div className="flex-1 mt-32 px-6 w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Articles</h2>
          <div className="space-y-4 overflow-y-auto">
            {/* TODO: Remplacer par le composant ArticleCard */}
            <div className="p-4 border rounded-lg">
              <p className="text-muted-foreground">
                Les cartes d'articles seront affichées ici
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
