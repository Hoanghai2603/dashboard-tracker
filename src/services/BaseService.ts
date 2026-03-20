import axios, { type AxiosRequestConfig } from 'axios'

export class BaseService {
  public async get(url: string, params?: any, config?: AxiosRequestConfig) {
    const response = await axios.get(url, { params, ...config })
    return response.data
  }

  public async post(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await axios.post(url, data, config)
    return response.data
  }

  public async put(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await axios.put(url, data, config)
    return response.data
  }

  public async delete(url: string, config?: AxiosRequestConfig) {
    const response = await axios.delete(url, config)
    return response.data
  }
}
