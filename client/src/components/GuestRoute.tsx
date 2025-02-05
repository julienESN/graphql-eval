import {ReactNode} from "react";
import {Navigate} from "react-router";
import {useAuth} from "@/context/AuthContext";

interface GuestRouteProps {
    children: ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({children}) => {
    const {user} = useAuth();

    if (user) {
        // Redirige vers la page d'accueil si l'utilisateur est déjà connecté
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};

export default GuestRoute;