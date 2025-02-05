import React from 'react';
import {Navigate} from 'react-router';
import {useAuth} from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const {user} = useAuth();

    if (!user) {
        // Redirige vers /login si l'utilisateur n'est pas connecté
        return <Navigate to="/login"/>;
    }

    // Affiche le composant enfant si l'utilisateur est connecté
    return children;
};

export default ProtectedRoute;