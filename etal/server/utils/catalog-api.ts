import type { H3Event } from 'h3'
import { createDummyJsonClient, UpstreamError } from '../adapters/dummyjson/client'

/** Per-request access to the catalog adapter, configured from runtime and app config. */
export function useCatalogApi(event: H3Event) {
  const { apiBaseUrl } = useRuntimeConfig(event)
  const { currency } = useAppConfig()
  return { client: createDummyJsonClient(apiBaseUrl, $fetch), currency }
}

/** Converts adapter failures into HTTP errors without leaking upstream details. */
export function toHttpError(error: unknown): Error {
  if (error instanceof UpstreamError) {
    return createError({
      statusCode: error.status,
      statusMessage: error.status === 404 ? 'Not Found' : 'Bad Gateway',
    })
  }
  return error instanceof Error ? error : createError({ statusCode: 500 })
}
