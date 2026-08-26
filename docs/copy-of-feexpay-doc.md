# Bienvenue sur FeexPay !

Tout la doc est disponible sur : https://docs.feexpay.me/

FeexPay est un agrégateur de paiement qui vous permet d'intégrer les méthodes de paiement dans vos applications. Pour commencer, il est nécessaire que vous ayez un compte. Si vous n'en avez pas, vous pouvez le créer ici

Astuce

FeexPay vous permet d'accepter des paiements en quelques minutes seulement. Suivez notre guide de démarrage rapide pour commencer dès maintenant !
Vue d'ensemble
FeexPay est une plateforme de services financiers numériques conçue pour offrir des solutions de paiement adaptées aux besoins des professionnels, des entreprises de toute taille, des boutiques en ligne, ainsi que des organisations publiques et associatives.

Avec une interface conviviale et un déploiement technique rapide, FeexPay permet à la fois de collecter des paiements en ligne et d’envoyer des fonds vers les portefeuilles Mobile Money des utilisateurs. Le système assure une exécution sécurisée des transactions et met à disposition des outils pratiques pour suivre et gérer les flux financiers en toute simplicité.

À qui s'adresse FeexPay ?
Développeurs
API RESTful complète, SDKs multi-langages, documentation technique détaillée et environnement de test sandbox.

E-commerce
Intégration rapide avec les principales plateformes, checkout personnalisable et gestion automatique des commandes.

Entreprises
Facturation automatisée, tableaux de bord analytiques, gestion multi-utilisateurs et support dédié.

ONG & Gouvernements
Solutions de collecte de fonds, traçabilité complète, rapports détaillés et conformité réglementaire.

# Avantages

Accessibilité
Plateforme adaptée pour les particuliers, entreprises, et ONG, permettant une gestion facile des transactions sans compétences techniques avancées. Interface multilingue et support client réactif disponible 7j/7.

Simplicité
Compatible avec des technologies courantes comme Node.js, PHP, Flutter, et React.js, pour une intégration fluide sur les sites web et les plateformes e-commerce. Documentation claire avec exemples de code prêts à l'emploi.

Sécurité
Chiffrement TLS 1.3, authentification à deux facteurs, conformité PCI-DSS niveau 1, et surveillance 24/7 des transactions. Vos données et celles de vos clients sont protégées par les standards les plus stricts de l'industrie.

Intégrations faciles
SDKs officiels pour JavaScript, PHP, React et plus. Plugins prêts à l'emploi pour WooCommerce, Shopify, PrestaShop. Webhooks en temps réel pour synchroniser vos systèmes automatiquement.

Support Mobile Money & Cartes bancaires
Acceptez tous les principaux moyens de paiement : MTN Mobile Money, Moov Money, Orange Money, Visa, Mastercard, et plus.

# Concepts clés

Important

Familiarisez-vous avec ces concepts avant de commencer votre intégration. Ils sont essentiels pour comprendre le fonctionnement de FeexPay.
Environnements et Clés API
Mode Live (Production)

Environnement de production pour traiter de vrais paiements.

• URL : https://api-v2.feexpay.me/api

• Clés commencent par : fp\_

Configuration Webhook
Les webhooks sont essentiels pour recevoir les notifications en temps réel sur l'état de vos transactions. Vous devez configurer votre URL de webhook dans votre tableau de bord FeexPay.

Cycle de vie des Transactions
Une transaction représente un paiement ou un transfert d'argent. Chaque transaction possède un identifiant unique et suit ce cycle de vie :

PENDING
Transaction initiée, en attente de traitement

SUCCESSFUL
Transaction réussie et confirmée

FAILED
Transaction échouée (fonds insuffisants, erreur, etc.)

Collectes (Payin)
Les collectes représentent l'action de recevoir de l'argent de vos clients via différents moyens de paiement (Mobile Money, cartes bancaires, etc.).

Dépôts (Payouts)
Les payouts permettent d'effectuer des dépôts (payouts) transfert directement sur les numéros Mobile Money (Momo) de vos utilisateurs. Cette fonctionnalité est idéale pour les remboursements, les paiements de salaires, les commissions ou toute distribution de fonds vers les portefeuilles mobiles.

Wallets
Votre wallet FeexPay est le compte central où sont crédités tous vos paiements reçus. Vous pouvez consulter votre solde, l'historique des transactions et effectuer des retraits vers votre compte bancaire.

Attention

En mode test (sandbox), utilisez les clés commençant par test*. Les transactions en mode test ne déclenchent pas de vrais paiements. Pour la production, utilisez la clé commençant par fp*.

