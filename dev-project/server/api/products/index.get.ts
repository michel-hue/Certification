export default defineEventHandler(async (event) => {
  const response= await $fetch ("https://fakestoreapi.com/products")
  return response
})