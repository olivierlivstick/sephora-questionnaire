# 🚀 COMMENCEZ ICI

## Bienvenue dans l'Application Sephora Questionnaire!

Cette application vous permet de remplir le questionnaire de sécurité Sephora de manière collaborative.

---

## ⚡ Démarrage Rapide (5 minutes)

### Étape 1: Ouvrir un terminal

Ouvrez le Terminal sur votre Mac.

### Étape 2: Aller dans le dossier backend

```bash
cd "/Users/olivieradler/Desktop/PROJETS/reviews Sephora/sephora-questionnaire/backend"
```

### Étape 3: Installer les dépendances (première fois seulement)

```bash
npm install --cache /tmp/npm-cache
```

⏱️ Cela prend environ 30 secondes.

### Étape 4: Initialiser la base de données (première fois seulement)

```bash
node scripts/init-data.js
```

Ceci va:
- ✅ Créer la base de données SQLite
- ✅ Importer les 191 questions du questionnaire Sephora
- ✅ Créer 4 comptes utilisateurs de test

### Étape 5: Démarrer le serveur

```bash
npm run dev
```

Vous devriez voir:
```
🚀 Sephora Questionnaire API Server
📡 Server running on port 5000
🌍 Environment: development
```

✅ **Le serveur est maintenant en marche!**

---

## 🧪 Tester que ça fonctionne

### Test 1: Health Check

Ouvrez un **nouveau terminal** et exécutez:

```bash
curl http://localhost:5000/health
```

Vous devriez voir: `{"status":"ok","message":"Sephora Questionnaire API is running"}`

### Test 2: Se connecter

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Vous devriez recevoir un token JWT.

### Test 3: Voir les statistiques

```bash
curl http://localhost:5000/api/questionnaire/stats
```

Vous verrez le nombre de questions et le pourcentage de complétion.

### Test 4: Exporter le questionnaire Excel

```bash
curl http://localhost:5000/api/excel/export \
  --output questionnaire-export.xlsx
```

Un fichier `questionnaire-export.xlsx` sera créé. Ouvrez-le avec Excel pour vérifier!

---

## 👥 Comptes Disponibles

| Username | Password   | Rôle         |
|----------|------------|--------------|
| admin    | admin123   | Administrateur |
| olivier  | olivier123 | Utilisateur  |
| paul     | paul123    | Utilisateur  |
| imane    | imane123   | Utilisateur  |

---

## 📖 Documentation

- **[README.md](./README.md)** - Documentation complète
- **[QUICK_START.md](./QUICK_START.md)** - Guide de démarrage détaillé
- **[DEPLOYMENT_RENDER.md](./DEPLOYMENT_RENDER.md)** - Déployer sur Internet
- **[RESUME.md](./RESUME.md)** - Résumé du projet

---

## 🌍 Rendre l'Application Accessible à d'Autres

### Option 1: Partage Local (même réseau)

Si votre équipe est sur le **même réseau WiFi**:

1. Trouvez votre IP locale:
```bash
ipconfig getifaddr en0
```

2. Partagez cette URL avec votre équipe:
```
http://VOTRE_IP:5000
```

Par exemple: `http://192.168.1.42:5000`

⚠️ **Important**: Votre Mac doit rester allumé et connecté au réseau.

### Option 2: Déployer sur Render.com (Recommandé)

Pour rendre l'application accessible de **n'importe où**:

1. Suivez le guide: **[DEPLOYMENT_RENDER.md](./DEPLOYMENT_RENDER.md)**
2. Temps nécessaire: **10 minutes**
3. Coût: **Gratuit** (750h/mois)
4. Résultat: Une URL publique comme `https://sephora-quest.onrender.com`

---

## 🎯 Utilisation de l'API

### Endpoints Principaux

**Authentification:**
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/register` - Créer un compte

**Questionnaire:**
- `GET /api/questionnaire/sheets` - Liste des onglets
- `GET /api/questionnaire/sheets/:id/questions` - Questions d'un onglet
- `POST /api/questionnaire/questions/:id/response` - Sauvegarder une réponse
- `GET /api/questionnaire/stats` - Statistiques de progression

**Excel:**
- `GET /api/excel/export` - Télécharger le questionnaire complété
- `POST /api/excel/import` - Importer un nouveau questionnaire

### Exemples avec curl

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Obtenir les onglets:**
```bash
curl http://localhost:5000/api/questionnaire/sheets
```

**Sauvegarder une réponse:**
```bash
curl -X POST http://localhost:5000/api/questionnaire/questions/1/response \
  -H "Content-Type: application/json" \
  -d '{
    "response_text": "Notre politique de sécurité est disponible",
    "user_id": 1
  }'
```

---

## ❓ Problèmes Courants

### Le serveur ne démarre pas

**Erreur:** `Cannot find module`
**Solution:**
```bash
cd backend
rm -rf node_modules
npm install --cache /tmp/npm-cache
```

### Port 5000 déjà utilisé

**Erreur:** `EADDRINUSE: address already in use`
**Solution:**
```bash
# Tuer le processus qui utilise le port 5000
lsof -ti:5000 | xargs kill -9
```

### Base de données vide

**Solution:** Réinitialiser la base de données:
```bash
cd backend
rm -rf database/
node scripts/init-data.js
```

---

## 🆘 Besoin d'Aide?

1. Consultez la [documentation complète](./README.md)
2. Vérifiez les logs du serveur dans le terminal
3. Assurez-vous que Node.js est installé: `node --version`

---

## 🎉 Prêt à Commencer!

Maintenant que le serveur fonctionne, vous pouvez:

1. **Utiliser l'API avec Postman/Insomnia** pour remplir le questionnaire
2. **Développer un frontend** React pour une interface graphique
3. **Déployer sur Render.com** pour un accès à distance
4. **Intégrer dans un système existant** via l'API REST

---

**Question? Consultez [RESUME.md](./RESUME.md) pour un aperçu complet du projet.**