# Méthodes de paiement

🇧🇯
Bénin
MTN
MTN

Moov
Moov

Celtiis
Celtiis

Coris
Coris

🇧🇫
Burkina Faso
Orange
Orange

Moov
Moov

Wave
Wave

🇨🇮
Côte d'Ivoire
MTN
MTN

Moov
Moov

Wave
Wave

Orange
Orange

🇲🇱
Mali
Mobicash
Mobicash

Orange
Orange

🇸🇳
Sénégal
Orange
Orange

Wave
Wave

Free
Free

🇹🇬
Togo
Togocom
Togocom

Moov
Moov

🇨🇬
Congo Brazzaville
MTN
MTN

Carte bancaire
VISA et MASTERCARD

VISA
VISA

MC
MASTERCARD

# API - Payin

Bienvenue dans la section API Payin de FeexPay. Découvrez comment intégrer nos solutions de paiement dans vos applications.

Limites de montant
Veuillez noter que le montant minimum est de 100 et le maximum est de 2.000.000 XOF

Bénin
Togo
Côte d'Ivoire
Congo Brazzaville
Sénégal
Burkina Faso
Mali
Réseaux disponibles
MTN BENIN
MOOV BENIN
CELTIIS BENIN
CORIS BENIN
MTN Mobile Money Bénin
URL
https://api-v2.feexpay.me/api/transactions/public/requesttopay/mtn
Copier
Méthode
POST

Corps de la requête
Paramètre Statut Description Exemple
phoneNumber Obligatoire Numéro 10 chiffres avec préfixe 01 2290166000000
amount Obligatoire Montant de la transaction 100
shop Obligatoire Identifiant de la boutique Ayg9lkjkhurIvNp
first_name Optionnel Prénom client FeexPay
last_name Optionnel Nom client FeexPay
description Optionnel Sans caractères spéciaux Achat de produit
callback_info Optionnel apiPayin.fieldDescriptions.callbackInfo order_12345
Entetes (Headers)
Ajoutez Authorization: Bearer <votre-api-key>

Important

Sans cet entete, votre requête sera refusée.
Exemple (axios)
javascript

axios({
url: "https://api-v2.feexpay.me/api/transactions/public/requesttopay/mtn",
method: 'post',
headers: {
Authorization: 'Bearer fp_M6tuzYgsYl39d6kJvdaLmYGQcEAWvLRivVhbeK4UCwbDiyMlj9UPMO',
},
data: {
shop: '63e581fe4c35f54de9749c',
amount: 100,
phoneNumber: 2290166000000,
}
});
B) Réponse de la requête
json

{
"reference": "6a00a986-fcb9-4491-93d5-28693034ef95",
"message": "Accepted",
"status": "PENDING",
"amount": 10,
"description": "",
"callback_info": null,
"phoneNumber": "2290167919150"
}

# Statut des payins

Une transaction passe par différents statuts : PENDING, SUCCESSFUL ou FAILED. Utilisez l'API de consultation pour connaître le statut courant.

URL de base
https://api-v2.feexpay.me/api/transactions/public/single/status/
Copier
Exemple (avec référence)
https://api-v2.feexpay.me/api/transactions/public/single/status/51ef087e-7bae-4202-b84e-9a0916bbc564
Copier
Entête obligatoire
Authorization: Bearer <votre-api-key>

Réponse - SUCCESSFUL
json

{
"reference": "63ecaff1-7572-413d-93bb-8cba92bb8c2c",
"amount": 10,
"phoneNumber": "2290167919150",
"status": "SUCCESSFUL",
"callback_info": null,
"responsecode": "SUCCESSFUL",
"responsemsg": "SUCCESSFUL",
"transref": "63ecaff1-7572-413d-93bb-8cba92bb8c2c",
"serviceref": "63ecaff1-7572-413d-93bb-8cba92bb8c2c",
"comment": "",
"reason": "",
"description": "",
"date": "2026-06-10T08:36:35.020Z",
"operator_id": "12243963624"
}
Réponse - FAILED
json

{
"reference": "3d4927ff-c826-43db-a3f5-66dc75a7b07e",
"amount": 100,
"phoneNumber": "2290153037832",
"status": "FAILED",
"callback_info": null,
"responsecode": "FAILED",
"responsemsg": "FAILED",
"transref": "3d4927ff-c826-43db-a3f5-66dc75a7b07e",
"serviceref": "3d4927ff-c826-43db-a3f5-66dc75a7b07e",
"comment": "",
"reason": "LOW_BALANCE_OR_PAYEE_LIMIT_REACHED_OR_NOT_ALLOWED",
"description": "",
"date": "2026-06-10T08:43:56.517Z",
"operator_id": ""
}
Note

