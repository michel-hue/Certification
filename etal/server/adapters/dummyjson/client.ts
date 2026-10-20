import type { z } from 'zod'

export type QueryValue = string | number | undefined
export interface FetchOptions {
  baseURL: string
  query?: Record<string, QueryValue>
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  headers?: Record<string, string>
}
export type Fetcher = (path: string, options: FetchOptions) => Promise<unknown>

export type UpstreamStatus = 400 | 401 | 404 | 502

/** Raised for any failure talking to the external API; routes turn it into an HTTP error. */
export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status: UpstreamStatus,
    options?: { cause?: unknown },
  ) {
    super(message, options)
    this.name = 'UpstreamError'
  }
}

export interface RequestOptions {
  query?: Record<string, QueryValue>
  /** DummyJSON access token, sent as a Bearer header. */
  token?: string
}

export interface DummyJsonClient {
  get<S extends z.ZodType>(path: string, schema: S, options?: RequestOptions): Promise<z.output<S>>
  send<S extends z.ZodType>(
    method: 'POST' | 'PUT' | 'DELETE',
    path: string,
    schema: S,
    body?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<z.output<S>>
}

function statusOf(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    return typeof error.status === 'number' ? error.status : undefined
  }
  return undefined
}

function toUpstreamStatus(status: number | undefined): UpstreamStatus {
  return status === 400 || status === 401 || status === 404 ? status : 502
}

/**
 * The only place that knows DummyJSON's URL. Every response is validated, so callers
 * receive typed data or an `UpstreamError` — never a half-shaped payload.
 */
export function createDummyJsonClient(baseURL: string, fetcher: Fetcher): DummyJsonClient {
  async function request<S extends z.ZodType>(
    path: string,
    schema: S,
    init: Omit<FetchOptions, 'baseURL'>,
  ): Promise<z.output<S>> {
    let body: unknown
    try {
      body = await fetcher(path, { baseURL, ...init })
    } catch (error) {
      const status = toUpstreamStatus(statusOf(error))
      throw new UpstreamError(`DummyJSON request failed (${status}): ${path}`, status, { cause: error })
    }

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      throw new UpstreamError(`Unexpected DummyJSON payload: ${path}`, 502, { cause: parsed.error })
    }
    return parsed.data
  }

  const headersFor = (token?: string) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {})

  return {
    get(path, schema, { query, token } = {}) {
      return request(path, schema, { ...(query && { query }), ...headersFor(token) })
    },
    send(method, path, schema, body, options = {}) {
      return request(path, schema, { method, ...(body && { body }), ...headersFor(options.token) })
    },
  }
}
