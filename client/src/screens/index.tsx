import Article from "@/components/Article";
import {useArticle} from "@/context/ArticleContext";
import {useEffect, useState, ReactElement} from "react";
import {gql, useQuery} from "@apollo/client";
import {
    MeQuery,
    MeQueryVariables,
} from "../generated/graphql";
import {MultiSelect} from "@/components/multi-select";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";

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
    const {data: userData, loading: userLoading} = useQuery<MeQuery, MeQueryVariables>(ME_QUERY);
    const [data, setData] = useState<ReadonlyArray<ArticleType>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [titleFilter, setTitleFilter] = useState<string>("");
    const [selectedAuthors, setSelectedAuthors] = useState<Set<number>>(new Set());
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | null>(null);
    const [sortByLikes, setSortByLikes] = useState<"MOST_LIKED" | "LEAST_LIKED" | null>(null);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response: ReadonlyArray<ArticleType> = await getArticles();
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

    useEffect(() => {
        if (data.length > 0) {
            const allUserIds = data.map((article) => article.author.id);
            setSelectedAuthors(new Set(allUserIds));
        }
    }, [data]);

    const filteredData = data
        .filter((article) => {
            const matchesTitle = article.title.toLowerCase().includes(titleFilter.toLowerCase());
            const matchesAuthor = selectedAuthors.size === 0 || selectedAuthors.has(article.author.id);
            return matchesTitle && matchesAuthor;
        })
        .sort((a, b) => {
            if (sortByLikes === "MOST_LIKED") {
                return b.likes.length - a.likes.length;
            } else if (sortByLikes === "LEAST_LIKED") {
                return a.likes.length - b.likes.length;
            } else if (sortOrder === "ASC") {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

    const handleSortChange = (value: "ASC" | "DESC" | "MOST_LIKED" | "LEAST_LIKED") => {
        if (value === "MOST_LIKED") {
            setSortByLikes("MOST_LIKED");
            setSortOrder(null);
        } else if (value === "LEAST_LIKED") {
            setSortByLikes("LEAST_LIKED");
            setSortOrder(null);
        } else {
            setSortByLikes(null);
            setSortOrder(value);
        }
    };

    return (
        <div className="p-6 mx-32">
            <h1 className="text-4xl font-bold mb-6">Liste des Articles</h1>

            <div className="mb-4 flex flex-row items-center space-x-4">
                <div className="flex items-center">
                    <Label htmlFor="filter" className="mr-2 font-bold">Filtrer par titre :</Label>
                    <Input
                        id="filter"
                        type="text"
                        placeholder="Filtrer par titre"
                        value={titleFilter}
                        onChange={(e) => setTitleFilter(e.target.value)}
                        className="w-64"
                    />
                </div>
                <div className="flex items-center">
                    <MultiSelect
                        options={data.reduce((uniqueAuthors, article) => {
                            if (!uniqueAuthors.some(author => author.value === article.author.id.toString())) {
                                uniqueAuthors.push({label: article.author.name, value: article.author.id.toString()});
                            }
                            return uniqueAuthors;
                        }, [] as { value: string; label: string }[])}
                        onValueChange={(selectedOptions) => {
                            const selectedIds = new Set(selectedOptions.map((option) => Number(option)));
                            setSelectedAuthors(selectedIds);
                        }}
                        defaultValue={[...selectedAuthors].map((authorId) => authorId.toString())}
                        placeholder="Filtre par Auteur"
                        animation={0.3}
                        maxCount={5}
                        className="w-64"
                    />
                </div>
                <div className="flex items-center">
                    <Label className="mr-2 font-bold">Trier par :</Label>
                    <Select
                        value={sortByLikes ? sortByLikes : sortOrder}
                        onValueChange={(value) => handleSortChange(value as "ASC" | "DESC" | "MOST_LIKED" | "LEAST_LIKED")}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Sélectionner un ordre"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ASC">Plus ancien en premier</SelectItem>
                            <SelectItem value="DESC">Plus récent en premier</SelectItem>
                            <SelectItem value="MOST_LIKED">Les plus aimés</SelectItem>
                            <SelectItem value="LEAST_LIKED">Les moins aimés</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {(isLoading || userLoading) && <p>Chargement en cours...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {filteredData.length === 0 && !isLoading && <p>Aucun article trouvé pour les auteurs sélectionnés.</p>}

            <div>
                {filteredData.map((item) => (
                    <Article
                        key={item.id}
                        articleId={item.id}
                        author={item.author.name}
                        author_id={item.author.id}
                        user_id={userData?.me?.id ?? null}
                        showCommentary={true}

                        title={item.title}
                        content={item.content}
                        like={item.likes.length}
                        isLiked={item.likes.some((like) => like.user.id === userData?.me?.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default IndexScreen;