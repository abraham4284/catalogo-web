import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { getCatalogApiUrl } from '@/config/env'

let catalogHttp: AxiosInstance | undefined

export function getCatalogHttp(): AxiosInstance {
  catalogHttp ??= axios.create({
    baseURL: getCatalogApiUrl(),
    timeout: 15_000,
    withCredentials: false,
    headers: { Accept: 'application/json' },
  })

  return catalogHttp
}
