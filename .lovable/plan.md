# Plan d'implémentation

Beaucoup de sujets — je propose de découper en 4 lots pour livrer proprement, en gardant chaque étape testable. Dites-moi lesquels prioriser (ou "tout") et je démarre.

## Lot 1 — Réalisations & Contact (autonome, sans dépendance externe)

**Page /realisations enrichie**
- Filtres par catégorie (Web, ERP, Réseau, Éducation, Cybersécurité) branchés sur `projects.category`
- Grille cards avec capture d'écran, badges technologies, résultats chiffrés
- Ajouter colonnes `technologies text[]` et `results jsonb` à la table `projects` (migration + GRANT)
- Page détail `/realisations/$slug` : galerie, stack technique, KPIs "avant/après"

**Formulaire /contact finalisé**
- Validation Zod (nom, email, téléphone FR/SN, message ≥ 20 car., type projet, budget)
- Champs obligatoires marqués, messages d'erreur inline, focus visible
- Après envoi : insertion `contacts` + boutons "Continuer sur WhatsApp" (wa.me pré-rempli) et "Ouvrir mail" (mailto pré-rempli)
- Anti-spam honeypot + rate-limit côté trigger DB

## Lot 2 — CRM (nécessite connecteur)

Deux options pour "enregistrer automatiquement les demandes" — dites laquelle :

- **A. HubSpot / Zoho CRM / Pipedrive** via connecteur Lovable
  Chaque soumission → server function qui pousse un Lead/Contact dans le CRM choisi. Je dois lier le connecteur (`standard_connectors--connect`).
- **B. CRM interne Lovable Cloud** (déjà en place via `contacts` + admin)
  J'ajoute pipeline `status` (new → qualified → won/lost), notes, assignation, et notification email à l'équipe.

## Lot 3 — Accessibilité mobile & performance 3D

**A11y**
- Anneaux focus visibles (`focus-visible:ring-2 ring-cyber-cyan ring-offset-2`) sur tous les CTAs
- Contraste : passer les textes secondaires clairs sur fond navy en `text-white/80` minimum (AA)
- Tailles police mobile ≥ 16px pour le body, min-h 44px sur tous les tap targets
- Skip-link "Aller au contenu", `<main>` unique, navigation clavier vérifiée

**Perf animations**
- `DataCube3D` : passer les rotations en `transform` pur (déjà OK) + `will-change: transform`, réduire les orbites de 5 → 3 nodes sur mobile via `useIsMobile`
- `ParticleField` : réduire densité automatiquement sur mobile (36 → 14), passer les particules en `translate3d` GPU
- Ajouter `IntersectionObserver` pour mettre en pause les animations hors viewport
- Bouton toggle "Réduire les animations" persistant en localStorage, en plus du respect natif `prefers-reduced-motion`

## Lot 4 — Cube interactif + Timeline + CTA intégré

**Cube contrôlable**
- Rotation suit le mouvement de la souris au survol (parallax léger)
- Drag tactile sur mobile (framer-motion `drag` avec inertie)
- Molette = zoom limité (scale 0.9 → 1.15)
- Clic sur une face → highlight + panneau latéral décrivant la brique (Datacenter, Cloud, IA…)

**Timeline "Transformation digitale"**
- 5 étapes : Audit → Conception → Build → Déploiement → Support
- Cartes 3D qui s'inclinent au scroll via `useScroll` + `useTransform`
- Progression synchronisée avec un rail cyan animé
- Chaque carte pousse un CTA contextuel

**CTA intégré au 3D**
- Overlay "Demander un devis" apparaissant après 3s d'interaction avec le cube
- Bouton flottant sur la face active
- Tracking : chaque clic depuis le cube → `source: "cube3d"` dans `contacts.metadata` pour mesurer la conversion

## Détails techniques

- **Migrations SQL** : `ALTER TABLE projects ADD COLUMN technologies text[], results jsonb`; ajout `metadata jsonb` sur `contacts`; policy inchangée
- **Server functions** : `submitContact.functions.ts` (Zod + insert + push CRM si connecteur), `listProjects.functions.ts` (filtre category, published only)
- **Composants nouveaux** : `ProjectFilters.tsx`, `ProjectCard.tsx`, `ContactForm.tsx` (refactor), `Timeline3D.tsx`, `MotionToggle.tsx`, `useReducedMotionPref.ts`
- **Composants modifiés** : `DataCube3D.tsx` (interactions), `ParticleField.tsx` (mobile density), `Header.tsx` (skip-link), `index.tsx` (Timeline3D + CTA cube)
- **Dépendances** : aucune nouvelle (framer-motion + zod déjà présents)

## Ordre proposé

1. Lot 1 (Réalisations + Contact) — impact business immédiat
2. Lot 3 (a11y + perf mobile) — qualité perçue
3. Lot 4 (cube interactif + timeline) — effet "wow"
4. Lot 2 (CRM externe si souhaité) — dépend du choix A/B

## Questions bloquantes

1. **CRM** : Lot 2 option A (CRM externe, lequel ?) ou B (CRM interne Lovable) ?
2. **WhatsApp** : quel numéro utiliser pour le lien `wa.me` ?
3. **Email de contact** : quelle adresse pour le `mailto` et les notifications ?
4. On y va sur tout, ou je démarre par le Lot 1 pendant que vous répondez sur le CRM ?
