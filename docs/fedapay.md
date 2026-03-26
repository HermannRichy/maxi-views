# Documentation FedaPay (paiements portefeuille)

Ce projet utilise **FedaPay Checkout** côté client (widget `checkout.js`) pour initier le paiement, et un **webhook serveur** pour confirmer le paiement et créditer le solde utilisateur de façon sécurisée.

## 1) Ce que fait l’application

- **Création d’un dépôt**: `POST /api/wallet/deposit`
  - Crée une transaction interne en base (`Transaction`) au statut `PENDING`
  - Renvoie au front `reference`, `amount`, et les infos client (email / prénom)
- **Ouverture du checkout FedaPay**: page `src/app/dashboard/wallet/page.tsx`
  - Charge `https://cdn.fedapay.com/checkout.js`
  - Lance `window.FedaPay.init({ public_key, transaction, customer, onComplete })`
  - Passe `custom_metadata.reference` afin que le webhook puisse retrouver la transaction interne
- **Confirmation/Crédit via webhook**: `POST /api/wallet/callback` (route publique)
  - Vérifie la **signature** `x-fedapay-signature` (HMAC SHA-256)
  - Récupère `entity.custom_metadata.reference` et `entity.status`
  - Si `approved`:
    - Passe la transaction interne en `COMPLETED`
    - Incrémente `user.balance` du montant de la transaction (montant pris depuis la DB, pas depuis le webhook)
  - Si statut d’échec terminal (`declined|canceled|cancelled|failed`):
    - Passe la transaction interne en `FAILED`
  - Sinon:
    - Ignore (statut non terminal)

## 2) À faire côté FedaPay (tableau de bord)

### Créer / configurer le compte

- Crée un compte FedaPay et complète la configuration de base (profil marchand, informations légales si demandé).
- Active les moyens de paiement nécessaires (Mobile Money / carte), selon ton pays / ton activité.

### Récupérer les clés API

Tu as besoin de **2 clés** (et souvent d’un secret de signature webhook séparé):

- **Clé publique** (exposée au navigateur): utilisée par Checkout (front)
  - Variable attendue: `NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY`
- **Clé secrète webhook (signing secret)**: utilisée pour **vérifier la signature du webhook**
  - Variable attendue: `FEDAPAY_WEBHOOK_SECRET`

Optionnel (si tu utilises le SDK Node / appels API serveur):
- **Clé API secrète** (serveur uniquement): utilisée pour appeler l’API FedaPay
  - Variable suggérée: `FEDAPAY_SECRET_KEY`

Important:
- **Ne mets jamais** la clé secrète dans une variable `NEXT_PUBLIC_*`.
- En environnement **sandbox**, utilise des clés sandbox/test.
- En production, utilise des clés live.

### Configurer le webhook

Dans FedaPay, ajoute une URL de webhook pointant vers:

- **Production**: `https://<ton-domaine>/api/wallet/callback`
- **Développement** (si exposé via tunnel): `https://<ton-tunnel>/api/wallet/callback`

Recommandations:
- Configure les événements liés aux transactions (ex: approbation/échec). L’application ignore tout événement qui ne commence pas par `transaction.` et se base sur `entity.status`.
- Vérifie que FedaPay envoie l’en-tête `x-fedapay-signature`.

### URL de retour (redirect)

Le projet accepte aussi `GET /api/wallet/callback` mais **ne crédite rien** sur un redirect (uniquement redirection vers `/dashboard/wallet`).  
La confirmation se fait via le webhook serveur.

## 3) Configuration du projet (variables d’environnement)

Ajoute ces variables dans ton `.env` (racine du projet).

```env
# URL publique de l'app (utilisée pour les redirects serveur)
NEXT_PUBLIC_APP_URL=https://<ton-domaine>

# FedaPay
FEDAPAY_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY=pk_...
```

Notes:
- `NEXT_PUBLIC_APP_URL` doit être la base URL publique (pas une URL locale) en prod.
- Le projet contient aussi `FEDAPAY_ENVIRONMENT` et `FEDAPAY_APP_ID` dans ton `.env` actuel, mais le code montré ici ne s’en sert pas. Garde-les uniquement si tu en as besoin ailleurs.
- Assure-toi que **sandbox vs live** est cohérent: si tu es en sandbox, n’utilise pas une `pk_live_...`.

## 4) Checklist de test (sandbox → prod)

### Test de bout en bout (sandbox)

- Sur `/dashboard/wallet`, initie un dépôt.
- Vérifie qu’une `Transaction` est créée en DB avec:
  - `type = CREDIT`
  - `status = PENDING`
  - `reference = DEP_<userId>_<timestamp>`
- Complète le paiement dans le widget.
- Vérifie que FedaPay envoie le webhook:
  - Réponse attendue: `{ ok: true }`
- Vérifie en DB:
  - transaction `status = COMPLETED`
  - `user.balance` a augmenté du `amount` de la transaction

### Test des retries (idempotence)

Les webhooks peuvent être renvoyés plusieurs fois:
- si la transaction est déjà `COMPLETED`, l’API renvoie `Déjà traité` et ne recrédite pas.

### Test des échecs

- Ferme le widget avant paiement:
  - le front appelle `POST /api/wallet/cancel`
  - la transaction `PENDING` peut être marquée `FAILED`
- Si FedaPay notifie un statut terminal d’échec:
  - le webhook marque `FAILED`

## 5) Sécurité et bonnes pratiques (à ne pas ignorer)

- **Signature webhook obligatoire**: sans `FEDAPAY_WEBHOOK_SECRET`, l’endpoint webhook renvoie `503` (c’est volontaire).
- **Ne crédite jamais** le solde sur un signal front (toast, redirect, etc.). Ici le crédit est serveur-only.
- **Secrets**:
  - `.env` doit rester hors git (c’est déjà le cas via `.gitignore` qui ignore `.env*`)
  - Si des secrets ont été exposés, **rotate** immédiatement les clés (FedaPay/Clerk/DB/Resend).

## 6) Fichiers / routes utiles dans le code

- Checkout UI: `src/app/dashboard/wallet/page.tsx`
- Init dépôt: `src/app/api/wallet/deposit/route.ts`
- Webhook/redirect: `src/app/api/wallet/callback/route.ts`
- Annulation: `src/app/api/wallet/cancel/route.ts`
- Solde/historique: `src/app/api/wallet/balance/route.ts`

