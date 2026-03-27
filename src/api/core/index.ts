// Core API Layer - Re-exports
export { HttpClient } from './http-client'
export { createHttpClient } from './http-factory'
export { normalizeHttpError, isApiError } from './http-errors'
export { attachAuthInterceptor } from './auth-interceptor'
export type {
  ServiceKind,
  RequestContext,
  HttpRequestOptions,
  ApiErrorShape,
  PaginatedResponse,
} from './http-types'
export type { TokenProvider } from './auth-interceptor'
