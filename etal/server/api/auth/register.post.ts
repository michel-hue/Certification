import { registerSchema } from '#shared/schemas/auth'
import type { User } from '#shared/types/user'
import { registerUser } from '../../adapters/dummyjson/auth'

/**
 * Demo sign-up (CDC §9.1): DummyJSON simulates the creation, so the account only lives in
 * this session. The password is validated, then dropped — it is never stored or forwarded.
 */
export default defineEventHandler(async (event) => {
  const { firstName, lastName, email } = await readValidatedBody(event, registerSchema.parse)
  const { client } = useCatalogApi(event)
  try {
    const { id } = await registerUser(client, { firstName, lastName, email })
    const user: User = { id, username: email, email, firstName, lastName, role: 'customer' }
    await startSession(event, user, { remember: true })
    return { user }
  } catch (error) {
    throw toHttpError(error)
  }
})
