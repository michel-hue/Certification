export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID manquant' })
  }

  const body = await readBody(event)

  try {
    const response = await $fetch(`https://fakestoreapi.com/products/${id}`, {
      method: 'PUT',
      body
    })
    return response
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la mise à jour du produit' })
  }
})
