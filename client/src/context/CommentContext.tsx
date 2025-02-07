import React, {createContext, useContext} from 'react';
import {useMutation, useQuery, gql} from '@apollo/client';
import {
    CreateCommentMutation,
    CreateCommentMutationVariables,
    UpdateCommentMutation,
    UpdateCommentMutationVariables,
    DeleteCommentMutation,
    DeleteCommentMutationVariables,
    GetCommentQuery,
    GetCommentQueryVariables,
    GetCommentsQuery,
    GetCommentsByArticleQuery,
    GetCommentsByArticleQueryVariables,
} from '../generated/graphql';

// Mutation pour créer un commentaire
const CREATE_COMMENT_MUTATION = gql`
    mutation CreateComment($articleId: Int!, $content: String!) {
        createComment(articleId: $articleId, content: $content) {
            code
            success
            message
            comment {
                id
                content
                author {
                    id
                    email
                }
                article {
                    id
                    title
                }
            }
        }
    }
`;

// Mutation pour modifier un commentaire
const UPDATE_COMMENT_MUTATION = gql`
    mutation UpdateComment($id: Int!, $content: String!) {
        updateComment(id: $id, content: $content) {
            code
            success
            message
            comment {
                id
                content
            }
        }
    }
`;

// Mutation pour supprimer un commentaire
const DELETE_COMMENT_MUTATION = gql`
    mutation DeleteComment($id: Int!) {
        deleteComment(id: $id) {
            code
            success
            message
            comment {
                id
                content
            }
        }
    }
`;

// Requête pour obtenir un commentaire
const GET_COMMENT_QUERY = gql`
    query GetComment($id: Int!) {
        comment(id: $id) {
            id
            content
            author {
                id
                email
            }
            article {
                id
                title
            }
        }
    }
`;

// Requête pour obtenir tous les commentaires
const GET_COMMENTS_QUERY = gql`
    query GetComments {
        comments {
            id
            content
            author {
                id
                email
            }
            article {
                id
                title
            }
        }
    }
`;

// Requête pour obtenir les commentaires d'un article spécifique
const GET_COMMENTS_BY_ARTICLE_QUERY = gql`
    query GetCommentsByArticle($articleId: Int!) {
        commentsByArticle(articleId: $articleId) {
            id
            content
            author {
                id
                email
                name
            }
        }
    }
`;

// Définition du contexte
interface CommentContextType {
    createComment: (articleId: number, content: string) => Promise<void>;
    updateComment: (id: number, content: string) => Promise<void>;
    deleteComment: (id: number) => Promise<void>;
    getComment: (id: number) => Promise<GetCommentQuery['comment'] | null>;
    getComments: () => Promise<GetCommentsQuery['comments'] | null>;
    getCommentsByArticle: (articleId: number) => Promise<GetCommentsByArticleQuery['commentsByArticle'] | null>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [createComment] = useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CREATE_COMMENT_MUTATION);
    const [updateCommentMutation] = useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(UPDATE_COMMENT_MUTATION);
    const [deleteCommentMutation] = useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DELETE_COMMENT_MUTATION);
    const {refetch: refetchComment} = useQuery<GetCommentQuery, GetCommentQueryVariables>(GET_COMMENT_QUERY);
    const {refetch: refetchComments} = useQuery<GetCommentsQuery>(GET_COMMENTS_QUERY);
    const {refetch: refetchCommentsByArticle} = useQuery<GetCommentsByArticleQuery, GetCommentsByArticleQueryVariables>(GET_COMMENTS_BY_ARTICLE_QUERY);

    const create = async (articleId: number, content: string) => {
        await createComment({variables: {articleId, content}});
    };

    const update = async (id: number, content: string) => {
        await updateCommentMutation({variables: {id, content}});
    };

    const remove = async (id: number) => {
        await deleteCommentMutation({variables: {id}});
    };

    const getComment = async (id: number) => {
        const {data} = await refetchComment({id});
        return data?.comment || null;
    };

    const getComments = async () => {
        const {data} = await refetchComments();
        return data?.comments || null;
    };

    const getCommentsByArticle = async (articleId: number) => {
        const {data} = await refetchCommentsByArticle({articleId});
        return data?.commentsByArticle || null;
    };

    return (
        <CommentContext.Provider value={{
            createComment: create,
            updateComment: update,
            deleteComment: remove,
            getComment,
            getComments,
            getCommentsByArticle
        }}>
            {children}
        </CommentContext.Provider>
    );
};

export const useComment = (): CommentContextType => {
    const context = useContext(CommentContext);
    if (!context) {
        throw new Error('useComment doit être utilisé dans un CommentProvider');
    }
    return context;
};
