import type { User as EtalUser } from './user'

/**
 * Session shape for nuxt-auth-utils. `user` is public (sent to the browser); `secure`
 * holds the DummyJSON tokens and never leaves the server (CDC §13.1).
 */
declare module '#auth-utils' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends EtalUser {}

  interface UserSession {
    /** Account created through the demo register form: no DummyJSON tokens behind it. */
    demo?: boolean
    /** « Se souvenir de moi »: persistent cookie instead of a browser-session one. */
    remember?: boolean
  }

  interface SecureSessionData {
    accessToken?: string
    refreshToken?: string
  }
}

export {}
