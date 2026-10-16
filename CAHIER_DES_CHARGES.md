# Cahier des charges — Refonte de l'application e-commerce

> **Projet** : refonte complète de l'application e-commerce « Ma Boutique » (projet *Certification*)
> **Nature** : application vitrine / portfolio — **non commercialisée**, aucun paiement réel
> **Auteur** : Archange — Syabe Technologies
> **Version** : 1.0 — 16 octobre 2026
> **Nom de l'application** : *à définir* (voir le cahier des charges graphique)

---

## Sommaire

1. [Contexte et objectifs](#1-contexte-et-objectifs)
2. [Audit de l'existant](#2-audit-de-lexistant)
3. [Périmètre de la refonte](#3-périmètre-de-la-refonte)
4. [Choix de l'API gratuite](#4-choix-de-lapi-gratuite)
5. [Stack technique cible](#5-stack-technique-cible)
6. [Architecture et structuration du code](#6-architecture-et-structuration-du-code)
7. [Conventions et méthodes de développement](#7-conventions-et-méthodes-de-développement)
8. [Spécifications fonctionnelles — Boutique](#8-spécifications-fonctionnelles--boutique)
9. [Spécifications fonctionnelles — Espace client](#9-spécifications-fonctionnelles--espace-client)
10. [Spécifications fonctionnelles — Back-office](#10-spécifications-fonctionnelles--back-office)
11. [Plan de routes](#11-plan-de-routes)
12. [Gestion d'état et données](#12-gestion-détat-et-données)
13. [Authentification et sécurité](#13-authentification-et-sécurité)
14. [Exigences non fonctionnelles](#14-exigences-non-fonctionnelles)
15. [Qualité, tests et CI/CD](#15-qualité-tests-et-cicd)
16. [Livrables](#16-livrables)
17. [Planning par lots](#17-planning-par-lots)
18. [Critères d'acceptation globaux](#18-critères-dacceptation-globaux)

---

## 1. Contexte et objectifs

### 1.1 Contexte

L'application actuelle est un site e-commerce développé avec **Nuxt 3**, **Tailwind CSS** et **Pinia**, alimenté par **FakeStoreAPI**. Elle propose une boutique (catalogue, fiche produit, panier), un espace utilisateur et un back-office (CRUD produits, utilisateurs, paniers).

Elle a rempli son rôle d'apprentissage mais ne reflète pas le niveau actuel de son auteur : la refonte doit en faire **une pièce maîtresse de portfolio**, démontrant la maîtrise de l'écosystème Nuxt moderne, de l'architecture front, de la qualité logicielle et du design d'interface.

### 1.2 Objectifs

| # | Objectif | Indicateur de réussite |
|---|----------|------------------------|
| O1 | Démontrer une architecture front professionnelle | Code découpé par domaine (features), typé à 100 %, zéro `any` |
| O2 | Offrir une expérience d'achat crédible de bout en bout | Parcours complet : découverte → produit → panier → checkout simulé → confirmation |
| O3 | Proposer une identité visuelle forte et cohérente | Design system documenté, appliqué sur 100 % des écrans, mode clair/sombre |
| O4 | Atteindre un haut niveau de performance et d'accessibilité | Lighthouse ≥ 95 (Perf, A11y, Best Practices, SEO) sur les pages clés |
| O5 | Prouver la qualité logicielle | Lint + typecheck + tests unitaires + E2E dans une CI verte |
| O6 | Être présentable en 2 minutes à un recruteur | README soigné, démo en ligne, comptes de démo, captures, choix techniques expliqués |

### 1.3 Contraintes

- **Front** : on conserve **Nuxt** comme base (migration vers **Nuxt 4**).
- **Données** : on conserve le principe d'une **API publique gratuite**, sans backend propriétaire ni base de données.
- **Aucun paiement réel**, aucune donnée personnelle réelle collectée.
- Les écritures (création, modification, suppression) côté API sont **simulées** par l'API gratuite : l'application doit le gérer proprement (voir §12.4).

---

## 2. Audit de l'existant

Audit réalisé sur le dossier `Certification/dev-project` (≈ 45 fichiers source : 26 pages, 6 composants, 2 stores, 1 middleware, 15 routes serveur).

### 2.1 Synthèse

| Domaine | État | Gravité |
|--------|------|---------|
| Structure du projet | Désorganisée, doublons de routes et de fichiers | 🔴 Élevée |
| Configuration / dépendances | Incohérente, dépendances manquantes | 🔴 Élevée |
| Accès aux données | Deux méthodes concurrentes, aucune couche d'abstraction | 🔴 Élevée |
| Authentification / sécurité | Non fiable, back-office non protégé | 🔴 Élevée |
| Panier | Bugs fonctionnels (quantité, persistance) | 🔴 Élevée |
| Typage | Quasi absent (`any`, JS/TS mélangés) | 🟠 Moyenne |
| UI / design | Pas de design system, styles dupliqués | 🟠 Moyenne |
| Performance | Images lourdes, requêtes redondantes | 🟠 Moyenne |
| Accessibilité / SEO | Minimal | 🟠 Moyenne |
| Tests / CI / doc | Inexistants | 🟠 Moyenne |

### 2.2 Constats détaillés

**Structure et configuration**

- Deux `package.json` : celui de la racine déclare `tailwindcss@4`, `@tailwindcss/vite` et `pinia`, alors que le projet utilise `@nuxtjs/tailwindcss` (Tailwind 3) — versions et sources en conflit.
- Le dossier s'appelle `layout/` au lieu de `layouts/` : **le layout par défaut n'est jamais chargé**. Chaque page réimplémente donc son propre header.
- `@pinia/nuxt` est déclaré dans `nuxt.config.ts` mais absent des dépendances du projet Nuxt.
- Le composant `<font-awesome-icon>` est utilisé dans plusieurs pages sans être installé, en parallèle d'un *kit* Font Awesome chargé par script externe → icônes cassées et double système d'icônes.
- README par défaut du starter Nuxt ; `.idea/` versionné.

**Routage et pages**

- Routes en doublon : `/products` et `/users/products`, `/users/cart` et `/users/carts`, deux fiches produit (`/products/[id]` et `/users/products/[id]`).
- Nommage incohérent : `/users/users/dashboard`, `/users/users/edit/[id]`.
- La page d'accueil `/` est un formulaire d'inscription, et la vraie accueil boutique est sur `/users`.
- Un bouton flottant « Admin » est visible publiquement sur l'accueil.

**Accès aux données**

- 11 pages appellent `fakestoreapi.com` **directement** depuis le client, 14 passent par les routes serveur `/api/*` : aucune règle commune.
- Pas de couche service/repository, pas de typage des réponses, URL de l'API codée en dur partout.
- La route `POST /api/users` attend des champs (`nom`, `motDePasse`) qui ne correspondent pas au formulaire, et stocke les mots de passe en clair.
- Le `Header` télécharge **tout le catalogue** à chaque page pour faire la recherche.

**Authentification**

- Token et `userId` stockés en `localStorage` ; l'utilisateur est retrouvé en téléchargeant **toute** la liste des utilisateurs.
- Le middleware `auth` utilise `alert()` et des `console.log`, et ne s'exécute que côté client.
- **Le back-office `/admin` n'a aucune protection** ; la « déconnexion » admin est un simple lien vers `/`.
- Le store `user` (Pinia) existe mais n'est jamais utilisé.

**Panier**

- `addToCart()` ignore la quantité choisie (toujours `quantity: 1` à l'ajout).
- `loadCart()` n'est appelé nulle part → **le panier est perdu au rechargement**.
- Le bouton « Ajouter au panier » de la section catégories n'affiche qu'une `alert()`.
- Erreur de syntaxe `<<script setup>` dans `pages/users/cart.vue`.

**Qualité de code et UI**

- 24 appels à `alert()` comme système de feedback.
- La logique du mode sombre est copiée-collée dans au moins 4 fichiers.
- Classes Tailwind très longues répétées, aucune variable de design (couleurs, rayons, ombres).
- Mélange français/anglais dans le code (`ajouterAuPanier`, `rechercherProduit`, `afficherQuantite`).
- Commentaires paraphrasant chaque ligne plutôt que documentant les intentions.
- Images non optimisées (`fond.jpeg` = 4,6 Mo), images externes Unsplash en dur.
- Prix affichés en `$` avec `toFixed`, sans formatage localisé.
- Aucune balise SEO, aucun test, aucun lint.

### 2.3 Ce que l'on conserve

- Le **périmètre fonctionnel** (boutique, espace client, back-office) — enrichi.
- Le choix de **Nuxt**, **Tailwind** et **Pinia**.
- L'idée d'un **proxy serveur Nitro** vers l'API (à généraliser et fiabiliser).
- Le **mode clair/sombre**.

Tout le reste (code, design, structure, méthodes) est **réécrit**.

---

## 3. Périmètre de la refonte

### 3.1 Dans le périmètre

- Boutique publique : accueil, catalogue avec filtres/tri/pagination, recherche, catégories, fiche produit, panier, favoris, checkout simulé.
- Espace client : connexion, inscription (simulée), profil, historique des commandes, favoris.
- Back-office : tableau de bord, gestion produits, utilisateurs, commandes/paniers.
- Design system complet et thème clair/sombre.
- Internationalisation **FR / EN**.
- SEO, performance, accessibilité.
- Tests, CI/CD, déploiement d'une démo publique.

### 3.2 Hors périmètre

- Paiement réel (Stripe, mobile money…) — le checkout est **simulé**.
- Backend propriétaire, base de données, envoi d'e-mails réels.
- Application mobile native.
- Gestion de stock réelle, logistique, facturation.

---

## 4. Choix de l'API gratuite

### 4.1 Comparatif

| Critère | FakeStoreAPI (actuelle) | **DummyJSON** (recommandée) | Platzi Fake Store API |
|--------|--------------------------|------------------------------|------------------------|
| Nombre de produits | 20 | ~190 | Variable (données communautaires, qualité inégale) |
| Catégories | 4 | ~24 | Quelques-unes |
| Images par produit | 1 | Plusieurs + miniature | Plusieurs |
| Pagination / tri / sélection de champs | ❌ | ✅ `limit`, `skip`, `sortBy`, `order`, `select` | Partiel |
| Recherche côté API | ❌ | ✅ `/products/search?q=` | Filtre par titre |
| Avis clients, stock, marque, remise | Note globale seulement | ✅ avis détaillés, stock, marque, % de remise, tags, garantie, livraison | Non |
| Authentification | Token simple | ✅ JWT `accessToken` + `refreshToken`, `/auth/me` | JWT |
| Utilisateurs / paniers | ✅ | ✅ (paniers par utilisateur, totaux calculés) | Utilisateurs |
| Écritures (POST/PUT/DELETE) | Simulées | Simulées | Persistées (mais publiques et partagées) |

### 4.2 Décision

**DummyJSON** est retenue comme source de données : catalogue dix fois plus riche, pagination et recherche natives, avis, stock et remises qui permettent de concevoir une fiche produit et un catalogue réalistes, et une authentification JWT avec refresh token qui permet de démontrer une gestion d'auth sérieuse.

Pour ne pas dépendre d'un fournisseur, l'accès aux données passe par une **couche d'adaptateur** (voir §6.4) : changer d'API ne doit impacter qu'un seul dossier.

---

## 5. Stack technique cible

| Besoin | Choix | Justification |
|-------|-------|---------------|
| Framework | **Nuxt 4** | Nouvelle structure `app/`, meilleures perfs dev, typage amélioré |
| Langage | **TypeScript strict** | `strict: true`, zéro `any` toléré |
| Style | **Tailwind CSS v4** (`@tailwindcss/vite`) | Configuration CSS-first via `@theme`, tokens du design system |
| Composants headless | **Reka UI** | Primitives accessibles (dialog, dropdown, select, toast, tabs…) stylées à la main → design 100 % propriétaire |
| État global | **Pinia** + `pinia-plugin-persistedstate` | Panier, favoris, préférences persistés proprement |
| Données serveur | `useFetch` / `useAsyncData` + couche service | SSR, cache, déduplication |
| Validation | **Zod** | Schémas partagés pour formulaires et réponses API |
| Formulaires | **VeeValidate** + `@vee-validate/zod` | Validation déclarative, messages i18n |
| Icônes | **@nuxt/icon** (collection Lucide) | Un seul système d'icônes, SVG à la demande |
| Images | **@nuxt/image** | Formats modernes, `srcset`, lazy loading |
| Polices | **@nuxt/fonts** | Auto-hébergement, zéro CLS |
| Thème | **@nuxtjs/color-mode** | Clair / sombre / système, sans flash |
| i18n | **@nuxtjs/i18n** | FR (défaut) + EN, routes préfixées |
| Utilitaires | **@vueuse/nuxt** | `useDebounceFn`, `useIntersectionObserver`, etc. |
| SEO | `useSeoMeta`, `@nuxtjs/sitemap`, `nuxt-schema-org` | Métadonnées, sitemap, données structurées produit |
| Graphiques (admin) | **Unovis** ou **Chart.js** via `vue-chartjs` | Tableaux de bord |
| Lint / format | **@nuxt/eslint** + Prettier | Configuration flat, règles Vue/TS |
| Tests unitaires | **Vitest** + `@nuxt/test-utils` + `@vue/test-utils` | Composables, stores, composants |
| Tests E2E | **Playwright** | Parcours critiques |
| Mock API (tests) | **MSW** | Tests déterministes, indépendants de l'API |
| Git hooks | **Husky** + **lint-staged** + **commitlint** | Qualité à chaque commit |
| CI/CD | **GitHub Actions** | Lint, typecheck, tests, build |
| Hébergement | **Vercel** (ou Netlify / Cloudflare Pages) | Déploiement SSR + previews par PR |
| Gestionnaire de paquets | **pnpm** | Rapide, strict, un seul lockfile |

> Les versions exactes sont figées dans le `package.json` au démarrage du projet (dernières versions stables à date).

---

## 6. Architecture et structuration du code

### 6.1 Principes

1. **Un seul dépôt, un seul `package.json`**, un seul lockfile.
2. **Découpage par domaine métier** (*feature-based*) plutôt que par type de fichier.
3. **Séparation stricte** : composants de présentation ↔ logique (composables) ↔ accès aux données (services) ↔ état global (stores).
4. **Le client ne parle jamais directement à l'API externe** : tout passe par les routes serveur Nitro (`/api/*`).
5. **Typage de bout en bout** : la réponse API est validée (Zod), mappée vers un modèle de domaine, puis consommée par le front.

### 6.2 Arborescence cible

```
<nom-app>/
├─ app/
│  ├─ assets/
│  │  └─ css/main.css              # Tailwind v4 + tokens @theme
│  ├─ components/
│  │  ├─ ui/                       # Design system : Button, Input, Badge, Card, Dialog, Toast, Skeleton…
│  │  ├─ layout/                   # AppHeader, AppFooter, AdminSidebar, MobileNav…
│  │  └─ shared/                   # Price, RatingStars, EmptyState, ErrorState, Pagination…
│  ├─ features/
│  │  ├─ catalog/                  # components/, composables/, types.ts
│  │  ├─ product/
│  │  ├─ cart/
│  │  ├─ wishlist/
│  │  ├─ checkout/
│  │  ├─ auth/
│  │  ├─ account/
│  │  └─ admin/
│  ├─ composables/                 # Composables transverses (useToast, useCurrency…)
│  ├─ layouts/
│  │  ├─ default.vue               # Boutique
│  │  ├─ auth.vue                  # Connexion / inscription
│  │  └─ admin.vue                 # Back-office
│  ├─ middleware/
│  │  ├─ auth.ts                   # Requiert un utilisateur connecté
│  │  ├─ guest.ts                  # Réservé aux visiteurs (login/register)
│  │  └─ admin.ts                  # Requiert le rôle admin
│  ├─ pages/                       # Fichiers fins : assemblage de composants de features
│  ├─ plugins/
│  ├─ stores/                      # cart.ts, wishlist.ts, auth.ts, ui.ts
│  ├─ utils/                       # Fonctions pures (formatPrice, slugify…)
│  ├─ app.vue
│  ├─ app.config.ts
│  └─ error.vue                    # Page d'erreur 404/500 personnalisée
├─ server/
│  ├─ api/
│  │  ├─ products/                 # index.get, [id].get, search.get, categories.get…
│  │  ├─ auth/                     # login.post, refresh.post, me.get, logout.post
│  │  ├─ users/
│  │  └─ carts/
│  ├─ adapters/
│  │  └─ dummyjson/                # client HTTP + mappers API → domaine
│  ├─ utils/                       # helpers serveur (session, erreurs)
│  └─ middleware/
├─ shared/
│  ├─ types/                       # Modèles de domaine : Product, User, Cart, Order…
│  └─ schemas/                     # Schémas Zod partagés client/serveur
├─ i18n/locales/                   # fr.json, en.json
├─ public/
├─ tests/
│  ├─ unit/
│  ├─ components/
│  └─ e2e/
├─ .github/workflows/ci.yml
├─ nuxt.config.ts
├─ eslint.config.mjs
├─ vitest.config.ts
├─ playwright.config.ts
└─ README.md
```

### 6.3 Règles de responsabilité

| Couche | Rôle | Interdit |
|-------|------|----------|
| `pages/` | Assembler des composants, déclarer `definePageMeta`, `useSeoMeta` | Logique métier, appels HTTP bruts |
| `components/ui/` | Composants génériques, sans connaissance métier | Appels API, accès aux stores |
| `features/*/components/` | Composants métier | Appels `$fetch` directs (passer par un composable) |
| `features/*/composables/` | Logique, appels via `useFetch('/api/...')`, états de chargement | Manipulation du DOM |
| `stores/` | État global partagé et persistant | Logique de présentation |
| `server/api/` | Proxy, validation des entrées, mapping, gestion des erreurs | Logique d'UI |
| `server/adapters/` | Seul endroit qui connaît l'URL et le format de l'API externe | — |

### 6.4 Couche d'adaptateur

```ts
// shared/types/product.ts — modèle de domaine, indépendant de l'API
export interface Product {
  id: number
  slug: string
  title: string
  description: string
  price: Money            // { amount: number; currency: 'EUR' }
  compareAtPrice?: Money  // prix barré si remise
  discountPercent?: number
  rating: { average: number; count: number }
  stock: number
  availability: 'in_stock' | 'low_stock' | 'out_of_stock'
  brand?: string
  category: CategoryRef
  images: ProductImage[]
  thumbnail: ProductImage
  tags: string[]
}
```

```ts
// server/adapters/dummyjson/product.mapper.ts
export function toProduct(raw: DummyProduct): Product { /* mapping + calculs */ }
```

Les routes `server/api/**` n'exposent **que** des modèles de domaine. Remplacer DummyJSON par une autre API = réécrire `server/adapters/<api>/` uniquement.

### 6.5 Configuration d'environnement

- `runtimeConfig` pour l'URL de l'API (`NUXT_API_BASE_URL`) et les secrets de session.
- `.env.example` documenté et versionné ; `.env` ignoré.

---

## 7. Conventions et méthodes de développement

### 7.1 Code

- **Composition API** + `<script setup lang="ts">` exclusivement.
- **Code en anglais** (variables, fonctions, fichiers, commits) ; **contenu visible en i18n** (FR/EN). Fin du mélange `ajouterAuPanier` / `addToCart`.
- Nommage : composants en `PascalCase` (`ProductCard.vue`), composables `useXxx`, stores `useXxxStore`, fichiers utilitaires en `camelCase`.
- Props et emits typés (`defineProps<{...}>()`, `defineEmits<{...}>()`), `defineModel` pour le `v-model`.
- Commentaires **sur le *pourquoi***, pas sur le *quoi*. JSDoc sur les composables et utilitaires publics.
- Aucun `alert()`, `confirm()`, `console.log` en production → système de **toasts** et de **dialogues** du design system.
- Aucune chaîne en dur dans les templates → clés i18n.
- Taille indicative : composant < 200 lignes, sinon découper.

### 7.2 Styles

- Toutes les couleurs, rayons, ombres, espacements et typographies viennent des **tokens** du design system (définis dans `@theme`).
- Aucune couleur Tailwind « brute » (`green-600`, `gray-400`…) dans les composants : utiliser les tokens sémantiques (`bg-surface`, `text-muted`, `bg-primary`…).
- Variantes de composants gérées avec **`tailwind-variants`** (ou `cva`) plutôt que des chaînes de classes conditionnelles.
- Mode sombre géré **une seule fois** via `@nuxtjs/color-mode` et des tokens redéfinis.

### 7.3 Git

- Branches : `main` (production), `develop` (intégration), `feat/*`, `fix/*`, `chore/*`.
- **Conventional Commits** : `feat(cart): add quantity stepper`, `fix(auth): refresh token on 401`.
- Pull request obligatoire vers `main`, CI verte requise, preview de déploiement automatique.
- Tags de version sémantique (`v1.0.0`) et `CHANGELOG.md`.

### 7.4 Organisation

- Tableau Kanban (GitHub Projects) : *Backlog → À faire → En cours → Revue → Terminé*.
- Une issue par fonctionnalité, avec critères d'acceptation repris de ce document.
- *Definition of Done* : code typé, lint OK, tests écrits, i18n FR/EN, responsive vérifié, accessible au clavier, mode sombre vérifié.

---

## 8. Spécifications fonctionnelles — Boutique

> Priorités : **P1** = indispensable (MVP), **P2** = important, **P3** = bonus portfolio.

### 8.1 Layout global (P1)

- **Header** : logo, navigation catégories (méga-menu desktop, tiroir mobile), barre de recherche, accès favoris, compte, panier avec badge de quantité, sélecteur de langue, bascule de thème.
- **Footer** : liens (catégories, aide, à propos, mentions), sélecteur langue/thème, mention « projet portfolio — aucune vente réelle ».
- **Bandeau d'information** discret signalant qu'il s'agit d'une démo.
- Navigation mobile adaptée (barre inférieure ou tiroir).

### 8.2 Accueil (P1)

- Hero avec accroche et appel à l'action.
- Mise en avant des catégories.
- Carrousels : « Meilleures notes », « Promotions » (produits avec remise), « Nouveautés ».
- Bloc réassurance (livraison, retours, paiement sécurisé — explicitement fictifs).
- Bloc newsletter (formulaire validé, confirmation par toast, aucune donnée envoyée).

### 8.3 Catalogue / listing (P1)

- Grille de cartes produit responsive (1 → 4 colonnes).
- **Filtres** : catégorie, fourchette de prix, note minimale, marque, disponibilité, en promotion. *(Les filtres non supportés par l'API sont appliqués côté serveur Nitro.)*
- **Tri** : pertinence, prix croissant/décroissant, note, nouveautés.
- **Pagination** (ou « charger plus ») avec `limit`/`skip`.
- **État synchronisé dans l'URL** (`?category=…&sort=…&page=…`) : partageable, compatible bouton retour.
- Bascule vue grille / liste (P3).
- États : chargement (skeletons), vide (illustration + suggestion), erreur (message + bouton « Réessayer »).

### 8.4 Carte produit (P1)

- Image (avec image secondaire au survol en P2), titre (2 lignes max), marque, prix, prix barré et badge de remise, note, badge de stock faible.
- Actions : ajouter au panier, ajouter aux favoris.
- Entièrement cliquable et accessible au clavier.

### 8.5 Recherche (P1)

- Recherche dans le header avec **suggestions en direct** (debounce 300 ms, requête API `search`, 5 résultats max avec vignette et prix).
- Navigation clavier dans les suggestions (↑ ↓ Entrée Échap).
- Page de résultats `/search?q=` réutilisant le listing.
- Raccourci clavier `/` ou `Ctrl+K` pour ouvrir la recherche (P3).

### 8.6 Fiche produit (P1)

- URL lisible : `/products/<id>-<slug>`.
- Galerie : image principale + miniatures, zoom au survol ou plein écran (P2).
- Titre, marque, note et nombre d'avis, prix, remise, disponibilité, stock.
- Sélecteur de quantité (respecte stock et quantité minimale de commande).
- Boutons « Ajouter au panier » et « Ajouter aux favoris ».
- Onglets ou accordéons : description, caractéristiques (dimensions, poids, garantie), livraison et retours, **avis clients** (liste des avis de l'API).
- Produits similaires (même catégorie).
- Fil d'Ariane.
- Données structurées `Product` (schema.org) et métadonnées Open Graph.

### 8.7 Panier (P1)

- **Mini-panier** en tiroir latéral à l'ajout d'un produit.
- Page panier : liste des lignes (image, titre, prix unitaire, stepper de quantité, sous-total, supprimer), récapitulatif (sous-total, remise, livraison, total).
- Seuil de livraison gratuite avec barre de progression (P2).
- Code promo fictif (ex. `PORTFOLIO10`) validé côté client (P2).
- Annulation de suppression via toast « Annuler » (P2).
- **Persistance** locale du panier (survit au rechargement) ; synchronisation avec le panier API de l'utilisateur connecté (P2).
- Panier vide : état dédié avec suggestions.

### 8.8 Favoris (P2)

- Ajout / retrait depuis carte et fiche produit, persistance locale.
- Page `/wishlist` ; déplacement vers le panier.

### 8.9 Checkout simulé (P1)

Tunnel en 3 étapes avec indicateur de progression :

1. **Coordonnées & livraison** — formulaire validé (Zod), pré-rempli si connecté, choix du mode de livraison (fictif).
2. **Paiement** — formulaire de carte **factice**, clairement étiqueté « démo » ; aucun numéro réel accepté ni transmis (numéro de test prérempli proposé).
3. **Confirmation** — récapitulatif, numéro de commande généré, commande enregistrée dans l'historique local.

Le checkout est accessible en invité ou connecté.

### 8.10 Pages annexes (P2)

- À propos (présentation du projet et de la stack — utile pour le portfolio).
- FAQ / Aide.
- Mentions légales / confidentialité (version portfolio).
- Page 404 et page d'erreur personnalisées.

---

## 9. Spécifications fonctionnelles — Espace client

### 9.1 Authentification (P1)

- **Connexion** : identifiant + mot de passe, afficher/masquer le mot de passe, « se souvenir de moi », messages d'erreur clairs.
- **Comptes de démo** affichés sur la page de connexion (un client, un administrateur), remplissage en un clic.
- **Inscription** : formulaire validé (nom, prénom, e-mail, mot de passe avec indicateur de robustesse, confirmation, acceptation des conditions). L'API simulant la création, le compte est créé « en démo » et l'utilisateur en est informé.
- Redirection vers la page d'origine après connexion (`?redirect=`).
- Déconnexion depuis le menu compte.

### 9.2 Tableau de bord client (P1)

- Résumé : dernières commandes, nombre de favoris, informations du profil.
- **Profil** : consultation et modification (validation, toast de confirmation, modification simulée).
- **Commandes** : historique (paniers API de l'utilisateur + commandes passées via le checkout), détail d'une commande.
- **Adresses** : adresse(s) enregistrée(s) (P2).
- **Préférences** : langue, thème (P2).

---

## 10. Spécifications fonctionnelles — Back-office

Accessible uniquement aux utilisateurs ayant le rôle `admin` (middleware `admin` + vérification serveur). Layout dédié avec barre latérale repliable.

### 10.1 Tableau de bord (P1)

- Cartes KPI : nombre de produits, utilisateurs, commandes, chiffre d'affaires simulé (somme des paniers).
- Graphiques (P2) : ventes par catégorie, répartition des notes, produits en stock faible.
- Listes : dernières commandes, produits en rupture ou stock faible.

### 10.2 Produits (P1)

- **Tableau de données** : colonnes (image, titre, catégorie, prix, stock, note), tri, recherche, filtre par catégorie, pagination, sélection multiple.
- Création / édition dans un formulaire complet validé (titre, description, prix, remise, stock, marque, catégorie, images par URL).
- Suppression avec dialogue de confirmation.
- Actions groupées (suppression multiple) (P2).
- Export CSV de la vue courante (P3).

### 10.3 Utilisateurs (P1)

- Tableau : avatar, nom, e-mail, rôle, date — recherche, tri, pagination.
- Fiche détaillée, édition, suppression.

### 10.4 Commandes / paniers (P1)

- Tableau des paniers : identifiant, client, nombre d'articles, total, date.
- Détail d'une commande avec les lignes produits.
- Statut fictif (en attente, expédiée, livrée) modifiable localement (P2).

### 10.5 Comportement des écritures

Les opérations d'écriture étant simulées par l'API, le back-office applique une **mise à jour optimiste** de l'interface, affiche un toast de succès et rappelle, via une note discrète, que la modification n'est pas persistée côté serveur (voir §12.4).

---

## 11. Plan de routes

| Route | Page | Layout | Accès |
|------|------|--------|-------|
| `/` | Accueil | default | Public |
| `/products` | Catalogue complet | default | Public |
| `/categories/[slug]` | Catalogue filtré par catégorie | default | Public |
| `/products/[id]-[slug]` | Fiche produit | default | Public |
| `/search` | Résultats de recherche | default | Public |
| `/cart` | Panier | default | Public |
| `/wishlist` | Favoris | default | Public |
| `/checkout` | Tunnel de commande | default (épuré) | Public |
| `/checkout/success` | Confirmation | default | Public |
| `/login` | Connexion | auth | Visiteur (`guest`) |
| `/register` | Inscription | auth | Visiteur (`guest`) |
| `/account` | Tableau de bord client | default | Connecté (`auth`) |
| `/account/profile` | Profil | default | Connecté |
| `/account/orders` | Historique | default | Connecté |
| `/account/orders/[id]` | Détail commande | default | Connecté |
| `/admin` | Tableau de bord admin | admin | Admin |
| `/admin/products` | Liste produits | admin | Admin |
| `/admin/products/new` | Création produit | admin | Admin |
| `/admin/products/[id]` | Édition produit | admin | Admin |
| `/admin/users` · `/admin/users/[id]` | Utilisateurs | admin | Admin |
| `/admin/orders` · `/admin/orders/[id]` | Commandes | admin | Admin |
| `/about` · `/faq` · `/legal` | Pages annexes | default | Public |

Avec i18n : préfixe `/en/...` pour l'anglais, français sans préfixe.

---

## 12. Gestion d'état et données

### 12.1 Répartition

| Donnée | Où | Persistance |
|-------|----|-------------|
| Catalogue, produits, catégories | `useFetch` (cache Nuxt) | Non |
| Panier | Store `cart` | `localStorage` (cookie si SSR nécessaire) |
| Favoris | Store `wishlist` | `localStorage` |
| Session utilisateur | Store `auth` + cookie `httpOnly` côté serveur | Cookie |
| Commandes passées (checkout) | Store `orders` | `localStorage` |
| Thème | `@nuxtjs/color-mode` | Cookie |
| Langue | `@nuxtjs/i18n` | Cookie |
| Modifications admin simulées | Store `adminOverrides` | Session (mémoire) |

### 12.2 Store panier — exigences

- Getters : `itemCount`, `subtotal`, `discount`, `shipping`, `total`, `isEmpty`.
- Actions : `add(product, quantity)`, `updateQuantity(id, quantity)`, `remove(id)`, `clear()`, `applyPromo(code)`.
- Respect du stock disponible ; calculs en centimes (entiers) pour éviter les erreurs d'arrondi.
- Testé unitairement à 100 %.

### 12.3 Règles de chargement

- Chaque appel de données expose `pending`, `error`, `refresh` et l'UI gère **systématiquement** les trois états (skeleton, erreur avec relance, vide).
- Clés de cache explicites et stables (`products:list:${query}`).
- Prix formatés avec `Intl.NumberFormat` selon la langue.

### 12.4 Écritures simulées

L'API renvoie un succès sans persister. Stratégie :

1. Appel API réel (pour démontrer l'intégration).
2. Mise à jour optimiste de l'état local.
3. Toast de succès + mention « mode démo : modification non persistée ».
4. Réinitialisation possible via un bouton « Réinitialiser la démo » dans le back-office.

---

## 13. Authentification et sécurité

### 13.1 Flux

1. `POST /api/auth/login` (Nitro) → appelle l'API, reçoit `accessToken` + `refreshToken`.
2. Les tokens sont stockés dans des **cookies `httpOnly`, `secure`, `sameSite=lax`** côté serveur — **jamais** en `localStorage`.
3. `GET /api/auth/me` renvoie l'utilisateur courant (hydratation du store `auth` au démarrage, côté SSR).
4. Sur 401, tentative automatique de **refresh** puis rejeu de la requête ; échec → déconnexion propre.
5. `POST /api/auth/logout` supprime les cookies.

> Option : utiliser le module `nuxt-auth-utils` pour la gestion de session scellée.

### 13.2 Rôles

- `customer` et `admin`. L'API ne fournissant pas toujours un rôle exploitable, une **liste d'identifiants administrateurs de démo** est définie dans la configuration serveur.
- Les middlewares front (`auth`, `guest`, `admin`) gèrent la navigation ; **les routes serveur `/api/admin/*` vérifient elles aussi le rôle**.

### 13.3 Bonnes pratiques

- Validation Zod de **toutes** les entrées des routes serveur.
- Aucune donnée sensible dans les logs ni dans le bundle client.
- En-têtes de sécurité (CSP, `X-Frame-Options`, etc.) via `nuxt-security` (P2).
- Formulaire de paiement factice : aucun champ n'est envoyé ni stocké.
- Dépendances auditées (`pnpm audit`) dans la CI.

---

## 14. Exigences non fonctionnelles

### 14.1 Performance

- Lighthouse mobile ≥ **95** en performance sur accueil, catalogue et fiche produit.
- Core Web Vitals : **LCP < 2,5 s**, **CLS < 0,1**, **INP < 200 ms**.
- Images servies via `@nuxt/image` (WebP/AVIF, `srcset`, lazy loading hors écran, `priority` pour le LCP).
- Aucune image locale > 300 Ko.
- Code splitting par route, composants lourds en `Lazy*` (graphiques admin, galerie plein écran).
- Polices auto-hébergées, `font-display: swap`, 2 familles maximum.

### 14.2 Accessibilité (RGAA / WCAG 2.2 AA)

- Navigation complète au clavier, focus visible et soigné.
- Contrastes AA minimum dans les deux thèmes.
- Sémantique HTML (landmarks, titres hiérarchisés, listes, boutons vs liens).
- Libellés et messages d'erreur associés aux champs (`aria-describedby`).
- `NuxtRouteAnnouncer` conservé ; annonces `aria-live` pour panier et toasts.
- Respect de `prefers-reduced-motion`.
- Cible tactile ≥ 44 × 44 px.

### 14.3 Responsive

- Approche **mobile-first**.
- Points de rupture : 360, 640, 768, 1024, 1280, 1536 px.
- Testé sur Chrome, Firefox, Safari (desktop et iOS), Edge.

### 14.4 SEO

- `useSeoMeta` par page (titre, description, Open Graph, Twitter card).
- Sitemap et `robots.txt` générés.
- Données structurées : `Product`, `BreadcrumbList`, `Organization`.
- URL canoniques, balises `hreflang` FR/EN.
- Pages admin et compte en `noindex`.

### 14.5 Internationalisation

- FR (par défaut) et EN, toutes les chaînes externalisées.
- Formats de prix et de dates localisés.
- Le contenu produit (en anglais dans l'API) reste tel quel ; l'interface est traduite.

### 14.6 Devise

- Les prix de l'API sont convertis et affichés dans **une devise unique configurable** (par défaut EUR, option XOF/FCFA) via `app.config.ts`.

---

## 15. Qualité, tests et CI/CD

### 15.1 Qualité statique

- `nuxi typecheck` sans erreur.
- ESLint (`@nuxt/eslint`) + Prettier sans avertissement.
- Hooks `pre-commit` (lint-staged) et `commit-msg` (commitlint).

### 15.2 Tests

| Type | Outil | Cible minimale |
|------|-------|----------------|
| Unitaires | Vitest | Stores (panier, favoris, auth), utilitaires (prix, slug), mappers API — couverture ≥ 80 % sur ces dossiers |
| Composants | Vitest + `@nuxt/test-utils` | Composants `ui/` principaux, ProductCard, CartLine, formulaires |
| E2E | Playwright | 5 parcours critiques (ci-dessous) |
| Accessibilité | `@axe-core/playwright` | 0 violation critique sur les pages clés |

**Parcours E2E obligatoires**

1. Visiteur : accueil → catégorie → filtre → fiche produit → ajout panier → panier.
2. Visiteur : recherche avec suggestions → fiche produit.
3. Checkout complet en invité jusqu'à la confirmation.
4. Connexion client → consultation des commandes → déconnexion.
5. Connexion admin → création d'un produit → retour à la liste.

### 15.3 Intégration et déploiement continus

Workflow GitHub Actions sur chaque PR et push sur `main` :

1. Installation (pnpm, cache).
2. Lint + typecheck.
3. Tests unitaires et composants (avec rapport de couverture).
4. Build.
5. Tests E2E sur le build.
6. Déploiement : preview sur PR, production sur `main`.

Badge de statut CI dans le README.

---

## 16. Livrables

| # | Livrable | Format |
|---|----------|--------|
| L1 | Cahier des charges fonctionnel et technique (ce document) | `.md` |
| L2 | Cahier des charges graphique (charte, design system, maquettes attendues) | `.md` |
| L3 | Maquettes haute fidélité (desktop + mobile, clair + sombre) | Claude Design / Figma |
| L4 | Code source complet sur GitHub | Dépôt public |
| L5 | Application déployée avec URL publique | Vercel |
| L6 | README portfolio : présentation, captures, GIF de démo, stack, architecture, choix techniques, comptes de démo, lancement local | `.md` |
| L7 | Documentation d'architecture (ADR des choix majeurs) | `docs/adr/*.md` |
| L8 | Rapport Lighthouse et couverture de tests | Captures / badges |

---

## 17. Planning par lots

| Lot | Contenu | Durée indicative |
|-----|---------|------------------|
| **0 — Cadrage** | Validation CDC, nom, charte graphique, maquettes clés | 1 semaine |
| **1 — Fondations** | Init Nuxt 4, outillage (lint, tests, CI, hooks), tokens Tailwind, layouts, i18n, color-mode, adaptateur API + types | 1 semaine |
| **2 — Design system** | Composants `ui/` (Button, Input, Select, Badge, Card, Dialog, Drawer, Toast, Skeleton, Tabs, Pagination…) + page de démonstration interne `/_ui` | 1 semaine |
| **3 — Boutique** | Accueil, catalogue (filtres, tri, pagination, URL), recherche, fiche produit | 2 semaines |
| **4 — Panier & checkout** | Store panier, mini-panier, page panier, favoris, tunnel de commande | 1 semaine |
| **5 — Auth & compte** | Flux JWT + cookies, middlewares, login/register, espace client | 1 semaine |
| **6 — Back-office** | Layout admin, dashboard, CRUD produits/utilisateurs/commandes | 1,5 semaine |
| **7 — Finitions** | SEO, performance, accessibilité, tests E2E, pages annexes, 404 | 1 semaine |
| **8 — Publication** | Déploiement, README portfolio, captures, GIF, ADR | 0,5 semaine |

**Total indicatif : ~10 semaines** à temps partiel. Un **MVP** (lots 0 à 4, priorités P1) est présentable dès ~6 semaines.

---

## 18. Critères d'acceptation globaux

La refonte est considérée comme terminée lorsque :

- [ ] Tous les besoins **P1** sont implémentés et validés.
- [ ] Aucun appel direct du client vers l'API externe : tout passe par `/api/*`.
- [ ] Aucun `any`, aucun `alert()`, aucun `console.log`, aucune chaîne en dur non traduite.
- [ ] Le panier conserve quantités et contenu après rechargement.
- [ ] `/admin` et `/account` sont inaccessibles sans les droits requis, côté client **et** serveur.
- [ ] Tous les écrans existent en clair et sombre, en FR et EN, de 360 px à 1536 px.
- [ ] Lighthouse ≥ 95 sur les 4 axes pour l'accueil, le catalogue et la fiche produit.
- [ ] 0 violation d'accessibilité critique (axe).
- [ ] CI verte : lint, typecheck, tests unitaires, E2E, build.
- [ ] Application déployée, README portfolio complet, comptes de démo fonctionnels.

---

*Document suivant : **Cahier des charges graphique** — nom de l'application, charte graphique et design system à transmettre à Claude Design.*
