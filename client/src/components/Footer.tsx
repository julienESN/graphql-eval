/**
 * Composant Footer pour l'application.
 *
 * Affiche une barre de pied de page simple avec un copyright.
 */

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-4 border-t border-gray-300">
      <div className="container mx-auto px-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Réseau Social. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
