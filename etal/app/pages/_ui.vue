<script setup lang="ts">
import type { Product } from '#shared/types/catalog'
import { sampleProducts } from '~/design/showcase-products'

/*
 * Internal design-system sheet (CDC §17 lot 2, maquette E25). Developer-facing and
 * French-only by design, hence excluded from the « no bare strings » lint rule.
 */
useSeoMeta({ title: 'Design system', robots: 'noindex, nofollow' })

const toast = useToast()
const theme = useThemeToggle()

const nav = [
  ['couleurs', 'Couleurs'],
  ['typographie', 'Typographie'],
  ['actions', 'Actions'],
  ['formulaires', 'Formulaires'],
  ['navigation', 'Navigation'],
  ['commerce', 'Commerce'],
  ['retours', 'Retours'],
  ['etats', 'États'],
] as const

const swatches = [
  ['background', 'bg-background'],
  ['surface', 'bg-surface'],
  ['surface-muted', 'bg-surface-muted'],
  ['foreground', 'bg-foreground'],
  ['foreground-muted', 'bg-foreground-muted'],
  ['border', 'bg-border'],
  ['border-strong', 'bg-border-strong'],
  ['primary', 'bg-primary'],
  ['accent', 'bg-accent'],
  ['accent-text', 'bg-accent-text'],
  ['success', 'bg-success'],
  ['warning', 'bg-warning'],
  ['danger', 'bg-danger'],
  ['info', 'bg-info'],
  ['inverse', 'bg-inverse'],
] as const

const type = [
  ['display', 'text-display font-serif font-normal', 'Les essentiels'],
  ['h1', 'text-h1 font-serif font-medium', 'Titre de page'],
  ['h2', 'text-h2 font-serif font-medium', 'Titre de section'],
  ['h3', 'text-h3 font-serif font-medium', 'Titre de bloc'],
  ['h4', 'text-h4 font-semibold', "Sous-titre d'interface"],
  ['body-lg', 'text-body-lg', 'Chapô, descriptions longues.'],
  ['body', 'text-body', 'Texte courant, 16 px, interligne 1,6.'],
  ['ui (15)', 'text-ui font-medium', 'Boutons, liens, titres de carte'],
  ['body-sm', 'text-body-sm', 'Métadonnées, aide.'],
  ['meta (13)', 'text-meta', 'Bandeau démo, compteurs, avis'],
  ['caption', 'text-caption font-medium', 'Légendes, mentions'],
  ['overline', 'text-overline font-semibold uppercase', 'Nouveautés'],
] as const

// Forms
const email = ref('')
const emailError = computed(() =>
  email.value && !/^\S+@\S+\.\S+$/.test(email.value)
    ? 'Adresse e-mail invalide, par exemple vous@exemple.fr.'
    : '',
)
const password = ref('Etal2026')
const description = ref('Une description courte.')
const sort = ref('relevance')
const terms = ref(true)
const inStock = ref(true)
const onSale = ref(false)
const shipping = ref('standard')
const quantity = ref(1)
const selectedChips = ref(['Beauté'])
const activeFilters = ref(['Essence', '20 € – 80 €', '4 ★ et +'])

// Navigation
const tab = ref('desc')
const page = ref(4)
const step = ref(2)

// Commerce
const favorites = ref<number[]>([6])
const justAdded = ref<number | null>(null)
function add(product: Product) {
  justAdded.value = product.id
  toast.success('Ajouté à votre panier.')
  setTimeout(() => (justAdded.value = null), 1600)
}
function toggleFavorite(product: Product) {
  const on = favorites.value.includes(product.id)
  favorites.value = on ? favorites.value.filter((id) => id !== product.id) : [...favorites.value, product.id]
}

// Feedback
const dialogOpen = ref(false)
const confirmOpen = ref(false)
const drawerOpen = ref(false)
const sheetOpen = ref(false)
const loading = ref(false)
function fakeLoad() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
function undoToast() {
  toast.info('« Amazon Echo Plus » retiré du panier.', {
    label: 'Annuler',
    altText: 'Annuler le retrait du panier',
    run: () => toast.success('Article remis dans le panier.'),
  })
}
</script>

