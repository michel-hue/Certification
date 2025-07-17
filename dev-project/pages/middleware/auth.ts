// middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
    const userId = localStorage.getItem('userId')

    // Vérifie s’il y a un utilisateur
    if (!userId || isNaN(Number(userId))) {
      alert('⚠️ Vous devez être connecté pour accéder à cette page.')
      return navigateTo('/users/auth/login')
    }
  }
})
