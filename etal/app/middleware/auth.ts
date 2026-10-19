/** Pages for signed-in users (CDC §13.2): visitors go to /login, then come back. */
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  if (loggedIn.value) return
  const localePath = useLocalePath()
  return navigateTo(localePath({ path: '/login', query: { redirect: to.fullPath } }))
})
