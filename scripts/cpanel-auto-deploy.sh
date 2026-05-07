#!/bin/bash
# =====================================================================
# Script de déploiement automatique cPanel
# À exécuter via cron toutes les 5 minutes pour récupérer
# les derniers commits GitHub et déployer dist/ vers public_html/
#
# Installation cron cPanel :
#   */5 * * * * /home1/welldxvv/repositories/well-done-digital-hub/scripts/cpanel-auto-deploy.sh >> /home1/welldxvv/deploy.log 2>&1
# =====================================================================

set -e

REPO_PATH="/home1/welldxvv/repositories/well-done-digital-hub"
DEPLOY_PATH="/home1/welldxvv/public_html"

cd "$REPO_PATH"

# 1. Récupérer le dernier commit depuis GitHub
echo "[$(date)] Pulling latest commit..."
BEFORE=$(git rev-parse HEAD)
git pull origin main
AFTER=$(git rev-parse HEAD)

# 2. Ne déployer que s'il y a un nouveau commit
if [ "$BEFORE" = "$AFTER" ]; then
  echo "[$(date)] Aucun nouveau commit, skip."
  exit 0
fi

echo "[$(date)] Nouveau commit détecté: $AFTER"

# 3. Vérifier que dist/ existe (généré par GitHub Actions)
if [ ! -d "$REPO_PATH/dist" ]; then
  echo "[$(date)] ERREUR: dist/ introuvable. Le build GitHub Actions a-t-il réussi ?"
  exit 1
fi

# 4. Copier dist/* vers public_html/
echo "[$(date)] Déploiement vers $DEPLOY_PATH..."
/bin/cp -R "$REPO_PATH/dist/"* "$DEPLOY_PATH/"

# 5. Copier le .htaccess
if [ -f "$REPO_PATH/public/.htaccess" ]; then
  /bin/cp -f "$REPO_PATH/public/.htaccess" "$DEPLOY_PATH/.htaccess"
fi

echo "[$(date)] ✅ Déploiement terminé avec succès."
