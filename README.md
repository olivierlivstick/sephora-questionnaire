# Sephora Security Questionnaire - Application Collaborative

Application web pour remplir le questionnaire de sécurité "SEPHORA - 3rd Party Security Framework" de manière collaborative.

## ✨ Fonctionnalités

- 📝 **Import Excel automatique** - Le questionnaire Sephora est importé automatiquement
- 👥 **Multi-utilisateurs** - Plusieurs personnes peuvent travailler ensemble
- 💾 **Sauvegarde automatique** - Chaque réponse est sauvegardée immédiatement
- 📊 **Suivi de progression** - Statistiques en temps réel (% de complétion)
- 💬 **Commentaires** - Possibilité d'annoter chaque question
- 🔍 **Recherche** - Filtrage des questions par mots-clés
- 📥 **Export Excel** - Génération du fichier Excel avec formatage identique à l'original
- 🔐 **Authentification sécurisée** - Connexion par utilisateur avec JWT

## 🎯 Objectif

Transformer le remplissage du questionnaire Excel (fastidieux et non-collaboratif) en une expérience web moderne où plusieurs personnes peuvent contribuer simultanément.

## 📦 Structure du Projet

```
sephora-questionnaire/
├── backend/                          # API Node.js + Express + SQLite
│   ├── server.js                     # Serveur principal
│   ├── models/database.js            # Gestion base de données
│   ├── routes/                       # Routes API
│   │   ├── auth.js                   # Authentification
│   │   ├── questionnaire.js          # Gestion du questionnaire
│   │   └── excel.js                  # Import/Export Excel
│   ├── controllers/
│   │   └── excelController.js        # Logique Excel (ExcelJS)
│   ├── scripts/
│   │   └── init-data.js              # Initialisation DB
│   └── database/
│       └── questionnaire.db          # Base SQLite (auto-créée)
│
├── QUICK_START.md                    # Guide de démarrage rapide
├── DEPLOYMENT_RENDER.md              # Guide déploiement Render.com
└── README.md                         # Ce fichier
```

## 🚀 Démarrage Rapide

### 1. Installation

```bash
cd backend
npm install
```

### 2. Initialisation de la base de données

```bash
node scripts/init-data.js
```

Ceci va:
- Créer la base de données SQLite
- Importer les 191 questions du questionnaire Sephora
- Créer 4 comptes utilisateurs de test

### 3. Démarrer le serveur

```bash
npm run dev
```

Le serveur démarre sur **http://localhost:5000**

### 4. Se connecter

Comptes de test disponibles:

| Username | Password   | Rôle  |
|----------|------------|-------|
| admin    | admin123   | Admin |
| olivier  | olivier123 | User  |
| paul     | paul123    | User  |
| imane    | imane123   | User  |

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/verify` - Vérifier le token

### Questionnaire
- `GET /api/questionnaire/sheets` - Liste des onglets
- `GET /api/questionnaire/sheets/:id/questions` - Questions d'un onglet
- `GET /api/questionnaire/questions/:id` - Détail d'une question
- `POST /api/questionnaire/questions/:id/response` - Sauvegarder une réponse
- `POST /api/questionnaire/questions/:id/comments` - Ajouter un commentaire
- `GET /api/questionnaire/stats` - Statistiques de progression
- `GET /api/questionnaire/activity` - Activité récente

### Excel
- `POST /api/excel/import` - Importer un fichier Excel
- `GET /api/excel/export` - Exporter les réponses vers Excel

## 📊 Base de Données

La base de données SQLite contient:

- **5 onglets** (sheets):
  - 1 - General description
  - 2 - Qualification
  - 3 - 3rd Party Security Policy
  - 4 - 3rd Party Assessment
  - 5 - Risk Assessment

- **191 questions** importées automatiquement depuis le fichier Excel

- **Tables**:
  - `users` - Utilisateurs
  - `sheets` - Onglets du questionnaire
  - `questions` - Questions
  - `responses` - Réponses
  - `comments` - Commentaires
  - `activity_log` - Historique d'activité

## 🧪 Tester l'API

### Exemple: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Exemple: Obtenir les statistiques
```bash
curl http://localhost:5000/api/questionnaire/stats
```

### Exemple: Exporter le questionnaire
```bash
curl http://localhost:5000/api/excel/export \
  --output questionnaire-export.xlsx
```

## 🌍 Déploiement

### Option 1: Render.com (Recommandé)

Suivez le guide complet dans [DEPLOYMENT_RENDER.md](./DEPLOYMENT_RENDER.md)

**Avantages:**
- Gratuit (750h/mois)
- Déploiement en 10 minutes
- HTTPS automatique
- URL publique pour toute l'équipe

### Option 2: Autres plateformes

L'application est compatible avec:
- Railway.app
- Fly.io
- Heroku
- DigitalOcean
- AWS / Azure / GCP

## 📥 Export Excel

L'export Excel préserve **parfaitement** le format original:
- ✅ Formatage (couleurs, bordures, polices)
- ✅ Formules Excel (colonnes calculées)
- ✅ Structure des onglets
- ✅ Paramètres et configurations

Le fichier généré est **prêt à envoyer au client**.

## 🔧 Technologies Utilisées

- **Backend**: Node.js v18+, Express.js
- **Base de données**: SQLite (via sqlite3)
- **Excel**: ExcelJS (lecture/écriture)
- **Authentification**: JWT (jsonwebtoken) + bcrypt
- **Upload de fichiers**: Multer

## 📝 Prochaines Étapes

### Option A: Créer un Frontend
Un frontend React pourrait être ajouté pour:
- Interface de login graphique
- Navigation par onglets
- Formulaires pour répondre aux questions
- Dashboard avec progression
- Bouton d'export Excel

### Option B: Utiliser l'API directement
L'API peut être utilisée avec:
- Postman / Insomnia
- Scripts Python / Node.js
- Intégration dans un système existant

## 🤝 Contribution

Pour ajouter des fonctionnalités:
1. Créer une branche
2. Faire vos modifications
3. Tester localement
4. Commit et push

## 📄 Licence

Projet interne Sephora.

## 🆘 Support

Consultez les guides:
- [QUICK_START.md](./QUICK_START.md) - Démarrage rapide
- [DEPLOYMENT_RENDER.md](./DEPLOYMENT_RENDER.md) - Déploiement
- [BACKEND_COMPLETE.md](./BACKEND_COMPLETE.md) - Détails du backend

## 📞 Contact

Pour questions ou support, contactez l'équipe de développement.

---

**Status**: ✅ Backend complet et fonctionnel | 🚧 Frontend à créer (optionnel)