<template>
  <div class="mx-auto max-w-content px-gutter pt-10 pb-8">
    <SharedSectionHeading
      overline="Lot 2 · planche E25"
      title="Le design {em}"
      emphasis="system"
      :level="1"
      large
    >
      <template #actions>
        <ClientOnly>
          <UiButton
            variant="secondary"
            :icon-left="theme.isDark.value ? 'lucide:sun' : 'lucide:moon'"
            @click="theme.toggle"
          >
            {{ theme.label.value }}
          </UiButton>
        </ClientOnly>
      </template>
    </SharedSectionHeading>

    <nav
      aria-label="Sections de la planche"
      class="sticky top-header z-10 -mx-gutter border-b border-border bg-background px-gutter"
    >
      <ul class="flex gap-6 overflow-x-auto py-3 text-body-sm font-medium [scrollbar-width:none]">
        <li v-for="[id, label] in nav" :key="id">
          <a :href="`#${id}`" class="link-reveal whitespace-nowrap">{{ label }}</a>
        </li>
      </ul>
    </nav>

    <ShowcaseSection id="couleurs" overline="Fondations" title="Couleurs">
      <ul class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        <li v-for="[name, swatch] in swatches" :key="name" class="flex flex-col gap-2">
          <span class="h-16 rounded-md border border-border" :class="swatch" />
          <code class="text-meta">{{ name }}</code>
        </li>
      </ul>
      <p class="text-body-sm text-foreground-muted">
        Règle 70 / 20 / 10 : la terracotta reste rare. Basculez le thème pour voir « la même boutique, le soir
        ».
      </p>
    </ShowcaseSection>

    <ShowcaseSection id="typographie" overline="Fondations" title="Typographie">
      <dl class="flex flex-col">
        <div
          v-for="[token, classes, sample] in type"
          :key="token"
          class="grid grid-cols-[120px_1fr] items-baseline gap-6 border-b border-border py-4"
        >
          <dt class="text-meta text-foreground-muted">{{ token }}</dt>
          <dd :class="classes" class="m-0">{{ sample }}</dd>
        </div>
      </dl>
      <p class="text-h2 font-serif">Un mot mis en <em class="font-normal">valeur</em> en italique.</p>
    </ShowcaseSection>

    <ShowcaseSection id="actions" overline="Composants" title="Boutons, badges, chips">
      <ShowcaseItem label="Variantes">
        <UiButton>Primaire</UiButton>
        <UiButton variant="accent">Accent</UiButton>
        <UiButton variant="secondary">Secondaire</UiButton>
        <UiButton variant="outline">Contour</UiButton>
        <UiButton variant="ghost">Fantôme</UiButton>
        <UiButton variant="link">Lien</UiButton>
        <UiButton variant="danger">Supprimer</UiButton>
        <UiButton variant="danger-outline">Supprimer la sélection</UiButton>
      </ShowcaseItem>
      <ShowcaseItem label="Tailles · icônes · états">
        <UiButton size="sm">Petit · 36</UiButton>
        <UiButton>Moyen · 44</UiButton>
        <UiButton size="lg" icon-right="lucide:arrow-right">Grand · 52</UiButton>
        <UiButton variant="outline" icon="lucide:pencil" label="Modifier" />
        <UiButton :loading="loading" @click="fakeLoad">{{
          loading ? 'Connexion…' : 'Se connecter'
        }}</UiButton>
        <UiButton disabled>Désactivé</UiButton>
      </ShowcaseItem>
      <ShowcaseItem label="Pleine largeur">
        <div class="w-full max-w-sm"><UiButton block size="lg">Commander</UiButton></div>
      </ShowcaseItem>
      <ShowcaseItem label="Boutons icône">
        <UiIconButton icon="lucide:search" label="Rechercher" />
        <UiIconButton icon="lucide:user" label="Mon compte (Emily)" dot />
        <UiIconButton icon="lucide:heart" label="Favoris" :count="3" count-tone="primary" />
        <UiIconButton icon="lucide:shopping-bag" label="Panier, 2 articles" :count="2" />
      </ShowcaseItem>
      <ShowcaseItem label="Badges">
        <UiBadge tone="accent">−20 %</UiBadge>
        <UiBadge tone="warning">Stock faible</UiBadge>
        <UiBadge tone="success">En stock</UiBadge>
        <UiBadge tone="info">Expédiée</UiBadge>
        <UiBadge tone="danger">Épuisé</UiBadge>
        <UiBadge tone="outline">mascara</UiBadge>
        <UiBadge>Neutre</UiBadge>
        <UiBadge tone="demo">DÉMO</UiBadge>
      </ShowcaseItem>
      <ShowcaseItem label="Chips de filtre">
        <UiChip
          v-for="chip in ['Tout', 'Beauté', 'Mode', 'Maison']"
          :key="chip"
          :label="chip"
          :selected="selectedChips.includes(chip)"
          @toggle="selectedChips = [chip]"
        />
      </ShowcaseItem>
      <ShowcaseItem label="Filtres actifs">
        <UiChip
          v-for="filter in activeFilters"
          :key="filter"
          :label="filter"
          removable
          :remove-label="`Retirer le filtre ${filter}`"
          @remove="activeFilters = activeFilters.filter((item) => item !== filter)"
        />
        <UiButton variant="link" size="sm" @click="activeFilters = ['Essence', '20 € – 80 €', '4 ★ et +']"
          >Tout effacer</UiButton
        >
      </ShowcaseItem>
      <ShowcaseItem label="Avatars · séparateurs">
        <UiAvatar name="Emily Johnson" :size="24" />
        <UiAvatar name="Emily Johnson" :size="32" />
        <UiAvatar name="Emily Johnson" />
        <UiAvatar name="Emily Johnson" src="https://dummyjson.com/icon/emilys/128" :size="64" />
        <div class="w-48"><UiDivider label="ou" /></div>
        <div class="h-10"><UiDivider orientation="vertical" /></div>
        <UiSpinner size="md" label="Chargement" />
      </ShowcaseItem>
    </ShowcaseSection>

    <ShowcaseSection id="formulaires" overline="Composants" title="Formulaires">
      <div class="grid max-w-3xl gap-x-4 gap-y-5 sm:grid-cols-2">
        <UiFormField
          v-slot="{ id, describedBy, invalid }"
          label="E-mail"
          :error="emailError"
          help="Saisissez une adresse invalide pour voir l'erreur."
        >
          <UiInput
            :id="id"
            v-model="email"
            type="email"
            autocomplete="email"
            :aria-describedby="describedBy"
            :invalid="invalid"
          />
        </UiFormField>
        <UiFormField v-slot="{ id, describedBy, invalid }" label="Mot de passe">
          <UiInput
            :id="id"
            v-model="password"
            type="password"
            :aria-describedby="describedBy"
            :invalid="invalid"
          />
        </UiFormField>
        <div class="sm:col-span-2"><UiPasswordStrength :password="password" /></div>
        <UiFormField v-slot="{ id }" label="Trier par">
          <UiSelect
            :id="id"
            v-model="sort"
            :options="[
              { value: 'relevance', label: 'Pertinence' },
              { value: 'price-asc', label: 'Prix croissant' },
              { value: 'price-desc', label: 'Prix décroissant' },
              { value: 'rating', label: 'Meilleures notes' },
            ]"
          />
        </UiFormField>
        <UiFormField v-slot="{ id }" label="Recherche">
          <UiInput
            :id="id"
            type="search"
            size="sm"
            icon-left="lucide:search"
            kbd="/"
            placeholder="Rechercher un produit, une marque…"
          />
        </UiFormField>
        <UiFormField v-slot="{ id }" label="Description" class="sm:col-span-2">
          <UiTextarea :id="id" v-model="description" :maxlength="400" />
        </UiFormField>
        <UiFormField v-slot="{ id }" label="Champ désactivé">
          <UiInput :id="id" model-value="Lecture seule" disabled />
        </UiFormField>
        <div class="flex flex-col gap-2">
          <UiCheckbox v-model="terms" label="J'accepte les conditions d'utilisation de cette démo." />
          <UiSwitch v-model="inStock" label="En stock uniquement" />
          <UiSwitch v-model="onSale" label="En promotion" />
        </div>
        <fieldset class="flex flex-col gap-2.5 sm:col-span-2">
          <legend class="mb-2.5 text-body-sm font-medium">Mode de livraison</legend>
          <UiRadioCard
            v-model="shipping"
            name="shipping"
            value="standard"
            label="Standard"
            description="3 à 5 jours ouvrés"
            aside="4,90 €"
          />
          <UiRadioCard
            v-model="shipping"
            name="shipping"
            value="relay"
            label="Point relais"
            description="4 à 6 jours ouvrés"
            aside="2,90 €"
          />
          <UiRadioCard
            v-model="shipping"
            name="shipping"
            value="express"
            label="Express"
            description="Livré demain avant 13 h"
            aside="9,90 €"
          />
        </fieldset>
      </div>
      <ShowcaseItem label="Quantité · notes">
        <UiQuantityStepper v-model="quantity" :max="4" size="sm" />
        <UiQuantityStepper v-model="quantity" :max="4" />
        <UiQuantityStepper v-model="quantity" :max="4" size="lg" />
        <UiRatingStars :value="4.5" />
        <UiRatingStars :value="2.56" :size="20" />
      </ShowcaseItem>
    </ShowcaseSection>

    <ShowcaseSection id="navigation" overline="Composants" title="Navigation">
      <UiBreadcrumb
        :items="[
          { label: 'Accueil', to: '/' },
          { label: 'Beauté', to: '/products' },
          { label: 'Essence Mascara Lash Princess' },
        ]"
      />
      <UiTabs
        v-model="tab"
        label="Informations produit"
        :tabs="[
          { value: 'desc', label: 'Description' },
          { value: 'specs', label: 'Caractéristiques' },
          { value: 'ship', label: 'Livraison & retours' },
          { value: 'reviews', label: 'Avis (3)' },
        ]"
      >
        <template #desc><p class="max-w-2xl text-body-lg">Contenu de l'onglet « Description ».</p></template>
        <template #specs
          ><p class="max-w-2xl text-body-lg">Contenu de l'onglet « Caractéristiques ».</p></template
        >
        <template #ship
          ><p class="max-w-2xl text-body-lg">Contenu de l'onglet « Livraison & retours ».</p></template
        >
        <template #reviews><p class="max-w-2xl text-body-lg">Contenu de l'onglet « Avis ».</p></template>
      </UiTabs>
      <ShowcaseItem label="Pagination · desktop et mobile">
        <UiPagination :page="page" :page-count="17" @change="page = $event" />
        <UiPagination :page="page" :page-count="17" compact @change="page = $event" />
      </ShowcaseItem>
      <ShowcaseItem label="Étapes du checkout">
        <UiStepper
          :steps="['Livraison', 'Paiement', 'Confirmation']"
          :current="step"
          label="Étapes de commande"
        />
        <UiButton variant="outline" size="sm" @click="step = (step % 3) + 1">Étape suivante</UiButton>
      </ShowcaseItem>
    </ShowcaseSection>

    <ShowcaseSection id="commerce" overline="Composants" title="Commerce">
      <SharedSectionHeading overline="Sélection" title="Les mieux {em}" emphasis="notés">
        <template #actions>
          <UiButton variant="outline" icon="lucide:chevron-left" label="Précédent" />
          <UiButton variant="outline" icon="lucide:chevron-right" label="Suivant" />
        </template>
      </SharedSectionHeading>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-x-6 gap-y-10">
        <ProductCard
          v-for="product in sampleProducts"
          :key="product.id"
          :product="product"
          :is-favorite="favorites.includes(product.id)"
          :just-added="justAdded === product.id"
          @add="add"
          @toggle-favorite="toggleFavorite"
        />
      </div>
      <ShowcaseItem label="Prix">
        <SharedPrice :price="{ amount: 1240, currency: 'EUR' }" />
        <SharedPrice
          :price="{ amount: 3586, currency: 'EUR' }"
          :compare-at="{ amount: 4600, currency: 'EUR' }"
          :discount-percent="22"
          size="lg"
          show-percent
        />
        <SharedPrice :price="{ amount: 6029, currency: 'XOF' }" />
      </ShowcaseItem>
    </ShowcaseSection>

    <ShowcaseSection id="retours" overline="Composants" title="Retours et superpositions">
      <div class="grid max-w-3xl gap-3">
        <UiAlert tone="info" title="Information">Connectez-vous pour accéder à cette page.</UiAlert>
        <UiAlert tone="success">Code PORTFOLIO10 appliqué : −10 %.</UiAlert>
        <UiAlert tone="warning">Plus que 4 en stock.</UiAlert>
        <UiAlert tone="danger">Certains champs sont à corriger.</UiAlert>
        <UiAlert demo>Formulaire factice. N'entrez aucun vrai numéro de carte.</UiAlert>
      </div>
      <ShowcaseItem label="Toasts">
        <UiButton
          variant="outline"
          @click="
            toast.success('Ajouté à vos favoris.', {
              label: 'Voir',
              altText: 'Voir vos favoris',
              run: () => navigateTo('/wishlist'),
            })
          "
          >Succès</UiButton
        >
        <UiButton variant="outline" @click="toast.error('Certains champs sont à corriger.')">Erreur</UiButton>
        <UiButton variant="outline" @click="undoToast">Info + Annuler</UiButton>
      </ShowcaseItem>
      <ShowcaseItem label="Dialogues et tiroirs">
        <UiButton variant="outline" @click="dialogOpen = true">Dialogue</UiButton>
        <UiButton variant="danger-outline" @click="confirmOpen = true"
          >Supprimer « Amazon Echo Plus »</UiButton
        >
        <UiButton variant="outline" @click="drawerOpen = true">Tiroir droit (panier)</UiButton>
        <UiButton variant="outline" @click="sheetOpen = true">Tiroir bas (filtres mobile)</UiButton>
        <UiTooltip text="Infobulle : fond encre, texte ivoire">
          <UiButton variant="ghost" icon="lucide:info" label="Afficher l'infobulle" />
        </UiTooltip>
      </ShowcaseItem>

      <UiDialog
        v-model:open="dialogOpen"
        title="Mode démo"
        description="Les écritures sont simulées par l'API : rien n'est conservé côté serveur."
      >
        <template #footer><UiButton @click="dialogOpen = false">Compris</UiButton></template>
      </UiDialog>
      <UiConfirmDialog
        v-model:open="confirmOpen"
        title="Supprimer « Amazon Echo Plus » ?"
        description="Le produit sera retiré du catalogue de la démo. L'API simule la suppression : rien n'est effacé côté serveur."
        confirm-label="Supprimer"
        @confirm="toast.success('Produit supprimé · mode démo : non persisté.')"
      />
      <UiDrawer v-model:open="drawerOpen" title="Votre panier">
        <SharedEmptyState
          title="Votre panier attend sa première trouvaille."
          illustration="illustration trait fin"
          size="md"
        >
          <UiButton @click="drawerOpen = false">Découvrir la sélection</UiButton>
        </SharedEmptyState>
      </UiDrawer>
      <UiDrawer v-model:open="sheetOpen" side="bottom" title="Filtres">
        <div class="flex flex-col gap-4 p-6">
          <UiSwitch v-model="inStock" label="En stock uniquement" />
          <UiSwitch v-model="onSale" label="En promotion" />
        </div>
        <template #footer>
          <UiButton size="lg" block @click="sheetOpen = false">Voir 24 produits</UiButton>
          <UiButton variant="outline" block>Réinitialiser</UiButton>
        </template>
      </UiDrawer>
    </ShowcaseSection>

    <ShowcaseSection id="etats" overline="Composants" title="Chargement, vide, erreur">
      <div
        class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-6"
        aria-busy="true"
        aria-label="Chargement des produits"
      >
        <div v-for="index in 2" :key="index" class="flex flex-col gap-3.5">
          <UiSkeleton class="aspect-4/5" />
          <UiSkeleton variant="text" :lines="2" />
        </div>
        <div class="flex flex-col gap-3">
          <UiSkeleton class="h-12" />
          <UiSkeleton class="h-12" />
          <UiSkeleton class="h-12" />
        </div>
      </div>
      <SharedEmptyState
        title="Rien à l'étal pour « xyz »."
        text="Essayez un autre terme, ou retirez quelques filtres."
        illustration="illustration trait fin · étal vide"
      >
        <UiButton>Réinitialiser les filtres</UiButton>
      </SharedEmptyState>
      <SharedErrorState
        title="Nous n'arrivons pas à charger les produits."
        text="Vérifiez votre connexion, puis réessayez."
        framed
        :retrying="loading"
        @retry="fakeLoad"
      />
    </ShowcaseSection>
  </div>
</template>
