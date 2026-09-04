# 🚀 Guide de Déploiement en Production (Vercel & Cloud)

Ce guide vous accompagne pas à pas pour déployer votre plateforme académique en ligne, gratuitement et en toute sécurité.

---

## Option Recommandée : Déploiement sur Vercel + Neon (ou Supabase)
*Plateforme officielle de Next.js, 100% gratuite, certificat SSL (HTTPS) automatique et zéro maintenance serveur.*

### Étape 1 : Obtenir une base de données PostgreSQL gratuite
1. Rendez-vous sur **[Neon.tech](https://neon.tech)** (ou [Supabase.com](https://supabase.com)) et créez un compte gratuit.
2. Créez un nouveau projet (ex: `plateforme-scolaire`).
3. Copiez la chaîne de connexion fournie :
   ```
   postgresql://alex:AbCdEfGh123@ep-sample-123.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

### Étape 2 : Configurer le projet pour PostgreSQL
Dans votre terminal de projet, exécutez la commande suivante :
```bash
npm run db:use:postgres
```
*Cette commande configure automatiquement `prisma/schema.prisma` pour PostgreSQL.*

Poussez ensuite le schéma vers votre base de données en ligne :
```bash
# Remplacez par votre URL Neon ou Supabase
npx prisma db push
```

### Étape 3 : Déposer votre code sur GitHub
1. Créez un nouveau dépôt sur [GitHub](https://github.com/new) (public ou privé).
2. Poussez votre code :
   ```bash
   git add .
   git commit -m "Production ready release"
   git branch -M main
   git remote add origin https://github.com/VOTRE_PSEUDO/VOTRE_REPO.git
   git push -u origin main
   ```

### Étape 4 : Déployer en 1 clic sur Vercel
1. Rendez-vous sur **[Vercel.com](https://vercel.com)** et connectez-vous avec GitHub.
2. Cliquez sur **"Add New..."** > **"Project"**.
3. Sélectionnez votre dépôt GitHub.
4. Dans la section **Environment Variables**, ajoutez les 3 variables suivantes :
   - `DATABASE_URL` : Votre URL de connexion Neon / Supabase (avec `?sslmode=require`)
   - `JWT_SECRET` : Une clé secrète aléatoire et longue (ex: générée avec `openssl rand -hex 32`)
   - `NEXT_PUBLIC_APP_URL` : L'URL que Vercel vous attribue (ex: `https://votre-projet.vercel.app`)
5. Cliquez sur **Deploy** !
6. En moins de 2 minutes, votre application est en ligne avec un lien HTTPS sécurisé.

---

## Option Alternative : Déploiement VPS avec Docker
*Pour héberger sur votre propre serveur (Hostinger, OVH, DigitalOcean, Hetzner...)*

1. Transférez les fichiers du projet sur votre serveur.
2. Définissez vos variables dans un fichier `.env` sur le serveur :
   ```bash
   NODE_ENV=production
   DATABASE_URL=file:/app/prisma/dev.db
   JWT_SECRET=votre-cle-secrete-tres-longue
   NEXT_PUBLIC_APP_URL=https://votre-domaine.com
   ```
3. Lancez le conteneur en arrière-plan :
   ```bash
   docker compose up -d --build
   ```
4. L'application tourne sur le port `3000` avec persistance des données dans le volume Docker `app_db_data`.

---

## 🛡️ Mesures de Sécurité Intégrées

- **Anti-Clickjacking** : En-tête `X-Frame-Options: DENY` interdisant l'affichage en iframe malveillante.
- **Anti-MIME Sniffing** : En-tête `X-Content-Type-Options: nosniff`.
- **Force HTTPS** : `Strict-Transport-Security` (HSTS) activé pour forcer le chiffrement SSL.
- **Protection Anti-Bruteforce** : Limiteur de débit (Rate Limiter) par adresse IP sur `/api/auth/login`, `/api/auth/register` et `/api/auth/forgot-password`.
- **Cloisonnement des Données** : Chaque requête vérifie l'identité de l'enseignant pour empêcher tout accès non autorisé à d'autres classes ou élèves.
- **Protection des Téléversements** : Contrôle strict de la taille des fichiers Excel (max 5 Mo) et analyse sécurisée en mémoire.
