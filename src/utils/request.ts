import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.BHBLOG_API_BASEURL,
  timeout: 5 * 1000,
  withCredentials: true,
})

const request = {
  get: <D>(url: string, config?: AxiosRequestConfig) => {
    return instance.get(url, config) as Promise<Resp<D>>
  },
  post: <D>(url: string, config: AxiosRequestConfig) => {
    return instance.post(url, config.data, config) as Promise<Resp<D>>
  },
  put: <D>(url: string, config: AxiosRequestConfig) => {
    return instance.put(url, config.data, config) as Promise<Resp<D>>
  },
  patch: <D>(url: string, config?: AxiosRequestConfig) => {
    return instance.patch(url, config?.data, config) as Promise<Resp<D>>
  },
  delete: <D>(url: string, config?: AxiosRequestConfig) => {
    return instance.delete(url, config) as Promise<Resp<D>>
  },
  stream: <D>(method: string, url: string, config?: AxiosRequestConfig) => {
    return instance.request({
      method,
      headers: {
        Accept: 'text/event-stream',
      },
      url,
      ...config,
      responseType: 'stream',
      adapter: 'fetch',
      timeout: 0,
    }) as Promise<ReadableStream<D>>
  },
}

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // csrf token
    config.headers['X-CSRF-Token'] = '_'
    return config
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      return Promise.resolve(error.response.data)
    }
    else {
      return Promise.resolve({
        success: false,
        data: null,
        msg: useI18n().t('network-err'),
      })
    }
  },
)

export default request
