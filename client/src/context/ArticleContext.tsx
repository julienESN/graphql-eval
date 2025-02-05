import React, { createContext, useContext } from 'react';
import { useMutation, gql } from '@apollo/client';

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

// Définir le type pour le contexte
interface ArticleContextType {
    createArticle: (title: string, content: string) => Promise<void>;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [createArticle] = useMutation(CREATE_ARTICLE_MUTATION);

    // Fonction pour créer un article
    const create = async (title: string, content: string) => {
        try {
            const { data } = await createArticle({
                variables: { title, content },
            });

            if (!data.createArticle.success) {
                throw new Error(data.createArticle.message);
            }
        } catch (err) {
            console.error('Error creating article:', err);
            throw err;
        }
    };

    return (
        <ArticleContext.Provider value={{ createArticle: create }}>
            {children}
        </ArticleContext.Provider>
    );
};

export const useArticle = (): ArticleContextType => {
    const context = useContext(ArticleContext);
    if (!context) {
        throw new Error('useArticle must be used within an ArticleProvider');
    }
    return context;
};