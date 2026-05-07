# Déploiement cPanel via GitHub

## ⚠️ Avertissement important

Ce projet utilise **TanStack Start avec SSR** (rendu côté serveur). Un hébergement cPanel mutualisé ne peut servir que des fichiers **statiques**. Cela signifie :

- ✅ Les pages publiques (Accueil, Services, Contact, Blog, À propos) peuvent fonctionner en mode client (hydratation JS)
- ⚠️ Les **server functions** TanStack ne tourneront pas
- ⚠️ Les pages `/admin/*` qui dépendent du SSR pour l'auth peuvent être dégradées
- ✅ Supabase (Lovable Cloud) fonctionne car appelé depuis le navigateur

## Procédure

### 1. Build local AVANT push Git
cPanel mutualisé n'exécute pas Node.js. Il faut donc commiter le dossier `dist/` :

```bash
npm install
npm run build
git add dist -f
git commit -m "build: production"
git push
```

> Astuce : Retirez `dist` de `.gitignore` ou utilisez GitHub Actions pour builder automatiquement.

### 2. Configurer Git Version Control dans cPanel
1. cPanel → **Git Version Control** → Create
2. URL du repo GitHub + branche `main`
3. Chemin : `/home1/welldxvv/repositories/well-done`

### 3. Déployer
1. Cliquer **Update from Remote** (récupère le dernier commit)
2. Cliquer **Deploy HEAD Commit** (exécute `.cpanel.yml`)
3. Le contenu de `dist/` est copié dans `/home1/welldxvv/public_html/`

### 4. Variables d'environnement
Créer `/home1/welldxvv/public_html/.env` (non commité) — mais comme Vite injecte les variables `VITE_*` au build, elles sont déjà incluses dans `dist/`.

### 5. Vérifications post-déploiement
- [ ] `https://votredomaine.com` charge la page d'accueil
- [ ] Rafraîchir sur `/contact` → pas de 404 (grâce au `.htaccess`)
- [ ] Console navigateur → pas d'erreur 404 sur les assets `/assets/*.js`
- [ ] HTTPS actif (redirection automatique)

## Fichiers générés

| Fichier | Rôle |
|---|---|
| `.cpanel.yml` | Script de déploiement déclenché par cPanel |
| `public/.htaccess` | Routing SPA + HTTPS + sécurité + cache |

## En cas de problème

- **Page blanche** : vérifier la console navigateur. Probablement un chemin `/assets/` cassé → vérifier `base: '/'` dans Vite (déjà par défaut)
- **404 sur refresh** : `.htaccess` mal copié → vérifier sa présence à la racine de `public_html`
- **CSS/JS non chargés** : permissions fichiers cPanel → `chmod 644` sur les fichiers, `755` sur les dossiers
