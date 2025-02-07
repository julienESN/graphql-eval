import React, {createContext, useContext} from 'react';
import {useMutation, useQuery, gql} from '@apollo/client';
import {
    CreateArticleMutation,
    CreateArticleMutationVariables,
    UpdateArticleMutation,
    UpdateArticleMutationVariables,
    DeleteArticleMutation,
    DeleteArticleMutationVariables,
    GetArticleQuery,
    GetArticleQueryVariables,
    GetArticlesQuery,
} from '../generated/graphql';

// Mutation pour créer un article
const CREATE_ARTICLE_MUTATION = gql`
    mutation CreateArticle($title: String!, $content: String!) {
        createArticle(title: $title, content: $content) {
            code
            success
            message
            article {
                id
                title
                content
                author {
                    id
                    email
                }
            }
        }
    }
`;

// Mutation pour modifier un article
const UPDATE_ARTICLE_MUTATION = gql`
    mutation UpdateArticle($id: Int!, $title: String, $content: String) {
        updateArticle(id: $id, title: $title, content: $content) {
            code
            success
            message
            article {
                id
                title
                content
            }
        }
    }
`;

// Mutation pour supprimer un article
const DELETE_ARTICLE_MUTATION = gql`
    mutation DeleteArticle($id: Int!) {
        deleteArticle(id: $id) {
            code
            success
            message
            article {
                id
                title
            }
        }
    }
`;

// Requête pour obtenir un article
const GET_ARTICLE_QUERY = gql`
    query GetArticle($id: Int!) {
        article(id: $id) {
            id
            title
            content
            author {
                id
                email
            }
            comments {
                id
                content
                author {
                    id
                    email
                }
            }
        }
    }
`;

// Requête pour obtenir tous les articles
const GET_ARTICLES_QUERY = gql`
    query GetArticles {
        articles {
            id
            title
            content
            createdAt
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
`;


// Définir le type pour le contexte
interface ArticleContextType {
    createArticle: (title: string, content: string) => Promise<void>;
    updateArticle: (id: number, title?: string, content?: string) => Promise<void>;
    deleteArticle: (id: number) => Promise<void>;
    getArticle: (id: number) => Promise<GetArticleQuery['article'] | null>;
    getArticles: () => Promise<GetArticlesQuery['articles'] | null>;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [createArticle] = useMutation<CreateArticleMutation, CreateArticleMutationVariables>(CREATE_ARTICLE_MUTATION);
    const [updateArticleMutation] = useMutation<UpdateArticleMutation, UpdateArticleMutationVariables>(UPDATE_ARTICLE_MUTATION);
    const [deleteArticleMutation] = useMutation<DeleteArticleMutation, DeleteArticleMutationVariables>(DELETE_ARTICLE_MUTATION);
    const {refetch: refetchArticle} = useQuery<GetArticleQuery, GetArticleQueryVariables>(GET_ARTICLE_QUERY);
    const {refetch: refetchArticles} = useQuery<GetArticlesQuery>(GET_ARTICLES_QUERY);


    // Fonction pour créer un article
    const create = async (title: string, content: string) => {
        try {
            const {data} = await createArticle({
                variables: {title, content},
            });

            if (!data?.createArticle?.success) {
                throw new Error(data?.createArticle?.message ?? 'Erreur lors de la création de l\'article');
            }
        } catch (err) {
            console.error('Erreur lors de la création de l\'article:', err);
            throw err;
        }
    };

    // Fonction pour modifier un article
    const update = async (id: number, title?: string, content?: string) => {
        try {
            const {data} = await updateArticleMutation({
                variables: {id, title, content},
            });

            if (!data?.updateArticle?.success) {
                throw new Error(data?.updateArticle?.message ?? 'Erreur lors de la mise à jour de l\'article');
            }
        } catch (err) {
            console.error('Erreur lors de la mise à jour de l\'article:', err);
            throw err;
        }
    };

    // Fonction pour supprimer un article
    const remove = async (id: number) => {
        try {
            const {data} = await deleteArticleMutation({
                variables: {id},
            });

            if (!data?.deleteArticle?.success) {
                throw new Error(data?.deleteArticle?.message ?? 'Erreur lors de la suppression de l\'article');
            }
        } catch (err) {
            console.error('Erreur lors de la suppression de l\'article:', err);
            throw err;
        }
    };

    // Fonction pour obtenir un article
    const getArticle = async (id: number) => {
        try {
            const {data} = await refetchArticle({id});
            return data?.article || null;
        } catch (err) {
            console.error('Erreur lors de la récupération de l\'article:', err);
            throw err;
        }
    };

    // Fonction pour obtenir tous les articles
    const getArticles = async () => {
        try {
            const {data} = await refetchArticles();
            return data?.articles || null;
        } catch (err) {
            console.error('Erreur lors de la récupération des articles:', err);
            throw err;
        }
    };

    return (
        <ArticleContext.Provider
            value={{createArticle: create, updateArticle: update, deleteArticle: remove, getArticle, getArticles}}>
            {children}
        </ArticleContext.Provider>
    );
};

export const useArticle = (): ArticleContextType => {
    const context = useContext(ArticleContext);
    if (!context) {
        throw new Error('useArticle doit être utilisé dans un ArticleProvider');
    }
    return context;
};