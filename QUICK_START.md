# 🚀 Guide de Démarrage Rapide

## Ce qui a été créé

Une application web collaborative pour remplir le questionnaire de sécurité Sephora avec:

✅ **Backend complet** (Node.js + Express + SQLite)
- API REST complète
- Import/Export Excel avec formatage préservé
- Authentification JWT
- Base de données avec 191 questions importées

✅ **Fonctionnalités principales**
- Édition collaborative multi-utilisateurs
- Commentaires par question
- Suivi de progression en temps réel
- Recherche et filtrage
- Export Excel identique au format original

## 📦 Installation

### 1. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Initialiser la base de données avec le questionnaire Sephora
node scripts/init-data.js

# Démarrer le serveur
npm run dev
```

Le backend sera accessible sur **http://localhost:5000**

### 2. Comptes de test créés

| Username | Password    | Rôle  |
|----------|-------------|-------|
| admin    | admin123    | Admin |
| olivier  | olivier123  | User  |
| paul     | paul123     | User  |
| imane    | imane123    | User  |

### 3. Tester l'API

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Statistiques
curl http://localhost:5000/api/questionnaire/stats

# Export Excel (téléchargement)
curl http://localhost:5000/api/excel/export > questionnaire-export.xlsx
```

## 📊 Ce qui est stocké dans la base de données

- **5 onglets** (sheets) du questionnaire Excel
- **191 questions** importées automatiquement
- **4 utilisateurs** de test
- Toutes les données existantes du fichier Livstick (Project Title, Business Domain, etc.)

## 🎯 Prochaines étapes

### Option 1: Créer un Frontend React
Je peux créer une interface web moderne avec React pour:
- Interface de login
- Navigation par onglets
- Formulaires pour répondre aux questions
- Dashboard avec progression
- Bouton d'export Excel

### Option 2: Utiliser l'API directement
Vous pouvez aussi utiliser l'API avec:
- Postman / Insomnia
- Un autre frontend existant
- Scripts Python/Node.js personnalisés

### Option 3: Déployer sur Render.com maintenant
Je peux créer le guide de déploiement pour rendre l'API accessible en ligne.

## 🔧 Structure du projet

```
sephora-questionnaire/
├── backend/
│   ├── server.js              # Serveur Express principal
│   ├── models/
│   │   └── database.js        # Gestion SQLite
│   ├── routes/
│   │   ├── auth.js            # Routes authentification
│   │   ├── questionnaire.js   # Routes questionnaire
│   │   └── excel.js           # Routes import/export
│   ├── controllers/
│   │   └── excelController.js # Logique Excel
│   ├── scripts/
│   │   └── init-data.js       # Initialisation DB
│   └── database/
│       └── questionnaire.db   # Base SQLite (créée auto)
└── README.md
```

## ❓ Questions fréquentes

**Q: Les formules Excel sont-elles préservées?**
R: Oui! Le template Excel original est conservé, seules les réponses sont injectées.

**Q: Plusieurs personnes peuvent-elles travailler en même temps?**
R: Oui, chaque utilisateur peut se connecter et modifier les réponses.

**Q: Les données sont-elles sauvegardées automatiquement?**
R: Oui, chaque réponse est sauvegardée immédiatement dans la base de données.

**Q: Peut-on revenir en arrière sur une modification?**
R: Actuellement non, mais l'historique d'activité est enregistré (activity_log).

## 🆘 Support

En cas de problème:
1. Vérifiez que Node.js est installé: `node --version`
2. Vérifiez que le serveur est démarré: `curl http://localhost:5000/health`
3. Vérifiez les logs du serveur dans le terminal

## Que voulez-vous faire ensuite?

1. **Créer le frontend React** → Interface web moderne
2. **Déployer sur Render.com** → Accessible de partout
3. **Améliorer l'API** → Ajouter des fonctionnalités
4. **Tester l'export Excel** → Vérifier que le format est correct
