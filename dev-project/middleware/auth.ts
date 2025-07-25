export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return
  console.log('Middleware auth appelé')

  const userId = localStorage.getItem('userId')
  console.log('userId dans middleware:', userId)

  if (!userId || isNaN(Number(userId))) {
    alert('Connectez vous')
    console.log('Redirection vers login')
    return navigateTo('/users/auth/login')
  }
})



