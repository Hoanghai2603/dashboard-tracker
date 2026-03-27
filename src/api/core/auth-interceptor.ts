import type { AxiosInstance } from 'axios'

/**
 * Token provider interface.
 * Implement interface này để cung cấp access token cho interceptor.
 */
export interface TokenProvider {
  getAccessToken: () => string | null
}

/**
 * Gắn auth interceptor vào Axios instance.
 * Chỉ gắn token cho request có `context.requiresAuth = true`.
 *
 * ⚠️ Hiện tại đây là "điểm cắm" (plugin point) cho tương lai.
 * Khi có backend auth, chỉ cần gọi hàm này với tokenProvider thật.
 *
 * @example
 * ```ts
 * attachAuthInterceptor(internalAxios, {
 *   getAccessToken: () => localStorage.getItem('accessToken'),
 * })
 * ```
 */
export function attachAuthInterceptor(
  instance: AxiosInstance,
  tokenProvider: TokenProvider,
) {
  instance.interceptors.request.use((config) => {
    const requiresAuth = (
      config as typeof config & { context?: { requiresAuth?: boolean } }
    ).context?.requiresAuth

    if (!requiresAuth) return config

    const token = tokenProvider.getAccessToken()
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })
}
