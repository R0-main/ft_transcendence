# ft_transcendence 🏓

Jeu Pong multijoueur en temps réel avec authentification OAuth, contrôleurs mobiles et système de classement.

## 🚀 Démarrage rapide

```bash
# Copier et configurer l'environnement
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos clés OAuth

# Construire et lancer
make

# Voir les logs en direct
make logs

# Arrêter
make down
```

## 🌐 Accès
- **Frontend** : https://localhost:8443

⚠️ Certificat SSL auto-signé — accepter l'avertissement du navigateur.

---

## 🔧 Configuration OAuth (obligatoire)

### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com/) → créer un projet OAuth
2. Authorized URLs :
   - `https://localhost:8443` (origins)
   - `https://localhost:8443/api/auth/google/callback` (redirect)
3. Copier Client ID et Secret → ajouter à `backend/.env`

### GitHub OAuth
1. [GitHub Developer Settings](https://github.com/settings/developers) → nouvelle OAuth App
2. Configurer :
   - Homepage: `https://localhost:8443`
   - Callback: `https://localhost:8443/api/auth/github/callback`
3. Copier credentials → ajouter à `backend/.env`

---

## 🏆 Modules 42 — État de réalisation

### 🟨 Major Modules (10 pts)
- ✅ **Use a framework to build the backend** — Fastify + TypeScript
- ✅ **Implementing a remote authentication** — OAuth Google & GitHub
- ✅ **Remote players** — Contrôleurs mobiles via QR codes
- ✅ **Multiplayer (>2 players)** — 2, 3, 4 joueurs simultanés
- ✅ **Implement Two-Factor Authentication (2FA) and JWT** — 2FA TOTP + backup codes + JWT

### 🔵 Minor Modules (5 pts)
- ✅ **Use a framework to build the frontend** — Vanilla JS SPA Router
- ✅ **Use a database** — SQLite avec better-sqlite3
- ✅ **Game customization options** — Paddle, vitesse, score, modes
- ✅ **GDPR compliance** — User anonymization, data export, account deletion
- ✅ **Support on all devices** — Responsive design mobile/tablet/desktop
- ✅ **Expanding browser compatibility** — Chrome, Firefox, Safari, Edge
- ✅ **Supports multiple languages** — Français, Anglais, Espagnol
- ✅ **Accessibility for visually impaired** — Contraste, navigation clavier, ARIA

---

## 📝 Prérequis
- Docker & Docker Compose
- Make
- Git

---

## 🎮 Comment jouer

1. Se connecter via Google ou GitHub
2. Créer une partie (2, 3 ou 4 joueurs)
3. Personnaliser les paramètres (paddle, vitesse, score)
4. Scanner les QR codes avec les téléphones pour devenir contrôleurs
5. Appuyer sur "START GAME" quand tous sont connectés
6. Consulter le leaderboard pour le classement