Si l'API renvoie PENDING ou IN PENDING STATE, la transaction est toujours en cours et le client n'a pas encore confirmé.
Intégrations front

Lors d'une intégration (JavaScript, WordPress, PHP, React, etc.), un paramètre ref est automatiquement ajouté à votre callback_url. Il s'agit de la référence unique de la transaction. Utilisez-la pour vérifier le statut.

# API - Payout

Cette section regroupe les Payouts par pays et par réseau. Utilisez les onglets pour choisir un pays, puis cliquez sur un réseau pour voir les étapes (URL, méthode, corps, entêtes, exemples).

Attention

Vous pouvez également configurer vous-même la liste d'IP directement depuis votre dashboard dans l'onglet 'IP List'.
Comportement V2 : statut PENDING au lancement

Sur la V2, le lancement d'un payout renvoie immédiatement un statut PENDING. Vous devez ensuite vérifier le statut final (SUCCESSFUL ou FAILED) via la section Statut des payouts.
Bénin
Côte d'Ivoire
Togo
Sénégal
Congo
Burkina Faso
Mali
Réseaux disponibles
MTN/MOOV
CELTIIS BJ
A) Payout Global Bénin (MTN/Moov)
Permet d'effectuer des payouts vers Mobile Money au Bénin (MTN Mobile Money et Moov Money)

URL
https://api-v2.feexpay.me/api/payouts/public/transfer/global
Copier
Méthode
POST

Corps de la requête
Paramètre Statut Description Exemple
phoneNumber Obligatoire Numéro 10 chiffres avec préfixe 01 2290166000000
amount Obligatoire Montant minimum 50 100
shop Obligatoire ID boutique Ayg9lkjkhurIvNp
network Obligatoire Réseau (MTN ou MOOV) MTN
motif Obligatoire Description transaction (30 caractères maximum, pas de caractères spéciaux) FeexPay
callback_info Optionnel Informations additionnelles renvoyées par le webhook order_12345
Entetes (Headers)
Ajoutez Authorization: Bearer <votre-api-key> dans les headers.

Important

Sans cet entête au niveau de votre requête vous ne serez pas autorisé(e) et votre requête n'aboutira pas.
Exemple (axios)
javascript

axios({
url: "https://api-v2.feexpay.me/api/payouts/public/transfer/global",
method: 'post',
headers: {
Authorization: 'Bearer fp_M6tuzYgsYl39d6kJvdaLmYGQcEAWvLRivVhbeK4UCwbDiyMlj9UPMO',
},
data: {
shop: 'Ayg9lkjkhurIvNp',
amount: 100,
phoneNumber: 2290166000000,
network: 'MTN',
motif: 'FeexPay'
}
});
B) Réponse de la requête
json

{
"reference": "a19d2d2d-8635-4489-bb6b-57cf070e5792",
"status": "PENDING",
"message": "Payout request accepted",
"description": "Paiement client",
"phone_number": "2290167919150",
"amount": 10,
"callback_info": null
}

# Statut des payouts

Un payout passe par différents statuts: PENDING, SUCCESSFUL ou FAILED. Utilisez l'API de consultation pour connaître le statut courant.

Important : vérification obligatoire

La vérification du statut est obligatoire pour les payouts. Après avoir lancé un payout (statut PENDING), vous devez impérativement appeler cet endpoint pour confirmer le statut final de la transaction (SUCCESSFUL ou FAILED) avant de considérer l'opération comme terminée.
URL de base
https://api-v2.feexpay.me/api/payouts/status/public/
Copier
Exemple (avec référence)
https://api-v2.feexpay.me/api/payouts/status/public/ff7b2994-1466-4fc7-8216-7fb53a4a8727
Copier
Méthode
GET

Entête obligatoire
Authorization: Bearer <votre-api-key>

Réponse - SUCCESSFUL (exemple)
json

{
"reference": "a19d2d2d-8635-4489-bb6b-57cf070e5792",
"amount": 10,
"phoneNumber": "2290167919150",
"status": "SUCCESSFUL",
"callback_info": null,
"responsecode": "SUCCESSFUL",
"responsemsg": "SUCCESSFUL",
"transref": "a19d2d2d-8635-4489-bb6b-57cf070e5792",
"serviceref": "a19d2d2d-8635-4489-bb6b-57cf070e5792",
"reason": "",
"description": "Paiement client",
"date": "2026-06-10T08:47:45.726Z"
}
Note

Si l'API renvoie PENDING ou IN PENDING STATE, la transaction est toujours en cours.

