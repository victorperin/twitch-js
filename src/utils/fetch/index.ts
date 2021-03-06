import fetch, { RequestInit, RequestInfo } from 'node-fetch'
import FormData from 'form-data'
import { stringify, IStringifyOptions } from 'qs'

import parser from './parser'

type SearchOptions = {
  /** Any query parameters you want to add to your request. */
  search?: { [key: string]: any }
}

export type FetchOptions = RequestInit & SearchOptions

/**
 * Fetches URL
 */
const fetchUtil = async <T = any>(
  url: RequestInfo,
  options: FetchOptions = {},
  qsOptions?: IStringifyOptions,
) => {
  const isBodyJson =
    options.body &&
    !(options.body instanceof FormData) &&
    typeof options.body === 'object'

  const body = isBodyJson ? JSON.stringify(options.body) : options.body

  const headers = isBodyJson
    ? { ...options.headers, 'Content-Type': 'application/json' }
    : options.headers

  const search =
    typeof options.search === 'object'
      ? `?${stringify(options.search, qsOptions)}`
      : ''

  const fetchOptions = body
    ? {
        ...options,
        method: options.method || 'get',
        headers,
        body,
      }
    : {
        ...options,
        method: options.method || 'get',
        headers,
      }

  const response = await fetch(`${url}${search}`, fetchOptions)

  return parser<T>(response)
}

export default fetchUtil
