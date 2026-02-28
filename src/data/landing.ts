import {
    IconBrandTiktok,
    IconBrandInstagram,
    IconBrandYoutube,
    IconBrandFacebook,
    IconBrandX,
    IconBrandTelegram,
    IconBrandWhatsapp,
} from "@tabler/icons-react";
import {
    Zap,
    Shield,
    HeadphonesIcon,
    TrendingUp,
    BarChart3,
    Globe,
    UserPlus,
    Wallet,
    MousePointerClick,
    Rocket,
} from "lucide-react";

export const NETWORKS = [
    {
        name: "TikTok",
        Icon: IconBrandTiktok,
        iconColor: "#69C9D0",
        gradient: "from-[#010101] to-[#69C9D0]",
        services: ["Vues", "Followers", "Likes", "Commentaires"],
    },
    {
        name: "Instagram",
        Icon: IconBrandInstagram,
        iconColor: "#E1306C",
        gradient: "from-[#833AB4] via-[#E1306C] to-[#F77737]",
        services: ["Followers", "Likes", "Vues", "Commentaires"],
    },
    {
        name: "YouTube",
        Icon: IconBrandYoutube,
        iconColor: "#FF0000",
        gradient: "from-[#FF0000] to-[#CC0000]",
        services: ["Vues", "Abonnés", "Likes", "Commentaires"],
    },
    {
        name: "Facebook",
        Icon: IconBrandFacebook,
        iconColor: "#1877F2",
        gradient: "from-[#1877F2] to-[#0D5FBF]",
        services: ["Likes page", "Followers", "Vues", "Partages"],
    },
    {
        name: "X (Twitter)",
        Icon: IconBrandX,
        iconColor: "#ffffff",
        gradient: "from-[#14171A] to-[#657786]",
        services: ["Followers", "Likes", "Retweets", "Vues"],
    },
    {
        name: "Telegram",
        Icon: IconBrandTelegram,
        iconColor: "#2AABEE",
        gradient: "from-[#2AABEE] to-[#229ED9]",
        services: ["Membres", "Vues", "Réactions", "Partages"],
    },
    {
        name: "WhatsApp",
        Icon: IconBrandWhatsapp,
        iconColor: "#25D366",
        gradient: "from-[#25D366] to-[#128C7E]",
        services: ["Membres canal", "Vues statut", "Réactions"],
    },
];

export const FEATURED_SERVICES = [
    {
        network: "TikTok",
        Icon: IconBrandTiktok,
        iconColor: "#69C9D0",
        name: "Vues TikTok",
        desc: "Boostez la visibilité de vos vidéos TikTok instantanément.",
        price: "0.50",
        unit: "1 000 vues",
        badge: "Livraison rapide",
    },
    {
        network: "Instagram",
        Icon: IconBrandInstagram,
        iconColor: "#E1306C",
        name: "Followers Instagram",
        desc: "Gagnez des abonnés réels et actifs sur votre profil.",
        price: "1.20",
        unit: "100 followers",
        badge: "Populaire",
    },
    {
        network: "YouTube",
        Icon: IconBrandYoutube,
        iconColor: "#FF0000",
        name: "Vues YouTube",
        desc: "Augmentez vos vues pour améliorer votre référencement.",
        price: "0.80",
        unit: "1 000 vues",
        badge: "Garanti",
    },
    {
        network: "Facebook",
        Icon: IconBrandFacebook,
        iconColor: "#1877F2",
        name: "Likes Facebook",
        desc: "Améliorez l'engagement de vos publications.",
        price: "0.60",
        unit: "100 likes",
        badge: "Livraison rapide",
    },
    {
        network: "Telegram",
        Icon: IconBrandTelegram,
        iconColor: "#2AABEE",
        name: "Membres Telegram",
        desc: "Développez votre communauté Telegram rapidement.",
        price: "2.00",
        unit: "100 membres",
        badge: "Premium",
    },
    {
        network: "X (Twitter)",
        Icon: IconBrandX,
        iconColor: "#ffffff",
        name: "Followers X",
        desc: "Augmentez votre audience sur le réseau X (Twitter).",
        price: "1.50",
        unit: "100 followers",
        badge: "Populaire",
    },
];

export const STATS = [
    { count: 50, suffix: "K+", label: "Commandes livrées" },
    { count: 10, suffix: "K+", label: "Clients satisfaits" },
    { count: 7, suffix: "", label: "Réseaux supportés" },
    { count: 99, suffix: "%", label: "Taux de satisfaction" },
];

