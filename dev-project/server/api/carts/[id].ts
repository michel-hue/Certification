export default defineEventHandler(async (event) => {
  const id = event.context.params.id

  const response = await $fetch(`https://fakestoreapi.com/carts/${id}`)
  return response
})