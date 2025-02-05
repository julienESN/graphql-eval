import React, {createContext, useContext, useState, useEffect} from 'react';
import {useMutation, gql} from '@apollo/client';
import Cookies from 'js-cookie';

// Mutation pour l'inscription
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

// Mutation pour la connexion
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

// Définir le type pour l'utilisateur
interface User {
    email: string;
    token: string;
}

// Définir le type pour le contexte
interface AuthContextType {
    user: User | null;
    register: (email: string, password: string, name: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [signUp] = useMutation(SIGN_UP_MUTATION);
    const [signIn] = useMutation(SIGN_IN_MUTATION);

    useEffect(() => {
        // Charger l'utilisateur à partir des cookies lors du montage
        const token = Cookies.get('token');
        const email = Cookies.get('email');
        if (token && email) {
            setUser({email, token});
        }
    }, []);

    // Fonction pour s'inscrire
    const register = async (email: string, password: string, name: string) => {
        try {
            const {data} = await signUp({
                variables: {email, password, name},
            });

            if (data.signUp.success) {
                setUser({email, token: data.signUp.token});
                Cookies.set('token', data.signUp.token, {expires: 1}); // Expire dans 23h59
                Cookies.set('email', email, {expires: 1});
            } else {
                console.error(data.signUp.message);
                throw new Error(data.signUp.message);
            }
        } catch (err) {
            console.error('Error during registration:', err);
            throw err;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const {data} = await signIn({
                variables: {email, password},
            });

            if (data.signIn.success) {
                setUser({email, token: data.signIn.token});
                Cookies.set('token', data.signIn.token, {expires: 1}); // Expire dans 23h59
                Cookies.set('email', email, {expires: 1});
            } else {
                console.error(data.signIn.message);
                throw new Error(data.signIn.message);
            }
        } catch (err) {
            console.error('Error during login:', err);
            throw err;
        }
    };

    const logout = () => {
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

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};