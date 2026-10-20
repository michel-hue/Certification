import { profileSchema } from '#shared/schemas/auth'
import { updateUser } from '../../adapters/dummyjson/auth'

/**
 * Profile edit: sent to DummyJSON (which simulates it), then kept in the session so the
 * change shows everywhere for the rest of the visit (CDC §12.4).
 */
export default defineEventHandler(async (event) => {
  const changes = await readValidatedBody(event, profileSchema.parse)
  const session = await requireUserSession(event)

  if (!session.demo) {
    const { client } = useCatalogApi(event)
    await withAccessToken(event, (token) => updateUser(client, session.user.id, changes, token)).catch(
      (error) => {
        throw toHttpError(error)
      },
    )
  }

  const user = { ...session.user, ...changes, phone: changes.phone || undefined }
  await setUserSession(event, { user }, sessionConfig(session.remember))
  return { user }
})
