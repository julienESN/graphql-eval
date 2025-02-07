# graphql-eval / MetalHEAD

## Instructions d'installation et d'exécution du projet

Vous avez deux options pour installer et exécuter le projet :

### Option 1 : Installation automatique (Recommandée)

1. **Cloner le dépôt :**
```bash
git clone https://github.com/julienESN/graphql-eval.git
```

2. **Exécuter le script d'installation automatique :**
```bash
node setup.js
```

Le script va automatiquement :
- Détecter votre système d'exploitation
- Vérifier et libérer les ports nécessaires
- Installer et démarrer le serveur backend
- Générer le code GraphQL
- Installer et démarrer le serveur frontend

### Option 2 : Installation manuelle

#### Backend

1. **Aller dans le dossier du serveur :**
```bash
cd server
```

2. **Installer les dépendances :**
```bash
npm install
```

3. **Lancer le serveur :**
```bash
npm run init
```

Cette commande exécute automatiquement :
- La migration Prisma (npm run db)
- Le seed de la base de données (npm run seed)
- Le démarrage du serveur Node (npm run dev)

4. **Générer le code GraphQL** (dans un nouveau terminal) :
```bash
npm run codegen
```

#### Frontend

1. **Aller dans le dossier du frontend :**
```bash
cd client
```

2. **Installer les dépendances :**
```bash
npm install
```

3. **Générer les types avec Codegen :**
```bash
npm run generate
```

4. **Lancer le serveur :**
```bash
npm run dev
```

## Auteurs

Développé par Clément, Sofiane, Julien et Galaad.

