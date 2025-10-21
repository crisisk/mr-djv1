import { apiFetch } from '../lib/apiClient'

export type ContactRequest = {
  name: string
  email: string
  phone: string
  eventType: string
  eventDate?: string
  packageId?: string
  message?: string
  hCaptchaToken?: string
}

export type ContactResponse = {
  success: boolean
  message?: string
  contactId?: string
  status?: string
  persisted?: boolean
  eventType?: string | null
  eventDate?: string | null
  requestedPackage?: string | null
  submittedAt?: string
  processingStatus?: string
  partnerIncidents?: string[]
  rentGuySync?: Record<string, unknown>
  sevensaSync?: Record<string, unknown>
}

export async function submitContactLead(payload: ContactRequest): Promise<ContactResponse> {
  return apiFetch<ContactResponse>('/contact', {
    method: 'POST',
    body: payload,
  })
}
