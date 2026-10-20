import { z } from 'zod'

/** Same rule everywhere an e-mail is typed (newsletter, checkout, register, profile). */
export const emailSchema = z.email()
