import type { LoginInput, ProfileInput, RegisterInput } from '#shared/schemas/auth'
import type { User } from '#shared/types/user'

/**
 * Authentication for the UI (CDC §13): wraps nuxt-auth-utils' session — hydrated during
 * SSR from the sealed cookie — with Étal's login, register, logout and profile calls.
 */
export function useAuth() {
  const session = useUserSession()

  async function login(input: LoginInput) {
    await $fetch('/api/auth/login', { method: 'POST', body: input })
    await session.fetch()
  }

  async function register(input: RegisterInput) {
    await $fetch('/api/auth/register', { method: 'POST', body: input })
    await session.fetch()
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await session.clear()
  }

  async function updateProfile(input: ProfileInput) {
    const { user } = await $fetch<{ user: User }>('/api/account/profile', { method: 'PUT', body: input })
    await session.fetch()
    return user
  }

  return {
    user: computed(() => session.user.value as User | null),
    loggedIn: session.loggedIn,
    isAdmin: computed(() => session.user.value?.role === 'admin'),
    isDemoAccount: computed(() => session.session.value?.demo === true),
    login,
    register,
    logout,
    updateProfile,
    refresh: session.fetch,
  }
}
