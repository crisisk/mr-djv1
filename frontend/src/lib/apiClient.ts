const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  /**
   * Override the base URL for relative requests. Defaults to `VITE_API_BASE_URL`.
   */
  baseUrl?: string
  /**
   * When `true` (default) the client will attempt to parse JSON responses.
   */
  parseJson?: boolean
  /**
   * Optional request body. Plain objects will automatically be JSON stringified.
   */
  body?: RequestInit['body'] | Record<string, unknown> | unknown
}

export interface ApiClientError extends Error {
  status?: number
  data?: unknown
  request: {
    url: string
    options: RequestInit
  }
  response?: Response
}

type ApiErrorListener = (error: ApiClientError) => void

const errorListeners = new Set<ApiErrorListener>()

export const subscribeToApiErrors = (listener: ApiErrorListener): (() => void) => {
  errorListeners.add(listener)
  return () => {
    errorListeners.delete(listener)
  }
}

const emitApiError = (error: ApiClientError) => {
  errorListeners.forEach((listener) => {
    try {
      listener(error)
    } catch (listenerError) {
      console.error('apiClient error listener failed', listenerError)
    }
  })
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') {
    return false
  }

  if (value instanceof FormData) return false
  if (value instanceof URLSearchParams) return false
  if (typeof Blob !== 'undefined' && value instanceof Blob) return false
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) return false
  if (typeof ReadableStream !== 'undefined' && value instanceof ReadableStream) return false
  if (ArrayBuffer.isView(value)) return false

  return true
}

const resolveUrl = (input: string | URL, explicitBaseUrl?: string): string => {
  if (input instanceof URL) {
    return input.toString()
  }

  if (/^https?:\/\//i.test(input)) {
    return input
  }

  const base = explicitBaseUrl ?? API_BASE_URL
  if (!base) {
    return input
  }

  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const trimmedPath = input.startsWith('/') ? input.slice(1) : input

  return `${trimmedBase}/${trimmedPath}`
}

const normaliseBody = (
  body: ApiClientOptions['body'],
  headers: Headers
): RequestInit['body'] => {
  if (body === undefined || body === null) {
    return undefined
  }

  if (typeof body === 'string') {
    return body
  }

  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return body
  }

  if (body instanceof FormData || body instanceof URLSearchParams) {
    return body
  }

  if (
    typeof ArrayBuffer !== 'undefined' &&
    (body instanceof ArrayBuffer || ArrayBuffer.isView(body as ArrayBufferView))
  ) {
    return body as RequestInit['body']
  }

  if (isPlainObject(body)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    return JSON.stringify(body)
  }

  return body as RequestInit['body']
}

const safeJsonParse = (value: string): unknown => {
  try {
    return JSON.parse(value)
  } catch (error) {
    console.warn('apiClient failed to parse JSON response', error)
    return undefined
  }
}

const createError = (
  message: string,
  response: Response | undefined,
  request: { url: string; options: RequestInit },
  data?: unknown
): ApiClientError => {
  const error: ApiClientError = Object.assign(new Error(message), {
    status: response?.status,
    data,
    request,
    response,
  })
  error.name = 'ApiClientError'

  return error
}

export async function apiFetch<T = unknown>(
  input: string | URL,
  options: ApiClientOptions = {}
): Promise<T> {
  const { parseJson = true, baseUrl, body, headers, ...rest } = options
  const resolvedUrl = resolveUrl(input, baseUrl)

  const headersInstance = new Headers(headers ?? {})
  if (parseJson && !headersInstance.has('Accept')) {
    headersInstance.set('Accept', 'application/json')
  }

  const normalisedBody = normaliseBody(body, headersInstance)

  const requestInit: RequestInit = {
    ...rest,
    headers: headersInstance,
    body: normalisedBody,
  }

  try {
    const response = await fetch(resolvedUrl, requestInit)

    if (!parseJson) {
      if (!response.ok) {
        const error = createError(
          `Request to ${resolvedUrl} failed with status ${response.status}`,
          response,
          { url: resolvedUrl, options: requestInit }
        )
        emitApiError(error)
        throw error
      }

      return response as unknown as T
    }

    const text = await response.text()
    const maybeJson = text ? safeJsonParse(text) : undefined

    if (!response.ok) {
      const error = createError(
        `Request to ${resolvedUrl} failed with status ${response.status}`,
        response,
        { url: resolvedUrl, options: requestInit },
        maybeJson ?? text
      )
      emitApiError(error)
      throw error
    }

    return (maybeJson ?? (text as unknown)) as T
  } catch (error) {
    if (error instanceof Error && 'request' in error) {
      throw error
    }

    const apiError = createError(
      error instanceof Error ? error.message : 'Network request failed',
      undefined,
      { url: resolvedUrl, options: requestInit }
    )
    emitApiError(apiError)
    throw apiError
  }
}

export const apiClient = {
  get<T = unknown>(path: string | URL, options?: Omit<ApiClientOptions, 'method' | 'body'>) {
    return apiFetch<T>(path, { ...options, method: 'GET' })
  },
  post<T = unknown>(
    path: string | URL,
    body?: ApiClientOptions['body'],
    options?: Omit<ApiClientOptions, 'method' | 'body'>
  ) {
    return apiFetch<T>(path, { ...options, method: 'POST', body })
  },
  put<T = unknown>(
    path: string | URL,
    body?: ApiClientOptions['body'],
    options?: Omit<ApiClientOptions, 'method' | 'body'>
  ) {
    return apiFetch<T>(path, { ...options, method: 'PUT', body })
  },
  patch<T = unknown>(
    path: string | URL,
    body?: ApiClientOptions['body'],
    options?: Omit<ApiClientOptions, 'method' | 'body'>
  ) {
    return apiFetch<T>(path, { ...options, method: 'PATCH', body })
  },
  delete<T = unknown>(
    path: string | URL,
    options?: Omit<ApiClientOptions, 'method' | 'body'>
  ) {
    return apiFetch<T>(path, { ...options, method: 'DELETE' })
  },
}
