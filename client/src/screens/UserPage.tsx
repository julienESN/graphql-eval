import {useState, useEffect} from "react";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {useQuery, useMutation} from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  MeUserPageQuery,
  MeUserPageQueryVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from "../generated/graphql";
import {gql} from "@apollo/client";
import Article from "@/components/Article";

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($email: String, $name: String) {
    updateUser(email: $email, name: $name) {
      code
      success
      message
      user {
        id
        email
        name
      }
    }
  }
`;

const ME_QUERY = gql`
  query MeUserPage {
    me {
      id
      email
      name
      articles {
        id
        title
        content
        author {
          id
          email
          name
        }
        likes {
          id
          user {
            id
            name
          }
        }
      }
    }
  }
`;

const BANNER_IMAGES: string[] = ["/psg1.webp"];

interface ArticleType {
  id: string;
  author: AuthorType;
  title: string;
  content: string;
  likes: LikeType[];
}

interface AuthorType {
  id: string;
  name: string;
  email: string;
}

interface LikeType {
  id: string;
  user: {
    id: number;
    name: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
}

export default function UserPage(): JSX.Element {
  const [userData, setUserData] = useState<User | null>(null);
  const [bannerImage, setBannerImage] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newMail, setNewMail] = useState<string>("");
  const [listArticles, setListArticles] = useState<ReadonlyArray<ArticleType>>([]);

  const [updateUser] = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UPDATE_USER_MUTATION,
    {
      onCompleted: (data) => {
        if (data?.updateUser?.success) {
          setUserData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              name: newUsername,
              email: newMail,
            };
          });
        }
      },
    }
  );

  const {loading, error, refetch} = useQuery<MeUserPageQuery, MeUserPageQueryVariables>(ME_QUERY, {
    onCompleted: (data) => {
      console.log(data)
      if (data?.me) {
        setUserData({
          id: parseInt(data.me.id),
          name: data.me.name || "",
          email: data.me.email || "",
        });

        setListArticles(data.me.articles);
        setNewUsername(data.me.name || "");
        setNewMail(data.me.email || "");
      }
    },
  });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BANNER_IMAGES.length);
    setBannerImage(BANNER_IMAGES[randomIndex]);
    refetch();
  }, [refetch]);

  const handleUpdateProfile = (): void => {
    updateUser({variables: {email: newMail, name: newUsername}});
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching user data:", error);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-red-600">
          Erreur de chargement des données utilisateur.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full w-full ">
      <div className="relative w-screen">
        <div
          className="w-full h-64 bg-cover bg-center shadow-lg"
          style={{
            backgroundImage: `url(${bannerImage})`,
          }}
        ></div>
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 px-6 w-full">
          <div className="bg-background rounded-lg p-6 shadow-lg max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={userData?.avatarUrl}/>
                <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{userData?.name}</h1>
                <p className="text-muted-foreground">{userData?.email}</p>
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
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMail}
                        onChange={(e) => setNewMail(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleUpdateProfile()}
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

      <div className="flex-1 mt-32 px-6 w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Articles</h2>

          {!loading && !error && (
            <div className="flex flex-col">
              {listArticles.length === 0 ? (
                <div className="space-y-4 overflow-y-auto">
                  <div className="p-4 border rounded-lg">
                    <p className="text-muted-foreground">Pas d'article posté</p>
                  </div>
                </div>
              ) : (
                listArticles.map((item) => (
                  <Article
                    key={item.id}
                    articleId={item.id}
                    author={item.author.name}
                    author_id={parseInt(item.author.id)}
                    user_id={userData?.id}
                    title={item.title}
                    content={item.content}
                    like={item.likes.length}
                    isLiked={item.likes.some((like) => like.user.id === userData?.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}