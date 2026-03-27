import axios from 'axios'
import type { ApiErrorShape } from './http-types'

/**
 * Chuẩn hóa mọi error từ Axios thành `ApiErrorShape`.
 * UI/hooks chỉ cần kiểm tra các flag boolean thay vì parse error thủ công.
 */
export function normalizeHttpError(error: unknown): ApiErrorShape {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status

    return {
      message: (error.response?.data as { message?: string })?.message || error.message || 'Request failed',
      status,
      code: error.code,
      isNetworkError: !error.response,
      isTimeout: error.code === 'ECONNABORTED',
      isAuthError: status === 401 || status === 403,
      isRateLimited: status === 429,
      raw: error,
    }
  }

  return {
    message: error instanceof Error ? error.message : 'Unknown error',
    isNetworkError: false,
    isTimeout: false,
    isAuthError: false,
    isRateLimited: false,
    raw: error,
  }
}

/**
 * Type guard: kiểm tra error có phải ApiErrorShape không.
 */
export function isApiError(error: unknown): error is ApiErrorShape {
  return typeof error === 'object' && error !== null && 'isNetworkError' in error && 'isTimeout' in error && 'isAuthError' in error
}