# API — Historique des transactions

Cette API permet de récupérer l'historique des PayIn et PayOut d'une boutique. Deux modes sont disponibles :

consultation directe, pour une plage courte ;
traitement asynchrone avec résultat envoyé par webhook, recommandé pour les historiques volumineux.
Authentification
Authorization: Bearer <votre-api-key>

Ajoutez toujours cette en-tête. Sans elle, la requête sera refusée.

A. Consulter l'historique directement
URL
https://api-v2.feexpay.me/api/transactions/history
Copier
POST

Cette route renvoie immédiatement les transactions trouvées. Elle est adaptée aux consultations courtes.

Corps de la requête
Paramètre Statut Description Exemple
start_date Obligatoire Date de début incluse, format YYYY-MM-DD 2026-07-01
end_date Obligatoire Date de fin incluse, format YYYY-MM-DD 2026-07-31
shop Obligatoire Identifiant public de la boutique. xP1h6IfiPPJQjHy
type Optionnel PAYIN, PAYOUT ou ALL ALL
status Optionnel PENDING, SUCCESSFUL, FAILED ou ALL SUCCESSFUL
reseau Optionnel Code réseau. Utilisez ALL pour tous les réseaux. MOOV CI
Paramètres reseaux acceptés

ALL
MTN
MOOV
CELTIIS BJ
CORIS
MTN CI
MOOV CI
ORANGE CI
WAVE CI
MTN CG
MOOV TG
TOGOCOM TG
ORANGE SN
FREE SN
WAVE SN
MOOV BF
ORANGE BF
Utilisez ALL pour tous les réseaux à la fois. Les codes doivent être écrits exactement comme ci-dessus, en majuscules.

Règles importantes

La plage de dates ne peut pas dépasser 31 jours.
La réponse est limitée à 500 transactions.
S'il y a plus de 500 résultats, réduisez la plage de dates ou utilisez le traitement asynchrone.
Exemple Axios
javascript

axios({
url: 'https://api-v2.feexpay.me/api/transactions/history',
method: 'post',
headers: {
Authorization: 'Bearer fp_votre_api_key',
},
data: {
start_date: '2026-07-01',
end_date: '2026-07-31',
shop: 'xP1h6IfiPPJQjHy',
type: 'ALL',
status: 'ALL',
reseau: 'ALL',
},
});
Réponse
json

{
"success": true,
"total": 2,
"data": [
{
"reference": "571ABAA9-3BBC-492D-8B7E-97A8A486315B",
"type": "PAYMENT_API",
"status": "SUCCESSFUL",
"amount": 5000,
"reseau": "MOOV CI",
"phone_number": "2250700000000",
"financial_transaction_id": "operator-reference",
"custom_id": "order_12345",
"description": "Achat de produit",
"callback_info": {
"order_id": "order_12345"
},
"reason": null,
"date": "2026-07-30T10:15:00.000Z"
},
{
"reference": "9C2F41D7-58E0-4A1B-BD33-1E7C5A9F0244",
"type": "PAYOUT_API",
"status": "FAILED",
"amount": 12000,
"reseau": "MTN CI",
"phone_number": "2250500000000",
"financial_transaction_id": null,
"custom_id": "payout_98765",
"description": "Remboursement client",
"callback_info": {
"order_id": "payout_98765"
},
"reason": "Insufficient balance",
"date": "2026-07-30T14:42:00.000Z"
}
]
}
Champ type

Le champ type de chaque résultat correspond au à la source de paiement, par exemple PAYMENT_API, PAYOUT_API, FEEX_LINK ou FEEX_PAGE.
B. Demander un historique asynchrone
Utilisez cette route pour les gros volumes. La demande est placée dans une file de traitement, puis FeexPay envoie le résultat à votre webhook.

URL
https://api-v2.feexpay.me/api/transactions/history/async
Copier
POST

Pré-requis

La boutique indiquée dans shop doit posséder une webhook active configurée depuis le dashboard.
Sélectionnez Tous les événements ou l'événement payment_history.
Corps de la requête
Paramètre Statut Description Exemple
start_date Obligatoire Date de début incluse, format YYYY-MM-DD 2026-07-01
end_date Obligatoire Date de fin incluse, format YYYY-MM-DD 2026-07-31
shop Obligatoire Identifiant public de la boutique devant posséder la webhook configurée xP1h6IfiPPJQjHy
type Optionnel PAYIN, PAYOUT ou ALL ALL
status Optionnel PENDING, SUCCESSFUL, FAILED ou ALL ALL
reseau Optionnel Code réseau. Utilisez ALL pour tous les réseaux. ALL
Paramètres reseaux acceptés

