import {useAuth} from "@/context/AuthContext";

const IndexScreen: React.FC = () => {
    const {user} = useAuth();

    console.log(user);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Bienvenue sur MonApp</h1>
            <p>Contenu de la page d'accueil...</p>
        </div>
    );
};

export default IndexScreen;