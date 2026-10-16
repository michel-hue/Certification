/**
 * 0–4: one point each for length ≥ 8, mixed case, a digit and a symbol.
 * Shared by the strength meter and the register schema (which requires ≥ 3).
 */
export function passwordScore(password: string): number {
  if (!password) return 0
  return [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length
}
