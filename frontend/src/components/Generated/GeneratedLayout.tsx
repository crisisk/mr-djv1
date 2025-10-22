"use client"

import { useEffect, useState, type PropsWithChildren } from 'react'
import { type ApiClientError, subscribeToApiErrors } from '../../lib/apiClient'
import './GeneratedLayout.css'

interface ToastMessage {
  id: number
  title: string
  description?: string
}

const TOAST_LIFETIME_MS = 6000

const toastListeners = new Set<(toasts: ToastMessage[]) => void>()
let unsubscribeFromErrors: (() => void) | null = null
let toasts: ToastMessage[] = []
const toastTimers = new Map<number, number>()
let toastCounter = 0

const getNextToastId = () => {
  toastCounter += 1
  return toastCounter
}

const notifyToastListeners = () => {
  const snapshot = [...toasts]
  toastListeners.forEach((listener) => listener(snapshot))
}

const truncate = (value: string, maxLength = 200) => {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1)}…`
}

const createToast = (error: ApiClientError): ToastMessage => {
  const title = error.status ? `Request failed (${error.status})` : 'Network error'

  let description: string | undefined
  if (typeof error.data === 'string' && error.data.trim()) {
    description = truncate(error.data.trim())
  } else if (error.data && typeof error.data === 'object') {
    try {
      description = truncate(JSON.stringify(error.data))
    } catch (serializationError) {
      console.warn('Unable to serialise API error payload', serializationError)
    }
  }

  if (!description) {
    description = truncate(error.message)
  }

  return {
    id: getNextToastId(),
    title,
    description,
  }
}

const removeToast = (id: number) => {
  const timer = toastTimers.get(id)
  if (typeof window !== 'undefined' && typeof timer === 'number') {
    window.clearTimeout(timer)
  }
  toastTimers.delete(id)
  toasts = toasts.filter((toast) => toast.id !== id)
  notifyToastListeners()
}

const scheduleToastRemoval = (id: number) => {
  if (typeof window === 'undefined') {
    return
  }

  const timer = window.setTimeout(() => {
    removeToast(id)
  }, TOAST_LIFETIME_MS)

  toastTimers.set(id, timer)
}

const ensureErrorSubscription = () => {
  if (unsubscribeFromErrors) {
    return
  }

  unsubscribeFromErrors = subscribeToApiErrors((error) => {
    const toast = createToast(error)
    toasts = [...toasts, toast]
    notifyToastListeners()
    scheduleToastRemoval(toast.id)
  })
}

const releaseErrorSubscription = () => {
  if (!unsubscribeFromErrors || toastListeners.size > 0) {
    return
  }

  unsubscribeFromErrors()
  unsubscribeFromErrors = null

  if (typeof window !== 'undefined') {
    toastTimers.forEach((timer) => window.clearTimeout(timer))
  }
  toastTimers.clear()
  toasts = []
}

const GeneratedLayout = ({ children }: PropsWithChildren) => {
  const [activeToasts, setActiveToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    ensureErrorSubscription()
    const listener = (messages: ToastMessage[]) => setActiveToasts(messages)
    toastListeners.add(listener)
    listener(toasts)

    return () => {
      toastListeners.delete(listener)
      setActiveToasts([])
      releaseErrorSubscription()
    }
  }, [])

  const handleDismiss = (id: number) => {
    removeToast(id)
  }

  return (
    <>
      {children}
      {activeToasts.length > 0 && (
        <div className="generated-toast-container" role="status" aria-live="assertive">
          {activeToasts.map((toast) => (
            <div key={toast.id} className="generated-toast">
              <div className="generated-toast__header">
                <span>{toast.title}</span>
                <button
                  type="button"
                  className="generated-toast__close"
                  aria-label="Dismiss notification"
                  onClick={() => handleDismiss(toast.id)}
                >
                  ×
                </button>
              </div>
              {toast.description ? (
                <p className="generated-toast__description">{toast.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default GeneratedLayout
