export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID manquant',
    })
  }

  const product = await $fetch(`https://fakestoreapi.com/products/${id}`)
  return product
})

