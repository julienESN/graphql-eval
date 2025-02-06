import Article from "@/components/Article";
import {useArticle} from "@/context/ArticleContext";
import {useEffect, useState, ReactElement} from "react";
import {useAuth} from "@/context/AuthContext.tsx";
import {gql, useQuery} from "@apollo/client";
import {
    MeQuery,
    MeQueryVariables,

} from "../generated/graphql"; // Types générés par GraphQL Codegen
interface AuthorType {
    name: string;
}

interface LikeType {
    user: {
        id: number;
    };
}

interface ArticleType {
    id: string;
    author: AuthorType;
    title: string;
    content: string;
    likes: LikeType[];
}

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
    }
  }
`;

const IndexScreen: React.FC = (): ReactElement => {
    const {getArticles} = useArticle();
    const [userData, setUserData] = useState<{
        id: number;
        name: string;
        email: string;
        avatarUrl?: string;
    } | null>(null);
    const [data, setData] = useState<ReadonlyArray<ArticleType>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const {loading} = useQuery<MeQuery, MeQueryVariables>(ME_QUERY, {
        onCompleted: (data) => {
            if (data?.me) {
                setUserData({
                    id: data.me.id,
                    name: data.me.name,
                    email: data.me.email,
                });

            }
        },
    });


    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response: ReadonlyArray<ArticleType> = await getArticles();
                console.log(response);
                setData(response);
                setError(null);
            } catch (err: Error | unknown) {
                setError(
                    err instanceof Error
                        ? `Erreur: ${err.message}`
                        : "Une erreur s'est produite lors du chargement des articles."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [getArticles]);


    console.log("user", userData)

    return (
        <div className="p-6 mx-32">
            <h1 className="text-4xl font-bold mb-6">Liste des Articles</h1>

            {isLoading && loading && <p>Chargement en cours...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && !error && (
                <div className="flex flex-col">
                    {data.map((item) => (
                        <Article
                            key={item.id}
                            articleId={item.id}
                            author={item.author.name}
                            author_id={item.author.id}
                            user_id={userData?.id}
                            title={item.title}
                            content={item.content}
                            like={item.likes.length}
                            isLiked={item.likes.some((like) => like.user.id === userData?.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default IndexScreen;