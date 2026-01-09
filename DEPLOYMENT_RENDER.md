# 🚀 Guide de Déploiement sur Render.com

Ce guide vous permet de déployer l'application sur Render.com en **moins de 10 minutes** et la rendre accessible à toute votre équipe.

## 📋 Prérequis

1. Un compte GitHub (gratuit)
2. Un compte Render.com (gratuit)
3. L'application doit être dans un repository Git

## Étape 1: Préparer le projet pour le déploiement

### 1.1 Créer un fichier de démarrage pour Render

Le fichier `backend/package.json` est déjà configuré avec `"start": "node server.js"`. ✅

### 1.2 Créer un fichier `.gitignore`

```bash
cd /Users/olivieradler/Desktop/PROJETS/reviews\ Sephora/sephora-questionnaire
```

Créer `.gitignore`:
```
# Dependencies
node_modules/
package-lock.json

# Environment
.env

# Database (sera recréée sur Render)
backend/database/

# Uploads
backend/uploads/*.xlsx
!backend/uploads/.gitkeep

# Logs
*.log
```

### 1.3 S'assurer que le fichier Excel original est inclu

Le fichier `SEPHORA - 3rd Party Security Framework.xlsx` doit être dans le repo pour l'import initial.

## Étape 2: Créer un repository GitHub

```bash
cd /Users/olivieradler/Desktop/PROJETS/reviews\ Sephora/sephora-questionnaire

# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit: Sephora Security Questionnaire"

# Créer le repo sur GitHub (via l'interface web)
# Puis lier:
git remote add origin https://github.com/VOTRE_USERNAME/sephora-questionnaire.git
git branch -M main
git push -u origin main
```

## Étape 3: Déployer sur Render.com

### 3.1 Créer un compte Render

1. Aller sur https://render.com
2. S'inscrire avec GitHub (Sign up with GitHub)
3. Autoriser Render à accéder à vos repos

### 3.2 Créer un nouveau Web Service

1. Cliquer sur **"New +"** → **"Web Service"**
2. Connecter votre repository GitHub
3. Sélectionner le repo `sephora-questionnaire`

### 3.3 Configuration du service

Remplir les champs suivants:

| Champ | Valeur |
|-------|--------|
| **Name** | `sephora-questionnaire` (ou votre choix) |
| **Region** | Europe (Frankfurt) ou closest |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | Free |

### 3.4 Variables d'environnement

Ajouter ces variables d'environnement (section "Environment"):

```
JWT_SECRET=your-super-secret-production-key-change-this
NODE_ENV=production
PORT=10000
DATABASE_PATH=./database/questionnaire.db
```

**Important**: Changez `JWT_SECRET` par une clé aléatoire sécurisée!

### 3.5 Déploiement

1. Cliquer sur **"Create Web Service"**
2. Render va:
   - Cloner votre repo
   - Installer les dépendances
   - Démarrer le serveur
3. Attendre 2-3 minutes

### 3.6 Initialiser la base de données

Une fois déployé, vous devez initialiser la DB:

1. Dans Render, aller dans l'onglet **"Shell"**
2. Exécuter:
```bash
cd /opt/render/project/src/backend
node scripts/init-data.js
```

## Étape 4: Tester l'application

Votre API est maintenant en ligne! L'URL sera du type:
```
https://sephora-questionnaire.onrender.com
```

### Tests à effectuer:

```bash
# Health check
curl https://votre-app.onrender.com/health

# Login
curl -X POST https://votre-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Statistiques
curl https://votre-app.onrender.com/api/questionnaire/stats
```

## 🎉 C'est en ligne!

Votre équipe peut maintenant:
1. Se connecter avec les comptes (admin, olivier, paul, imane)
2. Utiliser l'API de n'importe où
3. Exporter le questionnaire complété

## 🔄 Mises à jour

Pour mettre à jour l'application:

```bash
# Faire vos modifications localement
git add .
git commit -m "Description des modifications"
git push

# Render détecte automatiquement et redéploie!
```

## ⚠️ Important - Plan Gratuit de Render

### Limitations du plan gratuit:
- ✅ 750 heures/mois (largement suffisant)
- ✅ HTTPS automatique
- ⚠️ Le serveur s'endort après 15 min d'inactivité
- ⚠️ Premier accès après inactivité = 30-60 sec de délai
- ✅ Base de données SQLite incluse (stockage 1GB)

### Pour éviter l'endormissement:
Vous pouvez utiliser un service gratuit comme UptimeRobot pour "pinger" votre app toutes les 5 minutes.

## 🚀 Prochaine étape: Frontend

Maintenant que l'API est en ligne, créons un frontend React qui:
- Se connecte à votre API Render
- Permet de remplir le questionnaire visuellement
- Exporte le fichier Excel complété

Ou vous pouvez utiliser l'API directement avec Postman/scripts.

## 🆘 Dépannage

**Problème: Le serveur ne démarre pas**
- Vérifier les logs dans Render (onglet "Logs")
- Vérifier que `Root Directory` = `backend`
- Vérifier que les variables d'environnement sont définies

**Problème: Base de données vide**
- Exécuter `node scripts/init-data.js` dans le Shell Render

**Problème: "Address already in use"**
- Utiliser la variable `PORT` fournie par Render (automatique)

## 💰 Coûts

- **Plan gratuit**: 0€/mois (parfait pour commencer)
- **Plan Starter**: 7$/mois si vous voulez:
  - Pas d'endormissement
  - Plus de ressources
  - Support prioritaire

## 📱 URL à partager avec l'équipe

```
https://votre-app.onrender.com
```

Donnez cette URL + les identifiants à votre équipe!
