import axios from 'axios'
import type { AxiosInstance } from 'axios'

// ─── Factory Options ─────────────────────────────────────────────
export interface CreateHttpClientOptions {
  baseURL: string
  timeout?: number
  defaultHeaders?: Record<string, string>
}

/**
 * Factory tạo Axios instance có config riêng biệt.
 * Mỗi external/internal service sẽ gọi hàm này để tạo instance riêng,
 * đảm bảo timeout, headers, baseURL không bị lẫn lộn giữa các service.
 */
export function createHttpClient(options: CreateHttpClientOptions): AxiosInstance {
  const instance = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? 10000,
    headers: {
      'Content-Type': 'application/json',
      ...options.defaultHeaders,
    },
  })

  // Request interceptor mặc định (có thể mở rộng thêm logging/metrics)
  instance.interceptors.request.use((config) => config)

  // Response interceptor mặc định
  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  )

  return instance
}