export const WHY_US = [
    {
        Icon: Zap,
        title: "Livraison ultra-rapide",
        desc: "Vos commandes commencent dans les minutes qui suivent le paiement. Résultats visibles immédiatement.",
    },
    {
        Icon: Shield,
        title: "100% sécurisé",
        desc: "Nous n'utilisons jamais vos mots de passe. Nos méthodes sont conformes aux conditions d'utilisation.",
    },
    {
        Icon: HeadphonesIcon,
        title: "Support 24/7",
        desc: "Notre équipe est disponible à tout moment pour répondre à vos questions et résoudre vos problèmes.",
    },
    {
        Icon: TrendingUp,
        title: "Croissance garantie",
        desc: "Résultats garantis ou remboursé. Nous nous engageons sur la qualité de chaque livraison.",
    },
    {
        Icon: BarChart3,
        title: "Suivi en temps réel",
        desc: "Suivez l'avancement de vos commandes depuis votre tableau de bord, en direct.",
    },
    {
        Icon: Globe,
        title: "Multi-réseaux",
        desc: "Un seul compte pour gérer tous vos réseaux sociaux : TikTok, Instagram, YouTube et bien plus.",
    },
];

export const FAQ = [
    {
        q: "Est-ce que c'est sécurisé pour mon compte ?",
        a: "Oui, totalement. Nous n'avons jamais besoin de votre mot de passe. Nous utilisons uniquement des méthodes organiques et conformes aux conditions de chaque plateforme.",
    },
    {
        q: "Combien de temps prend la livraison ?",
        a: "La plupart des commandes commencent dans les 1 à 30 minutes après la confirmation du paiement. Le délai complet dépend de la quantité commandée.",
    },
    {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: "Nous acceptons Mobile Money (MTN, Moov, Wave…) et les cartes bancaires (Visa, Mastercard) via notre partenaire FeexPay.",
    },
    {
        q: "Puis-je commander pour n'importe quel compte ?",
        a: "Oui, il vous suffit de fournir le lien ou le nom d'utilisateur du compte que vous souhaitez booster.",
    },
    {
        q: "Que se passe-t-il si ma commande n'est pas livrée ?",
        a: "En cas de problème, notre support intervient dans les 24 h pour résoudre la situation ou effectuer un remboursement sur votre solde.",
    },
    {
        q: "Comment fonctionne le système de solde ?",
        a: "Rechargez votre compte en USD via FeexPay, puis utilisez votre solde pour passer des commandes à tout moment, sans ressaisir vos informations de paiement.",
    },
];

export const TESTIMONIALS = [
    {
        name: "Kofi A.",
        role: "Créateur de contenu",
        network: "TikTok",
        stars: 5,
        text: "J'ai commandé 10 000 vues TikTok et elles sont arrivées en moins de 2 heures. Incroyable !",
    },
    {
        name: "Aminata D.",
        role: "Influenceuse",
        network: "Instagram",
        stars: 5,
        text: "Mon profil Instagram a explosé après avoir utilisé Maxi Views. Le support est top !",
    },
    {
        name: "Jean-Pierre K.",
        role: "Entrepreneur",
        network: "Facebook",
        stars: 5,
        text: "Parfait pour booster ma page business. Résultats rapides et vraiment professionnels.",
    },
];

export const HOW_IT_WORKS = [
    {
        title: "Créez votre compte",
        desc: "Inscrivez-vous gratuitement en quelques secondes avec votre email.",
        Icon: UserPlus,
    },
    {
        title: "Rechargez votre solde",
        desc: "Ajoutez des fonds via Mobile Money ou carte bancaire.",
        Icon: Wallet,
    },
    {
        title: "Choisissez un service",
        desc: "Sélectionnez le réseau et le service qui vous correspond.",
        Icon: MousePointerClick,
    },
    {
        title: "Profitez des résultats",
        desc: "Votre commande commence immédiatement. Suivez-la en temps réel.",
        Icon: Rocket,
    },
];

export const FOOTER_SOCIAL_ICONS = [
    { Icon: IconBrandTiktok, color: "#69C9D0" },
    { Icon: IconBrandInstagram, color: "#E1306C" },
    { Icon: IconBrandYoutube, color: "#FF0000" },
    { Icon: IconBrandFacebook, color: "#1877F2" },
];

export const FOOTER_LINKS = [
    { label: "Mon compte", href: "/sign-in" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "CGU", href: "/cgu" },
    { label: "Confidentialité", href: "/privacy" },
    { label: "Contact", href: "/contact" },
];
