# Étal

> Le choix, exposé avec soin. — Boutique en ligne éditoriale, projet portfolio (aucune vente réelle).

Nuxt 4 · TypeScript strict · Tailwind CSS v4 · Pinia · Zod · @nuxtjs/i18n (FR/EN) · DummyJSON

_Le README portfolio complet (captures, démo, choix techniques) arrive au lot 8._

## Démarrer

```bash
corepack enable          # pnpm est fourni par Node via corepack
pnpm install
cp .env.example .env
pnpm dev                 # http://localhost:3000
```

## Scripts

| Commande                         | Rôle                                                 |
| -------------------------------- | ---------------------------------------------------- |
| `pnpm dev` / `build` / `preview` | Développement, build de production, aperçu           |
| `pnpm lint` / `format`           | ESLint (`@nuxt/eslint`) + Prettier                   |
| `pnpm typecheck`                 | `vue-tsc` sur l'app, le serveur et `shared/`         |
| `pnpm test` / `test:coverage`    | Vitest : `unit` (Node) et `nuxt` (composants)        |
| `pnpm test:e2e`                  | Playwright + axe sur le build (`pnpm build` d'abord) |

Les commits suivent [Conventional Commits](https://www.conventionalcommits.org) (vérifiés par commitlint via Husky).

## Architecture

```
app/        Interface Nuxt (layouts, pages fines, composants, features)
server/     Routes Nitro /api/* — le client ne parle jamais à DummyJSON
  adapters/dummyjson/   Seul code qui connaît l'API : client HTTP, schémas Zod, mappers
shared/     Types de domaine, schémas et utilitaires partagés client/serveur
i18n/       Traductions FR (défaut, sans préfixe) et EN (/en)
tests/      unit · components · e2e · fixtures (réponses DummyJSON réelles)
```

Les prix de l'API (USD) sont convertis côté serveur en entiers (centimes) dans la devise de `app.config.ts` (EUR par défaut, XOF possible).
