import React, {createContext, useContext, useState, useEffect} from 'react';
import {useMutation} from '@apollo/client';
import Cookies from 'js-cookie';
import {
    SignUpMutation,
    SignUpMutationVariables,
    SignInMutation,
    SignInMutationVariables,
} from '../generated/graphql'; // Types générés par GraphQL Codegen
import {gql} from '@apollo/client';

// Définition des mutations GraphQL
const SIGN_UP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!, $name: String!) {
    signUp(email: $email, password: $password, name: $name) {
      code
      success
      message
      token
    }
  }
`;

const SIGN_IN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      code
      success
      message
      token
    }
  }
`;

// Typage strict pour l'utilisateur
interface User {
    email: string;
    token: string;
}

// Typage strict pour le contexte d'authentification
interface AuthContextType {
    user: User | null;
    register: (email: string, password: string, name: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// Création du contexte avec un typage strict
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);

    // Typage des mutations avec les types générés
    const [signUp] = useMutation<SignUpMutation, SignUpMutationVariables>(SIGN_UP_MUTATION);
    const [signIn] = useMutation<SignInMutation, SignInMutationVariables>(SIGN_IN_MUTATION);

    useEffect(() => {
        // Charger l'utilisateur à partir des cookies lors du montage
        const token = Cookies.get('token');
        const email = Cookies.get('email');
        if (token && email) {
            setUser({email, token});
        }
    }, []);

    // Fonction pour s'inscrire
    const register = async (email: string, password: string, name: string): Promise<void> => {
        try {
            const {data} = await signUp({
                variables: {email, password, name},
            });

            if (data?.signUp?.success && data.signUp.token) {
                setUser({email, token: data.signUp.token});
                Cookies.set('token', data.signUp.token, {expires: 1}); // Expire dans 23h59
                Cookies.set('email', email, {expires: 1});
            } else {
                throw new Error(data?.signUp?.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Error during registration:', err);
            throw new Error('Registration failed');
        }
    };

    // Fonction pour se connecter
    const login = async (email: string, password: string): Promise<void> => {
        try {
            const {data} = await signIn({
                variables: {email, password},
            });

            if (data?.signIn?.success && data.signIn.token) {
                setUser({email, token: data.signIn.token});
                Cookies.set('token', data.signIn.token, {expires: 1}); // Expire dans 23h59
                Cookies.set('email', email, {expires: 1});
            } else {
                throw new Error(data?.signIn?.message || 'Login failed');
            }
        } catch (err) {
            console.error('Error during login:', err);
            throw new Error('Login failed');
        }
    };

    // Fonction pour se déconnecter
    const logout = (): void => {
        setUser(null);
        Cookies.remove('token');
        Cookies.remove('email');
    };

    return (
        <AuthContext.Provider value={{user, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour accéder au contexte d'authentification
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};