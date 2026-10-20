import type { H3Event } from 'h3'
import type { User } from '#shared/types/user'
import { refreshTokens, type AuthTokens } from '../adapters/dummyjson/auth'
import { UpstreamError } from '../adapters/dummyjson/client'

/** « Se souvenir de moi » keeps the session for 30 days; otherwise it ends with the browser. */
const REMEMBER_SECONDS = 60 * 60 * 24 * 30

export function sessionConfig(remember: boolean | undefined) {
  return remember ? { maxAge: REMEMBER_SECONDS } : {}
}

export function adminUserIds(event: H3Event): number[] {
  return String(useRuntimeConfig(event).adminUserIds)
    .split(',')
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id) && id > 0)
}

/** Opens (or replaces) the session. Tokens go to `secure`, out of the browser's reach. */
export async function startSession(
  event: H3Event,
  user: User,
  options: { tokens?: AuthTokens; remember: boolean },
) {
  await replaceUserSession(
    event,
    {
      user,
      remember: options.remember,
      demo: !options.tokens,
      ...(options.tokens && { secure: options.tokens }),
      loggedInAt: new Date().toISOString(),
    },
    sessionConfig(options.remember),
  )
}

/**
 * Runs a DummyJSON call with the user's access token. On a 401 the tokens are refreshed
 * once and the call replayed; if the refresh fails too, the session is closed (CDC §13.1).
 */
export async function withAccessToken<T>(
  event: H3Event,
  run: (accessToken: string) => Promise<T>,
): Promise<T> {
  const session = await requireUserSession(event)
  const tokens = session.secure
  if (!tokens?.accessToken) throw createError({ statusCode: 401, statusMessage: 'No upstream session' })

  try {
    return await run(tokens.accessToken)
  } catch (error) {
    if (!(error instanceof UpstreamError && error.status === 401) || !tokens.refreshToken) throw error
  }

  try {
    const { client } = useCatalogApi(event)
    const fresh = await refreshTokens(client, tokens.refreshToken)
    await setUserSession(event, { secure: fresh }, sessionConfig(session.remember))
    return await run(fresh.accessToken)
  } catch {
    await clearUserSession(event)
    throw createError({ statusCode: 401, statusMessage: 'Session expired' })
  }
}

/** Back-office guard for /api/admin/* (CDC §13.2): the server checks the role too. */
export async function requireAdmin(event: H3Event) {
  const session = await requireUserSession(event)
  if (session.user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  return session
}
