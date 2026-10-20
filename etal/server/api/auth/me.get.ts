import { currentUser } from '../../adapters/dummyjson/auth'

/** Current user, refreshed from DummyJSON when the session has tokens (CDC §13.1). */
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session.demo) return { user: session.user }

  const { client } = useCatalogApi(event)
  const user = await withAccessToken(event, (token) => currentUser(client, token, adminUserIds(event)))
  // Keep local profile edits (the API does not persist them) over the upstream copy.
  const merged = { ...user, ...session.user, role: user.role }
  await setUserSession(event, { user: merged }, sessionConfig(session.remember))
  return { user: merged }
})
