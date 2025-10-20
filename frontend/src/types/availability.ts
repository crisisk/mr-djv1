export interface AvailabilityTravelDetails {
  distanceKm: number
  estimatedTravelMinutes: number
  surcharge: boolean
}

export type AvailabilitySlotStatus = 'confirmed' | 'pending'

export interface AvailabilitySlot {
  date: string
  startTime: string
  endTime: string
  eventType: string
  venue?: string
  status: AvailabilitySlotStatus
  travel: AvailabilityTravelDetails
}

export interface AvailabilityBlackoutDate {
  date: string
  reason: string
}

export interface TravelConstraints {
  baseLocation: string
  maxDistanceKm: number
  bufferHours: number
  weekendTravelPremium: boolean
  unavailableRegions?: string[]
  notes?: string
  extraBufferHours?: number | null
  trafficAdvisory?: string
}

export interface AvailabilityResponse {
  range: {
    start: string
    end: string
  }
  timezone: string
  location: string
  requestedLocation: string | null
  bookedSlots: AvailabilitySlot[]
  blackoutDates: AvailabilityBlackoutDate[]
  travelConstraints: TravelConstraints
  unavailableDates: string[]
  metadata: {
    generatedAt: string
    datasetVersion?: string
  }
}
