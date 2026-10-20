import { buildSitemap, sitemapPaths } from '../seo/sitemap'

/** Generated from the cached catalogue; cached for an hour itself. */
export default defineCachedEventHandler(
  async (event) => {
    const { siteUrl } = useRuntimeConfig(event).public
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    try {
      return buildSitemap(siteUrl, sitemapPaths(await getCatalog(event)))
    } catch (error) {
      throw toHttpError(error)
    }
  },
  { name: 'sitemap', maxAge: 60 * 60, swr: true },
)
