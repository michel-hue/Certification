/**
 * Back office (CDC §10, §13.2). Visitors go to /login; signed-in customers are told and
 * sent to their account. The /api/admin/* routes check the role again server-side.
 */
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession()
  const localePath = useLocalePath()
  if (!loggedIn.value) return navigateTo(localePath({ path: '/login', query: { redirect: to.fullPath } }))
  if (user.value?.role === 'admin') return

  if (import.meta.client) {
    const { t } = useNuxtApp().$i18n
    useToast().error(t('auth.adminOnly'))
  }
  return navigateTo(localePath('/account'))
})
