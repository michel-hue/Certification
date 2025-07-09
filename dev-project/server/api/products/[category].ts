export default defineEventHandler(async (event) => {
  const category = event.context.params?.category

  // Appel à l'API avec l'URL correcte
  const products = await $fetch(`https://fakestoreapi.com/products/category/${category}`)

  // On retourne un objet avec name + products comme le front l'attend
  return {
    name: category,
    products,
  }
})
