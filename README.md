# graphql-eval

## Initialisation du Projet

Le script `setup.js` est conçu pour initialiser le projet en mode développement, en démarrant à la fois le serveur backend et le serveur frontend. Voici un aperçu de son fonctionnement :

### Fonctionnalités du Script

- **Libération de Port** : Le script vérifie et libère le port 4000 si nécessaire, afin de garantir que le serveur backend puisse démarrer sans conflit.
- **Démarrage du Serveur Backend** : 
  - Installe les dépendances nécessaires.
  - Exécute les commandes d'initialisation du serveur.
- **Démarrage du Serveur Frontend** :
  - Génère le code requis pour le frontend.
  - Installe les dépendances et démarre le serveur de développement.

### Instructions d'Utilisation

1. Assurez-vous que Node.js est installé sur votre machine.
2. Exécutez le script `setup.js` avec la commande suivante :
   ```bash
   node setup.js
   ```
3. Le script détectera automatiquement votre système d'exploitation et exécutera les commandes appropriées pour démarrer les serveurs dans des terminaux séparés.

### Auteurs

Ce projet a été développé par Clément, Sofiane, Julien et Galaad.