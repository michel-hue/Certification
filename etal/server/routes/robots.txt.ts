import { buildRobots } from '../seo/sitemap'

/** Dynamic so the sitemap line carries the deployed site URL. */
export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return buildRobots(useRuntimeConfig(event).public.siteUrl)
})
