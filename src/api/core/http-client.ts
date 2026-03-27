import type { AxiosInstance } from 'axios'
import { normalizeHttpError } from './http-errors'
import type { HttpRequestOptions } from './http-types'

/**
 * HttpClient bọc AxiosInstance, tự động normalize error.
 * Mọi service (internal/external) đều dùng class này để gọi API.
 *
 * @example
 * ```ts
 * const client = new HttpClient(myAxiosInstance)
 * const data = await client.get<UserProfile>('/users/me')
 * ```
 */
export class HttpClient {
  constructor(private readonly instance: AxiosInstance) {}

  async get<TResponse, TParams = unknown>(url: string, options?: HttpRequestOptions<TParams>): Promise<TResponse> {
    try {
      const response = await this.instance.get<TResponse>(url, options)
      return response.data
    } catch (error) {
      throw normalizeHttpError(error)
    }
  }

  async post<TResponse, TBody = unknown>(url: string, body?: TBody, options?: HttpRequestOptions): Promise<TResponse> {
    try {
      const response = await this.instance.post<TResponse>(url, body, options)
      return response.data
    } catch (error) {
      throw normalizeHttpError(error)
    }
  }

  async put<TResponse, TBody = unknown>(url: string, body?: TBody, options?: HttpRequestOptions): Promise<TResponse> {
    try {
      const response = await this.instance.put<TResponse>(url, body, options)
      return response.data
    } catch (error) {
      throw normalizeHttpError(error)
    }
  }

  async patch<TResponse, TBody = unknown>(url: string, body?: TBody, options?: HttpRequestOptions): Promise<TResponse> {
    try {
      const response = await this.instance.patch<TResponse>(url, body, options)
      return response.data
    } catch (error) {
      throw normalizeHttpError(error)
    }
  }

  async delete<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse> {
    try {
      const response = await this.instance.delete<TResponse>(url, options)
      return response.data
    } catch (error) {
      throw normalizeHttpError(error)
    }
  }
}
