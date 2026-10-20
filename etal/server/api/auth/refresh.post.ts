import { refreshTokens } from '../../adapters/dummyjson/auth'

/** Explicit token refresh; API calls also refresh on their own when they meet a 401. */
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const refreshToken = session.secure?.refreshToken
  if (!refreshToken) throw createError({ statusCode: 400, statusMessage: 'Nothing to refresh' })

  const { client } = useCatalogApi(event)
  try {
    const tokens = await refreshTokens(client, refreshToken)
    await setUserSession(event, { secure: tokens }, sessionConfig(session.remember))
    return { ok: true }
  } catch {
    await clearUserSession(event)
    throw createError({ statusCode: 401, statusMessage: 'Session expired' })
  }
})