ALL
MTN
MOOV
CELTIIS BJ
CORIS
MTN CI
MOOV CI
ORANGE CI
WAVE CI
MTN CG
MOOV TG
TOGOCOM TG
ORANGE SN
FREE SN
WAVE SN
MOOV BF
ORANGE BF
Utilisez ALL pour tous les réseaux à la fois. Les codes doivent être écrits exactement comme ci-dessus, en majuscules.

Exemple Axios
javascript

axios({
url: 'https://api-v2.feexpay.me/api/transactions/history/async',
method: 'post',
headers: {
Authorization: 'Bearer fp_votre_api_key',
},
data: {
start_date: '2026-07-01',
end_date: '2026-07-31',
shop: 'xP1h6IfiPPJQjHy',
type: 'ALL',
status: 'ALL',
reseau: 'ALL',
},
});
Réponse immédiate — 202 Accepted
json

{
"success": true,
"data": {
"request_id": "78fc15b3bff32d60e89f7d87",
"status": "PENDING",
"created_at": "2026-07-31T10:00:00.000Z",
"expires_at": "2026-08-01T10:00:00.000Z"
}
}
À retenir

Conservez request_id pour suivre la demande.
Erreur possible

409 HISTORY_WEBHOOK_NOT_CONFIGURED — aucune souscription à l'événement webhook history pour cette boutique.
C. Suivre une demande asynchrone
URL
https://api-v2.feexpay.me/api/transactions/history/async/78fc15b3bff32d60e89f7d87
Copier
GET

Exemple Axios
javascript

axios({
url: 'https://api-v2.feexpay.me/api/transactions/history/async/78fc15b3bff32d60e89f7d87',
method: 'get',
headers: {
Authorization: 'Bearer fp_votre_api_key',
},
});
Statuts possibles
Statut Description
PENDING Demande enregistrée ou en cours de génération par le worker.
FAILED La génération a échoué.
COMPLETED Résultat disponible et webhook envoyée.
Réponse lorsque le traitement est terminé
json

{
"success": true,
"data": {
"request_id": "78fc15b3bff32d60e89f7d87",
"status": "COMPLETED",
"row_count": 1250,
"processed_rows": 1250,
"result_format": "json",
"result_url": "https://storage.feexpay.me/...",
"error": null,
"expires_at": "2026-08-01T10:00:00.000Z",
"completed_at": "2026-07-31T10:02:15.000Z",
"created_at": "2026-07-31T10:00:00.000Z"
}
}
Expiration du résultat

result_url est temporaire. Téléchargez le fichier avant expires_at.
D. Webhook de résultat
Lorsque le traitement réussit, FeexPay envoie une requête POST vers l'URL webhook configurée pour la boutique.

Événement
payment_history

Exemple de payload
json

{
"request_id": "78fc15b3bff32d60e89f7d87",
"status": "COMPLETED",
"amount": 0,
"type": "PAYMENT_HISTORY",
"date": "2026-07-31T10:02:15.000Z",
"row_count": 2,
"result_format": "json",
"result_url": "https://storage.feexpay.me/...",
"expires_at": "2026-08-01T10:00:00.000Z",
"data": [
{
"reference": "571ABAA9-3BBC-492D-8B7E-97A8A486315B",
"type": "PAYMENT_API",
"status": "SUCCESSFUL",
"amount": 5000,
"reseau": "MOOV CI",
"phone_number": "2250700000000",
"financial_transaction_id": "operator-reference",
"custom_id": "order_12345",
"description": "Achat de produit",
"callback_info": {
"order_id": "order_12345"
},
"reason": null,
"date": "2026-07-30T10:15:00.000Z"
},
{
"reference": "9C2F41D7-58E0-4A1B-BD33-1E7C5A9F0244",
"type": "PAYOUT_API",
"status": "FAILED",
"amount": 12000,
"reseau": "MTN CI",
"phone_number": "2250500000000",
"financial_transaction_id": null,
"custom_id": "payout_98765",
"description": "Remboursement client",
"callback_info": {
"order_id": "payout_98765"
},
"reason": "Insufficient balance",
"date": "2026-07-30T14:42:00.000Z"
}
]
}
Note

La webhook contient directement les données dans data et fournit également result_url pour récupérer le fichier JSON complet.
Pas de webhook en cas d'échec

Aucune webhook n'est envoyée si la génération échoue — interrogez GET .../async/{request_id} pour connaître la raison (champ error).

# ORM Utils

