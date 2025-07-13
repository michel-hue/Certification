export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Champs manquants' }))
  }

  try {
    // Appel FakeStoreAPI login
    const res = await $fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      body: { username, password }
    })

    // On renvoie directement le token reçu
    if (res.token) {
      return { token: res.token }
    } else {
      return sendError(event, createError({ statusCode: 401, statusMessage: 'Identifiants invalides' }))
    }
  } catch (e) {
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Erreur serveur FakeStoreAPI' }))
  }
})
