
# graphql-eval / MetalHEAD

## Instructions d'installation et d'exécution du projet

# Backend Side

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


# Front-end

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

> Les deux .env(front & back) sont déjà mit vue que c'est un exercice 