Cette section regroupe les endpoints spéciaux de l'API FeexPay qui ne sont pas directement liés au payin ou au payout, mais qui sont utiles pour la gestion de votre compte et de vos boutiques.

Consulter le solde par boutique
Cet endpoint vous permet de récupérer le solde de votre boutique pour chaque réseau de paiement disponible.

Endpoint
GET
https://api-v2.feexpay.me/api/balance/public/getByShop/{idShop}
Paramètres
Paramètre Type Requis Description
idShop string Obligatoire L'identifiant unique de votre boutique (disponible dans le menu Développeurs de votre dashboard)
En-têtes
Ajoutez l'en-tête d'autorisation : Authorization: Bearer <votre-api-key>

Important

Votre clé API doit être incluse dans l'en-tête Authorization avec le préfixe 'Bearer'.
Exemple de requête (Axios)
javascript

axios({
url: "https://api-v2.feexpay.me/api/balance/public/getByShop/Ayg9lkjkhurIvNp",
method: 'get',
headers: {
Authorization: 'Bearer fp_votre_api_key',
}
});
Exemple de réponse
json

{
"success": true,
"data": {
"success": true,
"data": {
"shop_public_id": "PAjtgouuFlCibjn",
"shop_name": "Dev",
"shop_id": "c1a8136d-195c-49d0-a766-31d4c12016cf",
"balances": {
"MOOV": 0,
"CELTIIS BJ": 0,
"CORIS": 0,
"MTN CI": 0,
"MOOV CI": 0,
"ORANGE CI": 0,
"WAVE CI": 0,
"MTN CG": 0,
"MOOV TG": 0,
"TOGOCOM TG": 0,
"ORANGE SN": 0,
"FREE SN": 0,
"WAVE SN": 0,
"MTN": 10
}
}
},
"last24": null
}
}
Note

Le solde est retourné par réseau. Vous pouvez ainsi voir votre solde pour chaque opérateur (MTN, MOOV, CELTIIS, CORIS, etc.) dans chaque pays.

# Codes d'Erreur

Cette section liste tous les codes d'erreur possibles que vous pouvez rencontrer lors de l'utilisation de l'API FeexPay, ainsi que leurs significations et solutions recommandées.

Conseil Important

Toujours vérifier le champ 'success' dans la réponse avant de traiter les données. Si 'success' est false, consultez l'objet 'error' pour comprendre le problème.
Codes d'Erreur API
Code Signification Description Solution
ERR_INVALID_API_KEY Clé API Invalide La clé API fournie n'est pas valide ou n'existe pas Vérifiez votre clé API dans le dashboard FeexPay
ERR_SHOP_NOT_FOUND Boutique Non Trouvée L'ID de boutique spécifié n'existe pas Vérifiez l'ID de votre boutique dans le menu Développeurs
ERR_INSUFFICIENT_BALANCE Solde Insuffisant Le solde de votre boutique est insuffisant pour cette transaction Rechargez votre boutique ou réduisez le montant de la transaction
ERR_INVALID_PHONE_NUMBER Numéro de Téléphone Invalide Le numéro de téléphone n'est pas valide pour le réseau spécifié Vérifiez le format du numéro et qu'il correspond au bon réseau
ERR_INVALID_AMOUNT Montant Invalide Le montant est soit trop faible, soit trop élevé Respectez les limites de montant (minimum 100, maximum 2.000.000 XOF)
ERR_NETWORK_UNAVAILABLE Réseau Indisponible Le réseau de paiement spécifié est temporairement indisponible Essayez plus tard ou utilisez un autre réseau disponible
ERR_TRANSACTION_FAILED Transaction Échouée La transaction a échoué du côté du fournisseur de paiement Réessayez la transaction ou contactez le support si le problème persiste
ERR_DUPLICATE_TRANSACTION Transaction Dupliquée Une transaction identique existe déjà Vérifiez le statut de la transaction existante avant de réessayer
ERR_IP_NOT_AUTHORIZED IP Non Autorisée L'adresse IP du serveur n'est pas autorisée Ajoutez votre adresse IP dans la liste blanche du dashboard
ERR_PAYOUT_NOT_ENABLED Payout Non Activé Les payouts ne sont pas activés pour cette boutique Contactez le support pour activer les payouts sur votre boutique
Codes d'Erreur FeexLink
Code HTTP Code erreur Message
400 — Renseigner les paramètres obligatoires
404 — Shop not found
404 FEEXLINK_NOT_FOUND Feexlink not found
400 — Feexlink is not active
400 — Feexlink usage limit reached
410 FEEXLINK_EXPIRED Feexlink expiré
400 NETWORK_UNAVAILABLE Réseau non supporté
404 — {channel} channel not configured
Codes d'Erreur Shop (Lookup Public)
Code HTTP Code erreur Message
404 — Shop introuvable
400 — Shop is disabled
Erreurs Public API
Authentication / Token
Code HTTP Code erreur Message
401 UNAUTHORIZED Token invalide ou expiré
403 FORBIDDEN Accès interdit à cette ressource
429 RATE_LIMIT_EXCEEDED Trop de requêtes
403 IP_NOT_ALLOWED IP non autorisée
403 ACCESS_DENIED Pays/réseau bloqué
Initier une transaction (payin)
Code HTTP Code erreur Message
404 — Merchant or Shop not found
404 — Shop is disabled
404 — {channel} channel not configured
400 NETWORK_UNAVAILABLE Réseau non supporté
503 NETWORK_UNAVAILABLE Network under maintenance
502 — Bad Gateway (erreur provider)
400 MISSING_REFERENCE Missing transaction reference
Statut d'une transaction
Code HTTP Code erreur Message
400 MISSING_REFERENCE Reference is required
404 NOT_FOUND Transaction not found
Format des Réponses d'Erreur
Toutes les erreurs suivent ce format standard :

