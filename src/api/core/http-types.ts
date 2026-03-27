import type { AxiosRequestConfig } from 'axios'

// ─── Service Kind ────────────────────────────────────────────────
export type ServiceKind = 'internal' | 'external'

// ─── Request Context (điểm cắm auth cho tương lai) ──────────────
export interface RequestContext {
  /** Yêu cầu gắn JWT/Token vào request? */
  requiresAuth?: boolean
  /** Loại service gọi API */
  serviceKind?: ServiceKind
  /** Timeout riêng cho request này (ms) */
  timeout?: number
  /** AbortSignal để cancel request */
  signal?: AbortSignal
  /** Có retry khi lỗi không? */
  retryable?: boolean
}

// ─── HTTP Request Options ────────────────────────────────────────
export interface HttpRequestOptions<TParams = unknown> extends AxiosRequestConfig {
  params?: TParams
  context?: RequestContext
}

// ─── Chuẩn hóa Error Shape ──────────────────────────────────────
export interface ApiErrorShape {
  message: string
  status?: number
  code?: string
  isNetworkError: boolean
  isTimeout: boolean
  isAuthError: boolean
  isRateLimited: boolean
  raw?: unknown
}

// ─── Paginated Response (chuẩn bị cho internal API) ─────────────
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  hasMore: boolean
}
