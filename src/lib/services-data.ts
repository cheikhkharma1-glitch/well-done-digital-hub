import { Code2, Database, Network, GraduationCap, type LucideIcon } from "lucide-react";
import webImg from "@/assets/service-web.jpg";
import softwareImg from "@/assets/service-software.jpg";
import networkImg from "@/assets/service-network.jpg";
import schoolImg from "@/assets/service-school.jpg";

export type ServiceDetail = {
  slug: string;
  icon: LucideIcon;
  title: string;
  tag: string;
  desc: string;
  image: string;
  alt: string;
  items: string[];
  accent: string;
  glow: string;
  /** Detail page content */
  intro: string;
  description: string[];
  technologies: { group: string; list: string[] }[];
  examples: { title: string; context: string; result: string }[];
  benefits: { label: string; text: string }[];
  deliverables: string[];
  duration: string;
};

export const services: ServiceDetail[] = [
  {
    slug: "developpement-web",
    icon: Code2,
    title: "Développement Web",
    tag: "Web & Mobile",
    desc: "Sites et applications web modernes, rapides et orientés conversion.",
    image: webImg,
    alt: "Développeur front-end travaillant sur une interface e-commerce moderne",
    items: [
      "Sites vitrines & corporate",
      "E-commerce avec mobile money",
      "Applications web sur mesure",
      "Landing pages haute conversion",
    ],
    accent: "from-amber-400 to-amber-600",
    glow: "bg-amber-500/20",
    intro:
      "Des expériences web performantes, accessibles et pensées pour convertir vos visiteurs en clients.",
    description: [
      "Nous concevons des sites et applications web sur mesure, du cadrage à la mise en production. Chaque interface est dessinée pour vos utilisateurs réels : parcours court, temps de chargement maîtrisé, lisibilité mobile irréprochable.",
      "Nos développements intègrent nativement le référencement naturel, l'accessibilité (contrastes, navigation clavier, lecteurs d'écran) et les paiements locaux — Orange Money, Wave, Free Money — pour le e-commerce africain.",
    ],
    technologies: [
      { group: "Front-end", list: ["React", "TypeScript", "Tailwind CSS", "Next.js / TanStack"] },
      { group: "Back-end", list: ["Node.js", "PostgreSQL", "REST & GraphQL", "Supabase"] },
      { group: "E-commerce", list: ["Stripe", "PayDunya", "Orange Money", "Wave"] },
      { group: "Qualité", list: ["Lighthouse 95+", "SEO technique", "RGPD", "Tests E2E"] },
    ],
    examples: [
      {
        title: "Boutique en ligne mobile money",
        context: "Distributeur agroalimentaire à Dakar souhaitant vendre en ligne.",
        result: "+120% de commandes en 4 mois, paiement Wave intégré.",
      },
      {
        title: "Site corporate multilingue",
        context: "Cabinet de conseil présent au Sénégal et en Côte d'Ivoire.",
        result: "Score Lighthouse 98 et 3× plus de demandes entrantes.",
      },
      {
        title: "Portail client sur mesure",
        context: "Société de services avec suivi de dossiers clients.",
        result: "70% des demandes traitées en self-service.",
      },
    ],
    benefits: [
      { label: "Visibilité", text: "Un site indexé, rapide et pensé SEO dès la première ligne de code." },
      { label: "Conversion", text: "Parcours optimisés et appels à l'action mesurés en continu." },
      { label: "Évolutivité", text: "Une base technique modulaire qui grandit avec votre activité." },
      { label: "Autonomie", text: "Une interface d'administration simple pour gérer vos contenus." },
    ],
    deliverables: ["Maquettes UI validées", "Code source livré", "Formation à l'administration", "3 mois de garantie"],
    duration: "3 à 8 semaines",
  },
  {
    slug: "solutions-logicielles",
    icon: Database,
    title: "Solutions logicielles",
    tag: "ERP / CRM",
    desc: "Logiciels métiers conçus pour vos processus réels.",
    image: softwareImg,
    alt: "Tableaux de bord ERP et CRM affichés sur plusieurs écrans",
    items: [
      "ERP — gestion intégrée",
      "CRM commercial & marketing",
      "Logiciels métiers personnalisés",
      "Solutions SaaS multi-clients",
    ],
    accent: "from-primary to-primary-glow",
    glow: "bg-primary/20",
    intro:
      "Des logiciels métiers qui épousent vos processus au lieu de vous imposer les leurs.",
    description: [
      "Nous construisons des ERP et CRM sur mesure : gestion des stocks, facturation, achats, ressources humaines, pipeline commercial. Chaque module est développé après un audit terrain de vos flux réels.",
      "L'architecture multi-utilisateurs, avec rôles et permissions fines, garantit que chaque collaborateur ne voit que ce qui le concerne. Les tableaux de bord temps réel donnent à la direction une vision consolidée de l'activité.",
    ],
    technologies: [
      { group: "Applicatif", list: ["React", "TypeScript", "Node.js", "API REST sécurisées"] },
      { group: "Données", list: ["PostgreSQL", "Row Level Security", "Sauvegardes automatiques", "Redis"] },
      { group: "Intégrations", list: ["Comptabilité", "SMS & e-mail", "Mobile money", "Exports Excel/PDF"] },
      { group: "Exploitation", list: ["Docker", "CI/CD", "Monitoring", "Journalisation"] },
    ],
    examples: [
      {
        title: "ERP industriel",
        context: "PME de transformation avec 4 sites de production.",
        result: "Stocks fiabilisés à 99% et clôture mensuelle divisée par 3.",
      },
      {
        title: "CRM commercial",
        context: "Force de vente terrain de 25 commerciaux.",
        result: "Cycle de vente réduit de 22 à 14 jours.",
      },
      {
        title: "Plateforme SaaS multi-clients",
        context: "Éditeur souhaitant industrialiser son offre.",
        result: "Onboarding d'un nouveau client en moins d'une heure.",
      },
    ],
    benefits: [
      { label: "Productivité", text: "Fin des doubles saisies et des fichiers Excel dispersés." },
      { label: "Pilotage", text: "Indicateurs consolidés et fiables, disponibles en temps réel." },
      { label: "Sécurité", text: "Accès par rôle, traçabilité complète et sauvegardes chiffrées." },
      { label: "ROI", text: "Un outil taillé pour vos marges, pas une licence générique." },
    ],
    deliverables: ["Cahier des charges fonctionnel", "Modules livrés par sprint", "Reprise de données", "Support 6 mois"],
    duration: "6 à 16 semaines",
  },
  {
    slug: "maintenance-reseaux",
    icon: Network,
    title: "Maintenance & Réseaux",
    tag: "Infrastructure",
    desc: "Une infrastructure stable et sécurisée, supervisée par nos experts.",
    image: networkImg,
    alt: "Ingénieur réseau inspectant des baies de serveurs en datacenter",
    items: [
      "Maintenance informatique",
      "Gestion réseau & VPN",
      "Support technique réactif",
      "Audit & cybersécurité",
    ],
    accent: "from-emerald-400 to-teal-600",
    glow: "bg-emerald-500/20",
    intro:
      "Une infrastructure disponible, supervisée et protégée — pour que l'informatique ne soit jamais un frein.",
    description: [
      "Nous prenons en charge votre parc informatique de bout en bout : postes de travail, serveurs, réseau local, Wi-Fi, VPN inter-sites et sauvegardes. La supervision proactive détecte les incidents avant vos utilisateurs.",
      "Côté cybersécurité, nous réalisons des audits, durcissons les configurations, segmentons le réseau et formons vos équipes aux réflexes essentiels face au phishing et aux rançongiciels.",
    ],
    technologies: [
      { group: "Réseau", list: ["Cisco / MikroTik", "VLAN & segmentation", "VPN IPsec / WireGuard", "Wi-Fi pro"] },
      { group: "Serveurs", list: ["Linux", "Windows Server", "Virtualisation", "NAS & stockage"] },
      { group: "Sécurité", list: ["Pare-feu", "EDR / antivirus", "MFA", "Audit de vulnérabilités"] },
      { group: "Supervision", list: ["Zabbix", "Grafana", "Alerting 24/7", "Sauvegardes 3-2-1"] },
    ],
    examples: [
      {
        title: "Refonte réseau multi-sites",
        context: "Groupe avec 3 agences reliées par des liaisons instables.",
        result: "Disponibilité passée de 92% à 99,8%.",
      },
      {
        title: "Plan de sauvegarde & reprise",
        context: "Structure ayant subi une perte de données.",
        result: "Reprise d'activité testée en moins de 2 heures.",
      },
      {
        title: "Audit de cybersécurité",
        context: "Établissement traitant des données sensibles.",
        result: "18 vulnérabilités critiques corrigées en 3 semaines.",
      },
    ],
    benefits: [
      { label: "Disponibilité", text: "Supervision continue et interventions avant l'incident bloquant." },
      { label: "Réactivité", text: "Support à distance et sur site avec engagements de délai." },
      { label: "Protection", text: "Défense en profondeur contre rançongiciels et intrusions." },
      { label: "Maîtrise", text: "Un budget IT lissé et prévisible, sans mauvaise surprise." },
    ],
    deliverables: ["Inventaire du parc", "Schéma réseau à jour", "Contrat de service (SLA)", "Rapports mensuels"],
    duration: "Contrat annuel ou mission ponctuelle",
  },
  {
    slug: "gestion-scolaire",
    icon: GraduationCap,
    title: "Gestion scolaire",
    tag: "EdTech",
    desc: "Une plateforme tout-en-un pour piloter votre établissement.",
    image: schoolImg,
    alt: "Plateforme de gestion scolaire présentée à des élèves en salle informatique",
    items: [
      "Gestion des élèves & inscriptions",
      "Notes & bulletins automatisés",
      "Communication parents-école",
      "Statistiques & tableaux de bord",
    ],
    accent: "from-fuchsia-400 to-purple-600",
    glow: "bg-fuchsia-500/20",
    intro:
      "Inscriptions, notes, scolarité et communication parents : tout votre établissement dans une seule plateforme.",
    description: [
      "Notre solution EdTech couvre le cycle scolaire complet : inscriptions et réinscriptions, gestion des classes et emplois du temps, saisie des notes, génération automatique des bulletins et suivi des paiements de scolarité.",
      "Les parents disposent d'un accès dédié — web et mobile — pour consulter les résultats, les absences et recevoir les communications de l'école par notification ou SMS.",
    ],
    technologies: [
      { group: "Plateforme", list: ["React", "PWA mobile", "PostgreSQL", "Multi-établissements"] },
      { group: "Scolarité", list: ["Bulletins PDF", "Emplois du temps", "Absences", "Conseils de classe"] },
      { group: "Finance", list: ["Scolarité & échéanciers", "Reçus automatiques", "Mobile money", "Relances"] },
      { group: "Communication", list: ["SMS", "E-mail", "Notifications push", "Espace parents"] },
    ],
    examples: [
      {
        title: "Groupe scolaire — 1 200 élèves",
        context: "Bulletins produits manuellement chaque trimestre.",
        result: "Bulletins générés en 1 clic, 3 semaines économisées par an.",
      },
      {
        title: "Suivi des paiements",
        context: "Recouvrement de scolarité difficile à tracer.",
        result: "Taux de recouvrement passé de 74% à 93%.",
      },
      {
        title: "Espace parents mobile",
        context: "Communication école-familles par papier uniquement.",
        result: "85% des parents actifs sur la plateforme en 2 mois.",
      },
    ],
    benefits: [
      { label: "Temps gagné", text: "L'administratif répétitif est automatisé, l'équipe se recentre sur la pédagogie." },
      { label: "Transparence", text: "Les familles suivent la scolarité en temps réel." },
      { label: "Trésorerie", text: "Suivi des paiements et relances automatiques." },
      { label: "Pilotage", text: "Statistiques de réussite et d'assiduité par classe et par matière." },
    ],
    deliverables: ["Paramétrage de l'établissement", "Import des élèves", "Formation du personnel", "Assistance rentrée"],
    duration: "4 à 10 semaines",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