Le champ `code` est présent uniquement pour les erreurs métier qui ont un code explicite. Pour les erreurs de validation (400), le champ `message` peut être un tableau de strings.

Exemple de réponse d'erreur
{
"statusCode": 404,
"message": "Transaction not found",
"code": "NOT_FOUND"
}
Bonnes Pratiques
✓
Toujours gérer les codes HTTP appropriés (4xx pour les erreurs client, 5xx pour les erreurs serveur)
✓
Vérifier toujours le champ 'success' avant de traiter la réponse
✓
Logger les erreurs pour le débogage et le suivi
✓
Afficher des messages d'erreur conviviaux aux utilisateurs finaux

# Webhook

Généralités
Le webhook est une requête POST avec un body JSON, envoyée selon les évènements choisis, depuis FeexPay vers l’URL ou les URLs configurée(s) par le marchand sur son compte. Chaque fois que l’événement choisi se produit, la requête est déclenchée et envoie des informations à votre URL. C’est à vous d’écouter ces requêtes, de les récupérer et de les traiter pour faire vos contrôles côté serveur.

Le payload envoyé par le webhook est un objet JSON contenant les informations essentielles de la transaction : reference, amount, <code>status</code> et callback_info, ainsi que d’autres champs utiles (nom, prénom, email, réseau, etc.).

Exemple de payload reçu pour une transaction échouée
json

{
"reference":"1e636dff-6b81-499e-bf8b-64b4a07a02a8",
"order_id":"1e636dff-6b81-499e-bf8b-64b4a07a02a8",
"status":"FAILED",
"amount":250,
"callback_info":"",
"last_name":"",
"first_name":"",
"email":"lougbegnona@gmail.com",
"type":"Paiement",
"phoneNumber":"2290190877433",
"date":"2026-05-25T10:06:26.662Z",
"reseau":"MTN CI",
"ref_link":"",
"description":"test de 10",
"reason":"PAYER_NOT_FOUND",
"ref_operator":""
}
Exemple de payload reçu pour une transaction réussie
json

{
"reference":"1e636dff-6b81-499e-bf8b-64b4a07a02a8",
"order_id":"1e636dff-6b81-499e-bf8b-64b4a07a02a8",
"status":"SUCCESSFUL",
"amount":250,
"callback_info":"",
"last_name":"",
"first_name":"",
"email":"lougbegnona@gmail.com",
"type":"Paiement",
"phoneNumber":"2290190877433",
"date":"2026-05-25T10:06:26.662Z",
"reseau":"MTN CI",
"ref_link":"",
"description":"test de 10",
"reason":"",
"ref_operator":""
}
Configuration
Vous disposez du menu Webhook dans votre tableau de bord FeexPay. Vous pouvez y paramétrer une URL vers laquelle notre système enverra le payload. Ce payload est un JSON contenant la référence, le montant, le statut et le champ callback_info. Il est envoyé une fois qu’il y a un succès de paiement (ou selon les évènements activés sur votre compte).

Il s’agit d’une requête POST envoyée vers votre URL : vérifiez que votre endpoint accepte bien la méthode POST, qu’il retourne un code HTTP approprié (par ex. 200) et qu’il n’y a pas de middleware ou garde-fou qui bloque la réception du payload.

# Sécurité

Protégez vos transactions et vos données

La sécurité est notre priorité absolue. FeexPay implémente les standards de sécurité les plus stricts de l'industrie pour protéger vos transactions et les données de vos clients.

