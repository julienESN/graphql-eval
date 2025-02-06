import {useAuth} from "@/context/AuthContext";
import Article from "@/components/Article.tsx";

const IndexScreen: React.FC = () => {
    const {user} = useAuth();


    return (
        <div className="p-6 ml-32 ">
            <h1 className="text-2xl font-bold mb-4">Bienvenue sur MonApp</h1>
            <p>Contenu de la page d'accueil...</p>

            <Article articleId={"sd"} author={"Joao Neves"} title={"ICI C PARIS"}
                     content={"Je rejoins le paris saint germain"}/>
        </div>

    );
};

export default IndexScreen;