/** Editorial rubriques with their translated names and links (header, mega-menu, footer). */
export function useSections() {
  const { sections } = useAppConfig()
  const { t } = useI18n()

  return computed(() =>
    sections.map((section) => ({
      ...section,
      name: t(`sections.${section.id}.name`),
      chapo: t(`sections.${section.id}.chapo`),
      photo: t(`sections.${section.id}.photo`),
      to: { path: '/products', query: { g: section.id } },
      categoryLinks: section.categories.map((slug) => ({
        slug,
        name: t(`categories.${slug}`),
        to: `/categories/${slug}`,
      })),
    })),
  )
}
