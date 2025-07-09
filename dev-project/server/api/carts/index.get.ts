export default defineEventHandler(async (event) => {
  const response= await $fetch (`https://fakestoreapi.com/carts/`)
  return response
})