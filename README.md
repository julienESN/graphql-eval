# graphql-eval

## Initialisation du Projet

Cloner le projet à partir du repos distant :
```bash
git clone https://github.com/julienESN/graphql-eval.git
```

Le script `setup.js` est conçu pour initialiser le projet en mode développement, en démarrant à la fois le serveur backend et le serveur frontend. 

Voici un aperçu de son fonctionnement :

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


## Instructions d'installation et d'exécution du projet manuellement

### Backend Side

1.  **Cloner le dépôt :**

```bash
git clone https://github.com/julienESN/graphql-eval.git
```

2.  **Aller dans le dossier du projet :**

```bash
cd server
```

3.  **Installer les dépendances :**

```bash
npm install
```

4.  **Lancer le serveur :**

```bash
npm run init
```

Cette commande exécute automatiquement :

 
 - La migration Prisma (npm run db)
   
 - Le seed de la base de données (npm run seed)
      
 - Le démarrage du serveur Node (npm run dev)

5. **Générer le code GraphQL** (dans un **nouveau terminal**) :

```bash
npm run codegen
```

Cette étape génère automatiquement les types TypeScript à partir du schéma GraphQL.

### Front-end

1.  **Aller dans le dossier du front :**

```bash
cd client
```

2.  **Installer les dépendances :**

```bash
npm install
```

3.  **Générer les types avec Codegen :**

```bash
npm run generate
```
  
4.  **Lancer le serveur :**

```bash
npm run dev
```

## Auteurs

Ce projet a été développé par Clément, Sofiane, Julien et Galaad.