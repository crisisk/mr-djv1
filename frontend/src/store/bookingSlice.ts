import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AvailabilityResponse } from '../types/availability'

type AvailabilityStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface BookingState {
  selectedDate: string | null
  selectedLocation: string
  availability: {
    status: AvailabilityStatus
    data: AvailabilityResponse | null
    error: string | null
  }
  validationError: string | null
}

const initialState: BookingState = {
  selectedDate: null,
  selectedLocation: 'amsterdam',
  availability: {
    status: 'idle',
    data: null,
    error: null,
  },
  validationError: null,
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedLocation(state, action: PayloadAction<string>) {
      state.selectedLocation = action.payload
    },
    setSelectedDate(state, action: PayloadAction<string | null>) {
      state.selectedDate = action.payload
    },
    availabilityRequested(state) {
      state.availability.status = 'loading'
      state.availability.error = null
    },
    availabilityReceived(state, action: PayloadAction<AvailabilityResponse>) {
      state.availability.status = 'succeeded'
      state.availability.data = action.payload
      state.availability.error = null
    },
    availabilityFailed(state, action: PayloadAction<string>) {
      state.availability.status = 'failed'
      state.availability.error = action.payload
    },
    setValidationError(state, action: PayloadAction<string | null>) {
      state.validationError = action.payload
    },
    resetSelection(state) {
      state.selectedDate = null
      state.validationError = null
    },
  },
})

export const {
  setSelectedLocation,
  setSelectedDate,
  availabilityRequested,
  availabilityReceived,
  availabilityFailed,
  setValidationError,
  resetSelection,
} = bookingSlice.actions

export default bookingSlice.reducer
