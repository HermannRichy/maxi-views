# 🚀 Start Web App - Premium Fullstack Starter

Bienvenue dans votre nouveau projet ! Ce package est un starter pack complet et premium pour construire des applications web fullstack modernes avec **Next.js 16**.

## 🛠 Stack Technique

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Gestionnaire de paquets** : [pnpm](https://pnpm.io/)
- **Authentification** : [Clerk](https://clerk.com/)
- **Base de données** : [Prisma](https://www.prisma.io/) avec **PostgreSQL**
- **Styling** : [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Icônes** : [Tabler Icons](https://tabler-icons.io/) (`@tabler/icons-react`)
- **Emails** :
    - [EmailJS](https://www.emailjs.com/) (Formulaires de contact client)
    - [Resend](https://resend.com/) (Emails systèmes / transactionnels)
- **Thème** : Dark mode par défaut avec `next-themes`

## 🚀 Démarrage Rapide

### 1. Installation des dépendances

```bash
pnpm install
```

### 2. Configuration des variables d'environnement

Copiez le contenu ci-dessous dans un fichier `.env` à la racine du projet :

```env
# Database
DATABASE_URL="votre_url_postgresql"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# EmailJS (Client-side)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...

# Resend (Server-side)
RESEND_API_KEY=re_...
```

### 3. Préparation de la base de données

Générez le client Prisma et synchronisez votre base de données :

```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Lancement du serveur de développement

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir le résultat.

## 📂 Structure du Projet

- `src/app/` : Routes, layouts et pages (Convention App Router).
- `src/components/ui/` : Composants **shadcn/ui** (Button, Card, Input, etc.).
- `src/components/` : Composants métier (ex: `ContactForm.tsx`).
- `src/lib/` : Utilitaires et configurations (Prisma client, etc.).
- `prisma/` : Schéma de la base de données.
- `src/proxy.ts` : Middleware Clerk (Convention Next.js 16).

## 💳 Paiements (FedaPay)

Voir la documentation: `docs/fedapay.md`.

## 🎨 Personnalisation

### Thème

Le projet est configuré en **Dark Mode par défaut**. Pour modifier cela, allez dans `src/app/layout.tsx` et changez les props du `ThemeProvider`.

### Composants UI

Vous pouvez ajouter de nouveaux composants shadcn à tout moment :

```bash
pnpm dlx shadcn@latest add <nom-du-composant>
```

## 📝 Scripts Disponibles

- `pnpm dev` : Lance le serveur de développement.
- `pnpm build` : Prépare l'application pour la production.
- `pnpm start` : Lance l'application en mode production.
- `pnpm lint` : Vérifie la qualité du code.
- `pnpm postinstall` : Génère automatiquement le client Prisma après l'installation.

## 📦 Utilisation comme Template

Pour utiliser ce starter pack comme base pour un nouveau projet :

1. **Copier les fichiers** : Copiez tout le contenu du dossier, **SAUF** les dossiers `node_modules` et `.next`.
2. **Renommer le projet** : Dans votre nouveau `package.json`, modifiez la ligne `"name": "start-web-app"` avec le nom de votre nouveau projet.
3. **Purger le cache Prisma** : Supprimez le dossier `prisma/migrations` si vous souhaitez repartir sur une base de données vierge.
4. **Réinstaller** : Lancez `pnpm install` dans le nouveau dossier.
5. **Variables d'environnement** : N'oubliez pas de configurer un nouveau fichier `.env` avec des clés Clerk et une URL de base de données propres à ce nouveau projet.

---

Développé avec ❤️ pour des performances maximales.
