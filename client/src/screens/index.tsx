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
    id: number;
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
    createdAt: string;
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
    const { data: userData } = useQuery<MeQuery, MeQueryVariables>(ME_QUERY);
    const [data, setData] = useState<ReadonlyArray<ArticleType>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Nouveaux états pour le filtrage et le tri
    const [titleFilter, setTitleFilter] = useState<string>("");
    const [selectedAuthors, setSelectedAuthors] = useState<Set<number>>(new Set());
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

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

    // Logique pour cocher automatiquement tous les utilisateurs par défaut
    useEffect(() => {
        if (userData) {
            const allUserIds = data.map((article) => article.author.id);
            setSelectedAuthors(new Set(allUserIds));
        }
    }, [userData, data]);

    console.log("user", userData)

    // Fonction pour gérer le changement de sélection des auteurs
    const handleAuthorCheckboxChange = (authorId: number) => {
        setSelectedAuthors((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(authorId)) {
                newSet.delete(authorId);
            } else {
                newSet.add(authorId);
            }
            return newSet;
        });
    };

    // Filtrer et trier les articles en fonction des filtres et de l'ordre de tri
    const filteredData = data
        .filter((article) => {
            const matchesTitle = article.title.toLowerCase().includes(titleFilter.toLowerCase());
            const matchesAuthor = selectedAuthors.size === 0 || selectedAuthors.has(article.author.id);
            return matchesTitle && matchesAuthor;
        })
        .sort((a, b) => {
            if (sortOrder === "ASC") {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

    const handleSortChange = (value: "ASC" | "DESC") => {
        setSortOrder(value);
    };

    return (
        <div className="p-6 mx-32">
            <h1 className="text-4xl font-bold mb-6">Liste des Articles</h1>

            {/* Formulaire de filtrage */}
            <div className="mb-4">
                <label htmlFor="filter"><strong>Filtrer par titre : </strong></label>
                <input
                    type="text"
                    placeholder="Filtrer par titre"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                    className="border p-2 mb-2"
                />
                <div>
                    <h2 className="font-bold">Filtrer par auteur :</h2>
                    <input
                        type="checkbox"
                        id="allUsers"
                        checked={selectedAuthors.size === data.length}
                        onChange={() => {
                            if (selectedAuthors.size === data.length) {
                                setSelectedAuthors(new Set());
                            } else {
                                const allUserIds = data.map((article) => article.author.id);
                                setSelectedAuthors(new Set(allUserIds));
                            }
                        }}
                    />
                    <label htmlFor="allUsers">Tous les utilisateurs</label>
                    {data.map((article) => (
                        <div key={article.author.id}>
                            <input
                                type="checkbox"
                                id={`author-${article.author.id}`}
                                checked={selectedAuthors.has(article.author.id)}
                                onChange={() => handleAuthorCheckboxChange(article.author.id)}
                            />
                            <label htmlFor={`author-${article.author.id}`}>{article.author.name}</label>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <label className="font-bold">Trier par date :</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => handleSortChange(e.target.value as "ASC" | "DESC")}
                        className="border p-2 ml-2"
                    >
                        <option value="ASC">Plus ancien en premier</option>
                        <option value="DESC">Plus récent en premier</option>
                    </select>
                </div>
            </div>

            {isLoading && <p>Chargement en cours...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Affichage des articles filtrés et triés */}
            <div>
                {filteredData.map((item) => (
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
        </div>
    );
};

export default IndexScreen;