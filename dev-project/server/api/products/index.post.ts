export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const response = await $fetch('https://fakestoreapi.com/products', {
    method: 'POST',
    body
  })

  return response
})