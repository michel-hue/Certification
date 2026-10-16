import type { z } from 'zod'

export type QueryValue = string | number | undefined
export type Fetcher = (
  path: string,
  options: { baseURL: string; query?: Record<string, QueryValue> },
) => Promise<unknown>

/** Raised for any failure talking to the external API; routes turn it into an HTTP error. */
export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status: 404 | 502,
    options?: { cause?: unknown },
  ) {
    super(message, options)
    this.name = 'UpstreamError'
  }
}

export interface DummyJsonClient {
  get<S extends z.ZodType>(path: string, schema: S, query?: Record<string, QueryValue>): Promise<z.output<S>>
}

function statusOf(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    return typeof error.status === 'number' ? error.status : undefined
  }
  return undefined
}

/**
 * The only place that knows DummyJSON's URL. Every response is validated, so callers
 * receive typed data or an `UpstreamError` — never a half-shaped payload.
 */
export function createDummyJsonClient(baseURL: string, fetcher: Fetcher): DummyJsonClient {
  return {
    async get(path, schema, query) {
      let body: unknown
      try {
        body = await fetcher(path, { baseURL, query })
      } catch (error) {
        if (statusOf(error) === 404) throw new UpstreamError(`Not found: ${path}`, 404, { cause: error })
        throw new UpstreamError(`DummyJSON request failed: ${path}`, 502, { cause: error })
      }

      const parsed = schema.safeParse(body)
      if (!parsed.success) {
        throw new UpstreamError(`Unexpected DummyJSON payload: ${path}`, 502, { cause: parsed.error })
      }
      return parsed.data
    },
  }
}
