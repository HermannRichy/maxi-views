# Webhook FedaPay — Guide de configuration

Ce guide couvre uniquement la création et la configuration du webhook FedaPay pour ce projet.
Pour le fonctionnement global des paiements, voir `docs/fedapay.md`.

---

## Vue d'ensemble

```
Client (navigateur)
    │
    ▼
FedaPay Checkout  ──paiement approuvé──►  FedaPay
                                              │
                                    POST /api/wallet/callback
                                              │
                                              ▼
                                       Vérification signature
                                              │
                                              ▼
                                     Crédit solde utilisateur
```

Le webhook est le **seul mécanisme fiable** pour créditer le solde.
Le redirect navigateur (`GET /api/wallet/callback`) ne crédite rien — il redirige
simplement l'utilisateur vers `/dashboard/wallet`.

---

## Étape 1 — Créer le webhook dans le tableau de bord FedaPay

1. Connecte-toi sur [app.fedapay.com](https://app.fedapay.com) (ou sandbox: [sandbox-app.fedapay.com](https://sandbox-app.fedapay.com))
2. Menu latéral → **Webhooks** → **Nouveau Webhook**
3. Remplis le formulaire :

| Champ | Valeur |
|---|---|
| **URL de destination** | `https://<ton-domaine>/api/wallet/callback` |
| **Vérification SSL** | Activée (obligatoire en production) |
| **Désactiver sur erreur** | Désactivé (recommandé pour le debug) |
| **Événements** | `transaction.approved`, `transaction.declined`, `transaction.canceled`, `transaction.expired`, `transaction.deleted`, `transaction.refunded` |

4. Clique sur **Créer**

> ⚠️ En développement local, FedaPay ne peut pas atteindre `localhost`.
> Utilise un tunnel comme [ngrok](https://ngrok.com) :
> ```
> ngrok http 3000
> ```
> Puis utilise l'URL HTTPS fournie par ngrok comme URL de destination.

---

## Étape 2 — Récupérer le secret de signature

C'est la clé qui permet de vérifier que le webhook vient bien de FedaPay.

1. Dans le tableau de bord → **Webhooks** → clique sur ton webhook
2. Onglet **Workbench**
3. Clique sur **Click to reveal** pour afficher le secret

Le secret ressemble à : `wh_sandbox_xxxxxxxxxxxxxxxx` (sandbox) ou `wh_xxxxxxxxxxxxxxxx` (live)

> ⚠️ Ce secret est **différent** de ta clé API secrète (`sk_...`).
> Ne les confonds pas.

---

## Étape 3 — Configurer les variables d'environnement

Dans ton fichier `.env` à la racine du projet :

```env
# Clé publique FedaPay (utilisée par le widget Checkout.js côté client)
NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY=pk_sandbox_...

# Clé secrète FedaPay (utilisée pour les appels API serveur)
FEDAPAY_SECRET_KEY=sk_sandbox_...

# Secret de signature webhook (récupéré à l'étape 2)
FEDAPAY_WEBHOOK_SECRET=wh_sandbox_...

# URL publique de l'app (utilisée pour les redirects)
NEXT_PUBLIC_APP_URL=https://<ton-domaine>
```

> ⚠️ Ne préfixe jamais `FEDAPAY_SECRET_KEY` ou `FEDAPAY_WEBHOOK_SECRET` avec `NEXT_PUBLIC_`.
> Ces variables ne doivent jamais être exposées au navigateur.

---

## Étape 4 — Comprendre la vérification de signature

FedaPay signe chaque webhook avec l'en-tête `X-FEDAPAY-SIGNATURE`.

### Format de l'en-tête

```
X-FEDAPAY-SIGNATURE: t=1753142400,s=a3f8c2...
```

| Partie | Description |
|---|---|
| `t` | Timestamp Unix de l'envoi (anti-replay) |
| `s` | HMAC-SHA256 calculé sur `timestamp.payload` |

### Calcul de la signature

FedaPay signe la concaténation `"<timestamp>.<body_brut>"`, pas seulement le body :

```
HMAC-SHA256(secret, "1753142400.{\"name\":\"transaction.approved\",...}")
```

> ⚠️ C'est pourquoi il faut lire le body **avant** de le parser en JSON,
> et passer le texte brut à la vérification.

### Utiliser la librairie officielle (recommandé)

Installe le package officiel :

```bash
pnpm add fedapay
```

Puis dans `route.ts` :

```ts
import { Webhook } from 'fedapay';

const sig     = req.headers.get('x-fedapay-signature');
const payload = await req.text();

const event = Webhook.constructEvent(payload, sig, process.env.FEDAPAY_WEBHOOK_SECRET);
// event.name   → "transaction.approved"
// event.entity → objet transaction FedaPay
```

`constructEvent` gère automatiquement :
- Le parsing du header `t=...,s=...`
- Le calcul HMAC sur `timestamp.payload`
- La vérification de la tolérance (5 minutes par défaut)
- Les erreurs de signature

---

## Étape 5 — Structure du payload reçu

```json
{
  "name": "transaction.approved",
  "entity": {
    "id": 12345,
    "status": "approved",
    "amount": 5000,
    "currency": { "iso": "XOF" },
    "custom_metadata": {
      "reference": "DEP_clxxxx_1753142400000"
    },
    "customer": {
      "email": "user@example.com"
    }
  }
}
```

| Champ | Utilisation dans ce projet |
|---|---|
| `name` | Filtre les événements `transaction.*` |
| `entity.status` | voir tableau de couverture ci-dessous |
| `entity.custom_metadata.reference` | Retrouve la `Transaction` en base |

### Couverture des événements `transaction.*`

| Événement FedaPay | `entity.status` | Action dans l'app |
|---|---|---|
| `transaction.approved` | `approved` | ✅ COMPLETED + crédit solde |
| `transaction.declined` | `declined` | ✅ FAILED |
| `transaction.canceled` | `canceled` | ✅ FAILED |
| `transaction.expired` | `expired` | ✅ FAILED (dépôt expiré sans paiement) |
| `transaction.deleted` | `deleted` | ✅ FAILED (supprimée côté FedaPay) |
| `transaction.refunded` | `refunded` | ✅ FAILED + solde décrémenté |
| `transaction.created` | `pending` | ✅ Ignoré (créée par notre API) |
| `transaction.transferred` | `transferred` | ✅ Ignoré (virement marchand, pas user) |

Les événements `payment_request.*`, `payout.*`, `customer.*` et `account.*`
ne concernent pas les dépôts wallet — ils sont tous ignorés proprement
par le filtre `!eventName.startsWith("transaction.")`.

> ⚠️ **Limite connue sur les remboursements** : le schéma Prisma ne dispose pas d'un
> statut `REFUNDED`. Un remboursement est donc enregistré comme `FAILED` et le solde
> est décrémenté. Si le solde de l'utilisateur est inférieur au montant remboursé
> (cas rare), il peut devenir négatif — à surveiller et gérer manuellement.

> Le montant crédité est toujours celui stocké en base (champ `Transaction.amount`),
> **jamais** celui du payload webhook — par mesure de sécurité.

---

## Étape 6 — Tester le webhook

### Via le tableau de bord FedaPay

1. Tableau de bord → **Webhooks** → ton webhook → onglet **Logs**
2. Clique sur **Re-déclencher** sur n'importe quel événement passé
3. Vérifie la réponse : doit être `200 { "ok": true }`

### Manuellement avec curl

```bash
# Récupère un vrai header de signature depuis les logs FedaPay
curl -X POST https://<ton-domaine>/api/wallet/callback \
  -H "Content-Type: application/json" \
  -H "X-FEDAPAY-SIGNATURE: t=<timestamp>,s=<signature>" \
  -d '{"name":"transaction.approved","entity":{"status":"approved","custom_metadata":{"reference":"DEP_xxx"}}}'
```

### Réponses attendues

| Situation | Code | Body |
|---|---|---|
| Paiement approuvé (première fois) | `200` | `{ "ok": true }` |
| Paiement déjà traité (idempotence) | `200` | `{ "ok": true, "message": "Déjà traité" }` |
| Décliné / Annulé / Expiré / Supprimé | `200` | `{ "ok": true, "message": "Paiement échoué enregistré" }` |
| Remboursement | `200` | `{ "ok": true, "message": "Remboursement enregistré, solde décrémenté" }` |
| Événement non-transaction (ignoré) | `200` | `{ "ok": true, "message": "Événement ignoré" }` |
| Signature invalide | `400` | `{ "error": "Signature invalide" }` |
| Timestamp trop ancien (> 5 min) | `400` | `{ "error": "Timestamp trop ancien..." }` |
| Secret manquant en `.env` | `503` | `{ "error": "Webhook FedaPay non configuré" }` |
| Référence inconnue en base | `404` | `{ "error": "Transaction inconnue" }` |

---

## Checklist finale

- [ ] Webhook créé dans le tableau de bord FedaPay (sandbox d'abord)
- [ ] URL de destination correcte (`/api/wallet/callback`)
- [ ] SSL activé sur l'URL de destination
- [ ] Événements sélectionnés : `transaction.approved`, `transaction.declined`, `transaction.canceled`, `transaction.expired`, `transaction.deleted`, `transaction.refunded`
- [ ] Secret de signature copié dans `FEDAPAY_WEBHOOK_SECRET`
- [ ] Clé publique dans `NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` défini avec le bon domaine
- [ ] Test avec Re-déclencher → réponse `200`
- [ ] Vérification en base : `Transaction.status = COMPLETED` et `User.balance` incrémenté

---

## Récapitulatif des fichiers concernés

| Fichier | Rôle |
|---|---|
| `src/app/api/wallet/deposit/route.ts` | Crée la `Transaction PENDING` et renvoie la `reference` |
| `src/app/api/wallet/callback/route.ts` | Reçoit le webhook, vérifie la signature, crédite le solde |
| `src/app/api/wallet/cancel/route.ts` | Marque une transaction `FAILED` si l'utilisateur annule |
| `src/app/dashboard/wallet/page.tsx` | Lance le widget FedaPay Checkout.js |
| `src/proxy.ts` | Déclare `/api/wallet/callback` comme route publique (pas d'auth Clerk) |