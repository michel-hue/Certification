export default defineEventHandler(async (event) => {
  // Récupérer le paramètre userId dans la query
  const userId = getQuery(event).userId

  // Appel vers fakestoreapi pour récupérer tous les paniers
  const allCarts = await $fetch('https://fakestoreapi.com/carts')

  if (userId) {
    // Filtrer les paniers selon userId (attention à bien comparer types)
    const filteredCarts = allCarts.filter(cart => String(cart.userId) === String(userId))
    return filteredCarts
  }

  return allCarts
})
