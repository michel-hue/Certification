export default defineEventHandler(async (event) => {
  if (event.req.method === 'POST') {
    const body = await readBody(event)
    // Vérifie les données et enregistre-les
    return { message: 'Panier ajouté' }
  }
})