Chiffrement TLS 1.3
Toutes les communications entre votre serveur et FeexPay sont chiffrées avec TLS 1.3, le protocole de sécurité le plus avancé. Les données sensibles ne transitent jamais en clair sur le réseau.

Conformité PCI-DSS
FeexPay est certifié PCI-DSS niveau 1, le plus haut niveau de certification pour le traitement des paiements par carte bancaire. Vos clients peuvent payer en toute confiance.

Authentification forte
Gestion des équipes via l’ajout des membres par e-mail et attribution d’accès selon les onglets. Gestion fine des permissions pour les membres de l'équipe. Logs d'audit complets.

Détection de fraude
Système de détection de fraude en temps réel basé sur le machine learning. Surveillance 24/7 des transactions suspectes. Blocage automatique des activités malveillantes.

Bonnes pratiques pour les développeurs
Ne jamais exposer les clés secrètes
Vos clés secrètes doivent rester confidentielles et ne jamais être exposées dans le code côté client, les repositories publics ou les logs.

❌ Mauvais exemple

JavaScript

// Dans le frontend - NE JAMAIS FAIRE CECI
const apiKey = 'fp_live \_votre_cle_secrete';

fetch('https://api.feexpay.com/v1/payments', {
headers: { 'Authorization': `Bearer ${apiKey}` }
});
✅ Bon exemple

JavaScript

// Backend uniquement
const apiKey = process.env.feexpay_SECRET_KEY;

// Frontend - utiliser votre propre API
fetch('/api/create-payment', {
method: 'POST',
body: JSON.stringify(paymentData)
});
Utiliser des variables d'environnement
Stockez toutes vos clés et secrets dans des variables d'environnement, jamais dans le code source.

bash

# .env (ne jamais committer ce fichier)

feexpay_SECRET_KEY=sk_live_votre_cle_secrete
feexpay_SHOP_ID=shop_id
feexpay_MODE=LIVE
bash

# .gitignore

.env
.env.local
.env.\*.local
Valider les montants côté serveur
Ne faites jamais confiance aux montants envoyés depuis le frontend. Recalculez toujours les montants côté serveur avant de créer un paiement.

JavaScript

// ❌ Mauvais - Ne jamais faire confiance au frontend
app.post('/api/checkout', async (req, res) => {
const { amount } = req.body; // Dangereux!

const payment = await feexpay.payments.create({
amount: amount, // Un attaquant pourrait modifier ce montant
// ...
});
});

// ✅ Bon - Toujours recalculer côté serveur
app.post('/api/checkout', async (req, res) => {
const { orderId } = req.body;

// Récupérer la commande depuis la base de données
const order = await Order.findById(orderId);

// Recalculer le montant total
const total = order.items.reduce((sum, item) => {
return sum + (item.price \* item.quantity);
}, 0);

const payment = await feexpay.payments.create({
amount: total, // Montant sécurisé calculé côté serveur
// ...
});
});
Utiliser HTTPS partout
Assurez-vous que votre site web et vos URLs webhook utilisent HTTPS. FeexPay refusera d'envoyer des webhooks vers des URLs HTTP non sécurisées en production.

Rotation régulière des clés
Changez vos clés API régulièrement, surtout si vous suspectez une compromission. FeexPay vous permet de créer de nouvelles clés et de révoquer les anciennes instantanément depuis le dashboard.

Logger et monitorer
Gardez des logs détaillés de toutes les transactions et des événements webhook. Mettez en place des alertes pour les comportements suspects.

JavaScript

// Logger tous les événements importants
const winston = require('winston');

const logger = winston.createLogger({
level: 'info',
format: winston.format.json(),
transports: [
new winston.transports.File({ filename: 'payments.log' })
]
});

// Logger chaque paiement créé
app.post('/api/payments', async (req, res) => {
try {
const payment = await createPayment(req.body);

    logger.info('Payment created', {
      paymentId: payment.id,
      amount: payment.amount,
      userId: req.user.id,
      timestamp: new Date().toISOString()
    });

    res.json(payment);

} catch (error) {
logger.error('Payment creation failed', {
error: error.message,
userId: req.user.id,
timestamp: new Date().toISOString()
});

    res.status(400).json({ error: error.message });

}
});
En cas de compromission
Si vous suspectez que vos clés API ont été compromises :

Révoquez immédiatement les clés compromises depuis votre dashboard
Générez de nouvelles clés et mettez à jour vos applications
Vérifiez l'historique des transactions pour détecter toute activité suspecte
Contactez notre support à support@feexpay.com pour nous informer
