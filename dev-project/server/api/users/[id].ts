export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const method = event.method

  if (method === 'GET') {
    // Lire un utilisateur
    return await $fetch(`https://fakestoreapi.com/users/${id}`)
  }

  if (method === 'DELETE') {
    // Supprimer un utilisateur
    return await $fetch(`https://fakestoreapi.com/users/${id}`, {
      method: 'DELETE',
    })
  }

  if (method === 'PUT') {
    // Modifier un utilisateur
    const body = await readBody(event)
    return await $fetch(`https://fakestoreapi.com/users/${id}`, {
      method: 'PUT',
      body,
    })
  }
})
