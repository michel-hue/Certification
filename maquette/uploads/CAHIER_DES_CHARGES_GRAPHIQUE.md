# Cahier des charges graphique — **Étal**

> **Destinataire** : Claude Design
> **Projet** : refonte de l'application e-commerce portfolio (Nuxt 4 + Tailwind CSS v4 + API DummyJSON)
> **Auteur** : Archange — Syabe Technologies
> **Version** : 1.0 — 16 octobre 2026
> **Document de référence fonctionnel** : `CAHIER_DES_CHARGES.md` (écrans, routes, parcours)

---

## Sommaire

1. [Brief en une page](#1-brief-en-une-page)
2. [La marque Étal](#2-la-marque-étal)
3. [Logo](#3-logo)
4. [Couleurs](#4-couleurs)
5. [Typographie](#5-typographie)
6. [Grille, espacements et mise en page](#6-grille-espacements-et-mise-en-page)
7. [Formes, bordures, ombres](#7-formes-bordures-ombres)
8. [Iconographie](#8-iconographie)
9. [Images et direction photo](#9-images-et-direction-photo)
10. [Mouvement et micro-interactions](#10-mouvement-et-micro-interactions)
11. [Composants du design system](#11-composants-du-design-system)
12. [Écrans à maquetter](#12-écrans-à-maquetter)
13. [États et cas limites](#13-états-et-cas-limites)
14. [Accessibilité](#14-accessibilité)
15. [Ton et microcopie](#15-ton-et-microcopie)
16. [Ce qu'il faut éviter](#16-ce-quil-faut-éviter)
17. [Livrables attendus](#17-livrables-attendus)
18. [Annexe — tokens prêts à l'emploi](#18-annexe--tokens-prêts-à-lemploi)

---

## 1. Brief en une page

| | |
|---|---|
| **Nom** | Étal |
| **Quoi** | Boutique en ligne multi-catégories (beauté, mode, maison, tech, épicerie…) — projet portfolio, aucune vente réelle |
| **Direction** | **Éditorial premium** : l'esprit d'un concept-store et d'un magazine de mode, appliqué à un e-commerce |
| **Trois mots** | Sobre · Élégant · Généreux |
| **Inspirations d'esprit** | Magazines de mode imprimés, concept-stores, sites de maisons d'édition — grandes images, typographie serif affirmée, beaucoup d'air |
| **Cible** | Recruteurs et clients potentiels du développeur (le site doit impressionner en 10 secondes), puis « acheteurs » 25–45 ans exigeants sur l'esthétique |
| **Supports** | Web responsive, de 360 px à 1536 px, thèmes clair **et** sombre |
| **Contrainte clé** | Les photos produits viennent d'une API gratuite (fonds hétérogènes, qualité variable) : le design doit **les mettre en valeur malgré tout** (voir §9) |

**La phrase à retenir** : *« Un étal de marché, présenté comme une double page de magazine. »*

---

## 2. La marque Étal

### 2.1 Pourquoi « Étal »

L'étal est la table où le marchand expose ses produits : c'est la vitrine la plus ancienne et la plus directe. Le nom est court (4 lettres), français, facile à prononcer en anglais (*« ay-tal »*), et il porte une idée claire : **présenter les produits avec soin**.

### 2.2 Positionnement

- Pas un discounter, pas une marketplace bruyante.
- Une sélection présentée avec un regard éditorial : chaque catégorie est traitée comme une rubrique de magazine, chaque produit comme un sujet.

### 2.3 Personnalité

| Étal est… | Étal n'est pas… |
|-----------|-----------------|
| Calme, confiant | Criard, agressif (pas de « -70 % !!! » clignotant) |
| Raffiné | Élitiste ou froid |
| Précis, soigné dans les détails | Chargé, décoratif pour rien |
| Chaleureux par la matière (ivoire, terracotta) | Clinique (blanc pur + gris) |

### 2.4 Signature

- Baseline FR : **« Le choix, exposé avec soin. »**
- Baseline EN : **« Thoughtfully displayed. »**

---

## 3. Logo

### 3.1 Demande

- **Logotype** typographique « Étal » en **Fraunces** (ou serif proche), graisse 500–600, l'accent aigu du É pouvant être légèrement retravaillé et devenir l'élément distinctif (ex. accent en terracotta, ou accent en forme de petite lame/trait horizontal évoquant le plateau d'un étal).
- **Monogramme** « É » seul, pour favicon, avatar, onglet navigateur, icône d'application (PWA).
- Interdiction d'utiliser un pictogramme de caddie, de sac ou de panier : le nom suffit.

### 3.2 Déclinaisons attendues

| Version | Usage |
|---------|-------|
| Logotype encre sur ivoire | Version principale |
| Logotype ivoire sur encre | Thème sombre, footer |
| Logotype monochrome noir / blanc | Usages techniques |
| Monogramme « É » | Favicon (16, 32, 48 px), PWA (192, 512 px), Open Graph |

### 3.3 Règles

- Zone de protection : hauteur du « É » sur les quatre côtés.
- Taille minimale : 72 px de large (logotype), 16 px (monogramme).
- Livrer en SVG optimisé (chemins vectorisés, pas de police embarquée).

---

## 4. Couleurs

### 4.1 Palette de marque

| Nom | Hex | Rôle |
|-----|-----|------|
| **Encre** | `#1F1F1F` | Texte principal, boutons primaires, logo |
| **Ivoire** | `#F7F4EE` | Fond principal (thème clair) |
| **Papier** | `#FFFFFF` | Cartes, champs, surfaces élevées (thème clair) |
| **Terracotta** | `#B5543C` | Accent de marque : badges, prix promo, éléments actifs, illustrations |
| **Terracotta profonde** | `#9A4530` | Liens et petits textes d'accent (contraste AA) |
| **Pierre** | `#8A8378` | Bordures, séparateurs, éléments décoratifs **uniquement** (pas de texte) |
| **Pierre foncée** | `#6B655C` | Texte secondaire, légendes, métadonnées |
| **Sable** | `#EAE4D9` | Fonds de sections alternées, fond des vignettes produit |

### 4.2 Couleurs fonctionnelles

| Rôle | Clair | Sombre |
|------|-------|--------|
| Succès | `#3F6B4E` (sauge foncée) | `#7FAE8E` |
| Erreur | `#A33A2B` | `#E07A6A` |
| Avertissement | `#8C6A1F` (ocre) | `#D4A84A` |
| Information | `#3E5C76` (bleu ardoise) | `#8FB0CC` |

Les couleurs fonctionnelles restent **désaturées** pour ne pas casser l'harmonie chaude.

### 4.3 Thème sombre

Le sombre n'est pas une inversion : c'est **« la même boutique, le soir »** — chaud, jamais bleuté.

| Token | Clair | Sombre |
|-------|-------|--------|
| `background` | `#F7F4EE` | `#121212` |
| `surface` | `#FFFFFF` | `#1B1A18` |
| `surface-muted` | `#EAE4D9` | `#24221F` |
| `foreground` | `#1F1F1F` | `#EDE8DF` |
| `foreground-muted` | `#6B655C` | `#A39C90` |
| `border` | `#DDD6CA` | `#2F2C28` |
| `border-strong` | `#8A8378` | `#4A453F` |
| `primary` (bouton) | `#1F1F1F` | `#EDE8DF` |
| `primary-foreground` | `#F7F4EE` | `#121212` |
| `accent` | `#B5543C` | `#D9785E` |
| `accent-foreground` | `#FFFFFF` | `#121212` |
| `accent-text` (liens) | `#9A4530` | `#E08A70` |
| `ring` (focus) | `#B5543C` | `#D9785E` |

### 4.4 Contrastes vérifiés (WCAG 2.2)

| Combinaison | Ratio | Verdict |
|-------------|-------|---------|
| Encre sur Ivoire | 15,0 : 1 | AAA |
| Pierre foncée sur Ivoire | 5,3 : 1 | AA texte |
| Terracotta profonde sur Ivoire | 5,9 : 1 | AA texte |
| Blanc sur Terracotta | 4,9 : 1 | AA texte (boutons accent) |
| Terracotta sur Ivoire | 4,5 : 1 | AA grand texte / éléments d'interface uniquement |
| Pierre sur Ivoire | 3,4 : 1 | ⚠️ décoratif seulement |
| Texte sombre `#EDE8DF` sur `#121212` | 15,4 : 1 | AAA |
| Texte secondaire sombre `#A39C90` sur `#121212` | 6,9 : 1 | AA |
| Terracotta sombre `#D9785E` sur `#121212` | 6,1 : 1 | AA |

### 4.5 Proportions

Règle **70 / 20 / 10** : 70 % ivoire et papier, 20 % encre (texte, boutons), **10 % maximum de terracotta**. La terracotta est rare, donc précieuse : elle guide l'œil vers ce qui compte (promo, état actif, CTA secondaire).

---

## 5. Typographie

### 5.1 Familles

| Usage | Police | Source | Graisses |
|-------|--------|--------|----------|
| Titres, logotype, chiffres éditoriaux | **Fraunces** (variable, axes `opsz` et `SOFT`) | Google Fonts | 400, 500, 600 + italique 400 |
| Interface, texte courant, prix | **Inter** (variable) | Google Fonts | 400, 500, 600 |

Les deux polices sont auto-hébergées via `@nuxt/fonts`. Activer les **chiffres tabulaires** d'Inter (`font-variant-numeric: tabular-nums`) pour les prix, quantités et tableaux admin.

### 5.2 Échelle typographique

Échelle fluide (`clamp`) entre mobile (360 px) et desktop (1280 px).

| Token | Police | Mobile → Desktop | Interlignage | Usage |
|-------|--------|------------------|--------------|-------|
| `display` | Fraunces 400, `opsz` 144 | 44 → 88 px | 1.0 | Hero accueil |
| `h1` | Fraunces 500 | 34 → 56 px | 1.05 | Titres de page |
| `h2` | Fraunces 500 | 28 → 40 px | 1.1 | Titres de section |
| `h3` | Fraunces 500 | 22 → 28 px | 1.2 | Titres de bloc, nom produit (fiche) |
| `h4` | Inter 600 | 18 → 20 px | 1.3 | Sous-titres d'interface |
| `body-lg` | Inter 400 | 18 px | 1.6 | Chapô, descriptions longues |
| `body` | Inter 400 | 16 px | 1.6 | Texte courant |
| `body-sm` | Inter 400 | 14 px | 1.5 | Métadonnées, aide |
| `caption` | Inter 500 | 12 px | 1.4 | Légendes, mentions |
| `overline` | Inter 600, MAJUSCULES, `letter-spacing: 0.12em` | 11–12 px | 1.2 | Surtitres de rubrique (« NOUVEAUTÉS », « BEAUTÉ ») |
| `price` | Inter 500, tabulaire | 16 → 20 px | 1 | Prix |

### 5.3 Règles

- **Serif pour l'émotion, sans-serif pour l'action** : Fraunces ne s'utilise jamais pour un bouton, un champ ou un tableau.
- Italique de Fraunces autorisé pour un mot mis en valeur dans un titre (*« Les essentiels de la* saison *»*).
- Longueur de ligne : 60–75 caractères pour le texte courant.
- Surtitre `overline` systématique au-dessus des titres de section de l'accueil et des catégories (signature éditoriale).
- Pas plus de 3 tailles de texte dans un même composant.

---

## 6. Grille, espacements et mise en page

### 6.1 Grille

| Écran | Colonnes | Gouttière | Marges |
|-------|----------|-----------|--------|
| Mobile (< 640) | 4 | 16 px | 16 px |
| Tablette (640–1023) | 8 | 24 px | 32 px |
| Desktop (≥ 1024) | 12 | 24 px | 48 px |
| Large (≥ 1440) | 12 | 32 px | auto, contenu max 1360 px |

### 6.2 Espacements

Base **4 px**. Échelle : `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.

- Entre sections de l'accueil : **96–128 px** desktop, **64 px** mobile → l'air fait partie de l'identité.
- Intérieur des cartes : 16–24 px.

### 6.3 Principes de composition éditoriale

- **Asymétrie maîtrisée** : sur l'accueil, alterner une grande image (7 colonnes) et un bloc texte (4 colonnes + 1 de vide).
- **Grille de magazine** pour les catégories : une tuile principale large + tuiles secondaires.
- Lignes fines (1 px, `border`) pour structurer plutôt que des cartes ombrées partout.
- Numérotation éditoriale facultative (« 01 — Beauté », « 02 — Maison »).

### 6.4 Points de rupture

`360 · 640 · 768 · 1024 · 1280 · 1536` px (alignés sur Tailwind).

---

## 7. Formes, bordures, ombres

| Token | Valeur | Usage |
|-------|--------|-------|
| `radius-none` | 0 | Images éditoriales pleine largeur, hero |
| `radius-sm` | 2 px | Badges, tags |
| `radius-md` | 4 px | Boutons, champs, cartes |
| `radius-lg` | 8 px | Dialogues, tiroirs, popovers |
| `radius-full` | 9999 px | Avatars, pastilles de quantité uniquement |
| `border-width` | 1 px | Partout ; 1,5 px pour le focus des champs |

**Ombres** : quasi absentes. L'élévation s'exprime par la **couleur de surface** (papier sur ivoire) et les **bordures fines**.

| Token | Valeur | Usage |
|-------|--------|-------|
| `shadow-sm` | `0 1px 2px rgb(31 31 31 / 0.06)` | Header collant au défilement |
| `shadow-md` | `0 8px 24px -8px rgb(31 31 31 / 0.12)` | Popovers, menus déroulants |
| `shadow-lg` | `0 24px 48px -16px rgb(31 31 31 / 0.18)` | Dialogues, tiroir panier |

En thème sombre, remplacer les ombres par une bordure `border` légèrement plus claire.

---

## 8. Iconographie

- Bibliothèque : **Lucide** (via `@nuxt/icon`), un seul jeu pour toute l'app.
- Trait : **1,5 px**, terminaisons arrondies.
- Tailles : 16 px (inline), 20 px (boutons, navigation), 24 px (header mobile).
- Couleur : `currentColor`, jamais en terracotta par défaut (sauf état actif : favori ajouté, filtre actif).
- Toujours accompagnées d'un libellé ou d'un `aria-label`.

---

## 9. Images et direction photo

### 9.1 Le défi

Les visuels produits de l'API sont hétérogènes (fonds blancs, gris, détourés ou non). Le design doit **uniformiser la présentation**.

### 9.2 Règles de présentation des produits

- Chaque vignette produit est posée dans un **cadre `surface-muted` (sable)** au ratio fixe **4:5**, image en `object-contain` avec un padding de 8–12 %.
- Option : `mix-blend-mode: multiply` en thème clair pour fondre les fonds blancs dans le sable (à valider en maquette).
- En thème sombre, le cadre passe en `#24221F` ; prévoir un léger fond clair arrondi derrière les images à fond blanc si le rendu l'exige.
- Survol (desktop) : bascule vers la deuxième image du produit si elle existe, sinon léger zoom (1,03).

### 9.3 Images éditoriales (hero, catégories, bannières)

- Photos d'ambiance libres de droits (Unsplash/Pexels), auto-hébergées et optimisées.
- Tonalité : **lumière naturelle, tons chauds, grain léger**, compositions avec de l'espace négatif pour accueillir un titre.
- Traitement unifié : légère désaturation (−10 %), réchauffement des tons.
- Jamais de photo avec un texte incrusté ou un logo tiers.

### 9.4 Illustrations

Pour les états vides (panier vide, aucun résultat, 404) : **illustrations au trait fin**, monochromes encre avec un unique aplat terracotta. Style dessin d'éditeur, pas de personnages 3D ni de style « Corporate Memphis ».

---

## 10. Mouvement et micro-interactions

### 10.1 Principes

Le mouvement est **lent, fluide, discret** — comme une page qu'on tourne, pas comme une app de jeu.

| Token | Durée | Courbe | Usage |
|-------|-------|--------|-------|
| `motion-fast` | 150 ms | `cubic-bezier(0.2, 0, 0, 1)` | Survols, focus, toggles |
| `motion-base` | 250 ms | `cubic-bezier(0.2, 0, 0, 1)` | Ouverture de menus, popovers |
| `motion-slow` | 400 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Tiroirs, dialogues, transitions de page |
| `motion-reveal` | 600 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Apparition au défilement |

### 10.2 Interactions signatures

- **Lien éditorial** : soulignement fin qui se dessine de gauche à droite au survol.
- **Ajout au panier** : le bouton se transforme brièvement en « Ajouté ✓ », la pastille du panier dans le header pulse une fois, le mini-panier s'ouvre en tiroir à droite.
- **Favori** : le cœur se remplit en terracotta avec un léger rebond (scale 1 → 1,15 → 1).
- **Apparition au défilement** : titres et images en fondu + translation de 12 px, en cascade (60 ms d'écart).
- **Transitions de page** : fondu croisé simple (150 ms).
- **Skeletons** : couleur `surface-muted`, animation de lueur lente (1,6 s).

### 10.3 Accessibilité

Avec `prefers-reduced-motion: reduce`, toutes les translations, cascades et effets de zoom sont supprimés ; seuls les fondus ≤ 150 ms restent.

---

## 11. Composants du design system

Chaque composant est livré avec **toutes ses variantes et tous ses états** : repos, survol, focus clavier, actif/pressé, désactivé, chargement, erreur — en clair et en sombre.

### 11.1 Fondations

| Composant | Variantes / remarques |
|-----------|----------------------|
| **Button** | `primary` (encre), `accent` (terracotta), `secondary` (contour encre), `ghost`, `link` · tailles `sm` 36 px / `md` 44 px / `lg` 52 px · avec icône gauche/droite, icône seule, pleine largeur, état chargement (spinner + libellé conservé) |
| **IconButton** | Rond ou carré, avec badge de compteur (panier) |
| **Link** | Inline (souligné), navigation (soulignement animé) |
| **Badge** | `neutral`, `accent` (promo « −20 % »), `success` (en stock), `warning` (stock faible), `outline` (catégorie) |
| **Tag / Chip** | Filtre sélectionnable, filtre actif supprimable (×) |
| **Divider** | Horizontal, vertical, avec libellé centré |
| **Avatar** | Image, initiales, tailles 24/32/40/64 |
| **Skeleton** | Texte, image, carte produit, ligne de tableau |
| **Spinner** | 16 / 24 px |

### 11.2 Formulaires

| Composant | Remarques |
|-----------|-----------|
| **Input** | Libellé au-dessus, texte d'aide, message d'erreur avec icône, icône préfixe/suffixe, bouton afficher/masquer (mot de passe) |
| **Textarea** | Compteur de caractères optionnel |
| **Select** | Natif stylé + version personnalisée (Reka UI) |
| **Checkbox / Radio / Switch** | Avec libellé et description |
| **QuantityStepper** | − / valeur / +, bornes min/max, désactivation aux limites |
| **RangeSlider** | Double poignée (filtre prix) avec champs min/max |
| **RatingInput / RatingStars** | Étoiles fines, demi-étoiles en affichage |
| **SearchField** | Avec suggestions (vignette, titre, prix, surlignage du terme), raccourci clavier affiché |
| **PasswordStrength** | Barre 4 segments + libellé |
| **FormField** | Wrapper libellé + champ + aide + erreur |

### 11.3 Navigation

| Composant | Remarques |
|-----------|-----------|
| **AppHeader** | Transparent sur le hero puis ivoire + `shadow-sm` au défilement ; logo centré ou à gauche (proposer les deux) |
| **MegaMenu** | Catégories en colonnes + une image éditoriale mise en avant |
| **MobileNav** | Tiroir plein écran avec catégories en grand Fraunces |
| **Breadcrumb** | Séparateur « / » fin |
| **Tabs** | Soulignement terracotta sur l'onglet actif |
| **Pagination** | Numéros + précédent/suivant, version compacte mobile |
| **Stepper** | Étapes du checkout (1 Livraison — 2 Paiement — 3 Confirmation) |
| **AppFooter** | Fond encre, texte ivoire, grand logotype, colonnes de liens, mention portfolio |
| **AdminSidebar** | Repliable (icônes seules), section active marquée |
| **DemoBanner** | Bandeau fin en haut : « Projet portfolio — aucune commande réelle » + bouton fermer |

### 11.4 Commerce

| Composant | Remarques |
|-----------|-----------|
| **ProductCard** | Cadre image 4:5, marque en `overline`, titre (2 lignes max), note, prix + prix barré, badge promo/stock, bouton favori en surimpression, « Ajouter » au survol (desktop) / toujours visible (mobile) · variantes : grille, liste, compacte (suggestions, carrousel) |
| **Price** | Prix courant, prix barré, pourcentage, devise localisée |
| **ProductGallery** | Image principale + miniatures verticales (desktop) / carrousel avec points (mobile), vue plein écran |
| **ProductInfo** | Bloc fiche : marque, titre Fraunces, note, prix, stock, quantité, CTA, réassurance |
| **ReviewCard** | Note, auteur, date, commentaire |
| **ReviewSummary** | Note moyenne en grand Fraunces + histogramme 5→1 étoiles |
| **CategoryTile** | Image éditoriale + nom de catégorie en Fraunces + nombre de produits |
| **CartDrawer** | Tiroir droit : lignes, sous-total, barre de livraison gratuite, CTA « Voir le panier » / « Commander » |
| **CartLine** | Vignette, titre, variante, stepper, prix, supprimer |
| **OrderSummary** | Sous-total, remise, livraison, total, champ code promo |
| **FreeShippingProgress** | « Plus que 12,40 € pour la livraison offerte » + barre |
| **FilterPanel** | Barre latérale desktop / tiroir bas mobile, sections repliables, bouton « Réinitialiser » |
| **SortSelect** | Liste de tri |
| **ActiveFilters** | Chips des filtres actifs |

### 11.5 Feedback et superpositions

| Composant | Remarques |
|-----------|-----------|
| **Toast** | En bas à droite (desktop) / bas centre (mobile), variantes succès/erreur/info, action optionnelle (« Annuler ») |
| **Alert** | Bandeau dans le contenu (info, succès, avertissement, erreur) |
| **Dialog** | Confirmation (suppression), formulaire |
| **Drawer** | Droite (panier), bas (filtres mobile), gauche (menu mobile) |
| **Popover / Tooltip** | Fond encre, texte ivoire |
| **EmptyState** | Illustration + titre + texte + CTA |
| **ErrorState** | Message + bouton « Réessayer » |

### 11.6 Back-office

| Composant | Remarques |
|-----------|-----------|
| **StatCard** | Libellé `overline`, valeur en grand Fraunces, variation (+12 %) |
| **DataTable** | En-têtes triables, sélection multiple, actions par ligne (menu « … »), pagination, densité confortable/compacte, état vide et chargement |
| **ChartCard** | Graphique sobre : encre + terracotta + pierre, pas de dégradés |
| **Toolbar** | Recherche, filtres, bouton d'action principale |

---

## 12. Écrans à maquetter

Chaque écran en **desktop (1440 px)** et **mobile (390 px)**, **thème clair**. Le thème sombre est demandé au minimum sur les écrans marqués ★.

### 12.1 Boutique

| # | Écran | Contenu clé |
|---|-------|-------------|
| E1 ★ | **Accueil** | Bandeau démo · header transparent · hero éditorial (grande image + titre `display` + baseline + CTA) · rubriques catégories en grille magazine · carrousel « Meilleures notes » · bloc éditorial asymétrique (image + texte) · carrousel « Promotions » · réassurance · newsletter · footer encre |
| E2 ★ | **Catalogue / catégorie** | En-tête de catégorie (surtitre, titre Fraunces, chapô, image) · barre filtres + tri + compteur de résultats · filtres actifs · grille produits · pagination |
| E3 | Catalogue — panneau filtres mobile | Tiroir bas plein écran |
| E4 | **Recherche** | Suggestions ouvertes dans le header · page de résultats · état « aucun résultat » |
| E5 ★ | **Fiche produit** | Fil d'Ariane · galerie · bloc info · onglets (description, caractéristiques, livraison) · résumé et liste des avis · produits similaires |
| E6 ★ | **Tiroir mini-panier** | Ouvert après ajout |
| E7 | **Panier** | Lignes, récapitulatif, code promo, livraison offerte, panier vide |
| E8 | **Favoris** | Grille + état vide |
| E9 | **Checkout — étape 1** | Coordonnées + livraison, récap à droite (desktop) / repliable (mobile) |
| E10 | **Checkout — étape 2** | Paiement factice clairement étiqueté « Démo » |
| E11 | **Confirmation de commande** | Remerciement éditorial, numéro, récap, CTA |

### 12.2 Compte

| # | Écran | Contenu clé |
|---|-------|-------------|
| E12 ★ | **Connexion** | Layout scindé : image éditoriale à gauche, formulaire à droite · encart « Comptes de démo » (client / admin) cliquables |
| E13 | **Inscription** | Même layout, indicateur de robustesse du mot de passe |
| E14 | **Tableau de bord client** | Navigation compte, résumé, dernières commandes |
| E15 | Profil | Formulaire d'édition |
| E16 | Historique + détail d'une commande | Liste, statut, lignes |

### 12.3 Back-office

| # | Écran | Contenu clé |
|---|-------|-------------|
| E17 ★ | **Dashboard admin** | Sidebar · 4 StatCards · 2 graphiques · dernières commandes · stock faible |
| E18 ★ | **Liste produits** | Toolbar + DataTable |
| E19 | **Formulaire produit** | Création/édition en sections (infos, prix & stock, images, catégorie), aperçu de la carte produit en direct |
| E20 | Utilisateurs | Liste + fiche |
| E21 | Commandes | Liste + détail |
| E22 | Dialogue de confirmation de suppression | — |

### 12.4 Système

| # | Écran |
|---|-------|
| E23 | Page 404 (ton éditorial : « Cette page n'est plus à l'étal. ») |
| E24 | Page erreur 500 |
| E25 | **Planche design system** : couleurs, typos, espacements, tous les composants et leurs états |

---

## 13. États et cas limites

À représenter dans les maquettes ou la planche de composants :

- **Chargement** : skeletons de la grille produit, de la fiche produit et des tableaux admin.
- **Vide** : panier, favoris, recherche sans résultat, commandes, tableau admin filtré.
- **Erreur** : API indisponible (ErrorState + « Réessayer »), erreurs de champs de formulaire.
- **Textes extrêmes** : titre produit très long (troncature à 2 lignes), prix à 5 chiffres, nom de catégorie long.
- **Produits** : en rupture (CTA désactivé + « Me prévenir » fictif), stock faible, en promotion, sans avis.
- **Images** : produit sans seconde image, image qui ne charge pas (placeholder monogramme « É » sur sable).
- **Mode démo** : toast « Modification enregistrée — mode démo, non persistée » côté admin.

---

## 14. Accessibilité

- Contrastes **WCAG 2.2 AA** minimum dans les deux thèmes (paires validées au §4.4).
- **Focus visible** soigné : anneau 2 px `ring` (terracotta) avec 2 px de décalage, jamais supprimé.
- Cibles tactiles ≥ **44 × 44 px**.
- L'information ne repose jamais sur la couleur seule (promo = badge texte « −20 % », erreur = icône + texte).
- Taille de texte minimale : 12 px (légendes), 16 px pour les champs (évite le zoom iOS).
- Ordre de lecture logique dans les mises en page asymétriques.

---

## 15. Ton et microcopie

- Vouvoiement, phrases courtes, ton **posé et élégant**, une pointe d'esprit éditorial.
- Verbes d'action clairs sur les boutons : « Ajouter au panier », « Commander », « Enregistrer ».
- Exemples :

| Contexte | Texte |
|----------|-------|
| Panier vide | « Votre panier attend sa première trouvaille. » + « Découvrir la sélection » |
| Recherche sans résultat | « Rien à l'étal pour « {terme} ». Essayez un autre mot ou parcourez nos rubriques. » |
| Ajout au panier | « Ajouté à votre panier. » |
| 404 | « Cette page n'est plus à l'étal. » |
| Bandeau démo | « Étal est un projet portfolio : aucune commande ni paiement réel. » |
| Erreur API | « Nous n'arrivons pas à charger les produits. » + « Réessayer » |

Toutes les maquettes en **français** ; prévoir que les libellés anglais peuvent être ~20 % plus longs ou plus courts.

---

## 16. Ce qu'il faut éviter

- ❌ Vert/bleu « boutique générique » de l'ancienne version, dégradés, néons.
- ❌ Ombres portées fortes et cartes flottantes partout.
- ❌ Coins très arrondis (> 8 px) et boutons pilule.
- ❌ Bannières promo criardes, comptes à rebours, pop-ups d'entrée.
- ❌ Plus de 10 % de terracotta sur un écran.
- ❌ Fraunces dans les boutons, champs ou tableaux.
- ❌ Icônes mélangées de plusieurs bibliothèques, emojis dans l'interface.
- ❌ Fonds blancs purs `#FFFFFF` en fond de page (réservés aux surfaces).
- ❌ Personnages 3D, illustrations « Corporate Memphis ».

---

## 17. Livrables attendus

| # | Livrable | Format |
|---|----------|--------|
| D1 | Logo : logotype + monogramme + déclinaisons | SVG + PNG |
| D2 | Favicon et icônes PWA | ICO, PNG 16/32/48/192/512 |
| D3 | Planche design system (E25) | Maquette |
| D4 | Maquettes haute fidélité E1 à E24, desktop + mobile, clair (+ sombre pour ★) | Maquette |
| D5 | Prototype cliquable du parcours principal : Accueil → Catégorie → Produit → Mini-panier → Panier → Checkout → Confirmation | Prototype |
| D6 | Image Open Graph (1200 × 630) | PNG |
| D7 | Tokens finalisés (couleurs, typo, espacements, rayons, ombres, mouvement) | CSS (voir annexe) / JSON |
| D8 | Illustrations des états vides et pages d'erreur | SVG |

---

## 18. Annexe — tokens prêts à l'emploi

Proposition de base au format **Tailwind CSS v4** (`app/assets/css/main.css`). Claude Design peut l'ajuster ; la version finale fera foi pour le développement.

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Polices */
  --font-serif: "Fraunces", ui-serif, Georgia, serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  /* Palette de marque */
  --color-ink: #1F1F1F;
  --color-ivory: #F7F4EE;
  --color-paper: #FFFFFF;
  --color-sand: #EAE4D9;
  --color-stone: #8A8378;
  --color-stone-dark: #6B655C;
  --color-terracotta: #B5543C;
  --color-terracotta-deep: #9A4530;

  /* Tokens sémantiques (thème clair) */
  --color-background: var(--color-ivory);
  --color-surface: var(--color-paper);
  --color-surface-muted: var(--color-sand);
  --color-foreground: var(--color-ink);
  --color-foreground-muted: var(--color-stone-dark);
  --color-border: #DDD6CA;
  --color-border-strong: var(--color-stone);
  --color-primary: var(--color-ink);
  --color-primary-foreground: var(--color-ivory);
  --color-accent: var(--color-terracotta);
  --color-accent-foreground: #FFFFFF;
  --color-accent-text: var(--color-terracotta-deep);
  --color-ring: var(--color-terracotta);
  --color-success: #3F6B4E;
  --color-danger: #A33A2B;
  --color-warning: #8C6A1F;
  --color-info: #3E5C76;

  /* Rayons */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Ombres */
  --shadow-sm: 0 1px 2px rgb(31 31 31 / 0.06);
  --shadow-md: 0 8px 24px -8px rgb(31 31 31 / 0.12);
  --shadow-lg: 0 24px 48px -16px rgb(31 31 31 / 0.18);

  /* Mouvement */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;

  /* Typographie fluide */
  --text-display: clamp(2.75rem, 1.6rem + 4.9vw, 5.5rem);
  --text-h1: clamp(2.125rem, 1.5rem + 2.7vw, 3.5rem);
  --text-h2: clamp(1.75rem, 1.4rem + 1.6vw, 2.5rem);
  --text-h3: clamp(1.375rem, 1.2rem + 0.7vw, 1.75rem);
}

/* Thème sombre : « la même boutique, le soir » */
.dark {
  --color-background: #121212;
  --color-surface: #1B1A18;
  --color-surface-muted: #24221F;
  --color-foreground: #EDE8DF;
  --color-foreground-muted: #A39C90;
  --color-border: #2F2C28;
  --color-border-strong: #4A453F;
  --color-primary: #EDE8DF;
  --color-primary-foreground: #121212;
  --color-accent: #D9785E;
  --color-accent-foreground: #121212;
  --color-accent-text: #E08A70;
  --color-ring: #D9785E;
  --color-success: #7FAE8E;
  --color-danger: #E07A6A;
  --color-warning: #D4A84A;
  --color-info: #8FB0CC;
}
```

---

*Étal — « Le choix, exposé avec soin. »*
