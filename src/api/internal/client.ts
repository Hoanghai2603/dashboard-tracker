import { HttpClient, createHttpClient } from '../core'

/**
 * Internal API Client - dành cho backend của hệ thống.
 *
 * Hiện tại chưa có backend, nên client này được chuẩn bị sẵn
 * cho tương lai khi cần:
 * - User profile API
 * - Portfolio persistence
 * - Staking backend sync
 *
 * Khi có backend, chỉ cần:
 * 1. Thêm VITE_API_BASE_URL vào .env
 * 2. Gọi attachAuthInterceptor() ở đây
 */
const internalAxiosInstance = createHttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
})

export const internalClient = new HttpClient(internalAxiosInstance)
