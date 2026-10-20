/** Login and register are for visitors: a signed-in user is sent to their space. */
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value) return
  // Lot 6 sends admins to /admin once the back office exists.
  return navigateTo(useLocalePath()('/account'))
})
