import { loginSchema } from '#shared/schemas/auth'
import { currentUser, login } from '../../adapters/dummyjson/auth'
import { UpstreamError } from '../../adapters/dummyjson/client'

/** Logs in against DummyJSON; tokens end up in the sealed httpOnly session only. */
export default defineEventHandler(async (event) => {
  const { username, password, remember } = await readValidatedBody(event, loginSchema.parse)
  const { client } = useCatalogApi(event)
  try {
    const tokens = await login(client, { username, password })
    const user = await currentUser(client, tokens.accessToken, adminUserIds(event))
    await startSession(event, user, { tokens, remember })
    return { user }
  } catch (error) {
    // DummyJSON answers 400 for bad credentials; one generic 401 never says which part was wrong.
    if (error instanceof UpstreamError && (error.status === 400 || error.status === 401)) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }
    throw toHttpError(error)
  }
})
