import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { DayPicker, type Matcher } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { apiFetch } from '../../lib/apiClient'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  availabilityFailed,
  availabilityReceived,
  availabilityRequested,
  resetSelection,
  setSelectedDate,
  setSelectedLocation,
  setValidationError,
} from '../../store/bookingSlice'
import type { AvailabilityResponse } from '../../types/availability'
import './Step1Availability.css'

const LOCATION_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'amsterdam', label: 'Amsterdam & Randstad' },
  { value: 'rotterdam', label: 'Rotterdam & Zuid-Holland' },
  { value: 'utrecht', label: 'Utrecht & Midden-Nederland' },
  { value: 'default', label: 'Andere locatie (op aanvraag)' },
]

const toISODate = (date: Date): string => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseISODate = (value: string | null | undefined): Date | null => {
  if (!value) return null
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const [_, year, month, day] = match
  const parsed = new Date(Number(year), Number(month) - 1, Number(day))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1)
const endOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0)
const addMonths = (date: Date, months: number): Date => new Date(date.getFullYear(), date.getMonth() + months, 1)

const availabilityStatusText: Record<string, string> = {
  idle: 'Selecteer een locatie om beschikbaarheid op te halen.',
  loading: 'Beschikbaarheid wordt geladen…',
  succeeded: 'Beschikbaarheidsgegevens bijgewerkt.',
  failed: 'Beschikbaarheid kon niet worden opgehaald.',
}

const Step1Availability = () => {
  const dispatch = useAppDispatch()
  const { availability, selectedDate, selectedLocation, validationError } = useAppSelector((state) => state.booking)
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))

  useEffect(() => {
    const rangeStart = startOfMonth(currentMonth)
    const rangeEnd = endOfMonth(addMonths(currentMonth, 1))
    const controller = new AbortController()

    const fetchAvailability = async () => {
      dispatch(availabilityRequested())

      const params = new URLSearchParams({
        startDate: toISODate(rangeStart),
        endDate: toISODate(rangeEnd),
      })

      if (selectedLocation && selectedLocation !== 'default') {
        params.set('location', selectedLocation)
      }

      try {
        const response = await apiFetch<AvailabilityResponse>(`/availability?${params.toString()}`, {
          signal: controller.signal,
        })
        dispatch(availabilityReceived(response))
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }

        const message = error instanceof Error ? error.message : 'Onbekende fout'
        dispatch(availabilityFailed(message))
      }
    }

    fetchAvailability()

    return () => controller.abort()
  }, [dispatch, currentMonth, selectedLocation])

  useEffect(() => {
    if (!availability.data || !selectedDate) {
      return
    }

    if (availability.data.unavailableDates.includes(selectedDate)) {
      const blackoutReason = availability.data.blackoutDates.find((entry) => entry.date === selectedDate)?.reason
      const slot = availability.data.bookedSlots.find((entry) => entry.date === selectedDate)
      const reason =
        blackoutReason ?? (slot ? `Deze datum is al geboekt voor een ${slot.eventType.toLowerCase()}.` : undefined)

      if (reason) {
        dispatch(setValidationError(reason))
        dispatch(setSelectedDate(null))
      }
    }
  }, [availability.data, selectedDate, dispatch])

  const unavailableDates = useMemo(() => new Set(availability.data?.unavailableDates ?? []), [availability.data])

  const disabledDays = useMemo(() => {
    if (!availability.data) return []

    const matchers: Matcher[] = []
    const rangeStart = parseISODate(availability.data.range.start)
    const rangeEnd = parseISODate(availability.data.range.end)

    if (rangeStart) {
      matchers.push({ before: rangeStart })
    }

    if (rangeEnd) {
      matchers.push({ after: rangeEnd })
    }

    for (const iso of availability.data.unavailableDates) {
      const parsed = parseISODate(iso)
      if (parsed) {
        matchers.push(parsed)
      }
    }

    return matchers
  }, [availability.data])

  const modifiers = useMemo(() => {
    if (!availability.data) {
      return {}
    }

    return {
      booked: availability.data.bookedSlots
        .map((slot) => parseISODate(slot.date))
        .filter((date): date is Date => Boolean(date)),
      blackout: availability.data.blackoutDates
        .map((entry) => parseISODate(entry.date))
        .filter((date): date is Date => Boolean(date)),
    }
  }, [availability.data])

  const selectedDateObj = parseISODate(selectedDate)

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) {
      dispatch(setSelectedDate(null))
      return
    }

    const iso = toISODate(date)
    if (unavailableDates.has(iso)) {
      const blackoutReason = availability.data?.blackoutDates.find((entry) => entry.date === iso)?.reason
      const slot = availability.data?.bookedSlots.find((entry) => entry.date === iso)
      const reason =
        blackoutReason ?? (slot ? `Deze datum is al geboekt voor een ${slot.eventType.toLowerCase()}.` : undefined)

      dispatch(setValidationError(reason ?? 'Deze datum is niet beschikbaar.'))
      dispatch(setSelectedDate(null))
      return
    }

    dispatch(setSelectedDate(iso))
    dispatch(setValidationError(null))
  }

  const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedLocation(event.target.value))
    dispatch(resetSelection())
  }

  const blackoutSummary = availability.data?.blackoutDates ?? []
  const bookedSummary = availability.data?.bookedSlots ?? []
  const travelConstraints = availability.data?.travelConstraints

  return (
    <section className="booking-step" aria-labelledby="booking-step1-title">
      <header className="booking-step__header">
        <h2 id="booking-step1-title" className="booking-step__title">
          Stap 1 · Controleer onze beschikbaarheid
        </h2>
        <p className="booking-step__subtitle">
          Kies je voorkeurslocatie en datum. We markeren bestaande boekingen, reistijd beperkingen en dagen waarop we niet
          beschikbaar zijn, zodat je meteen weet waar je aan toe bent.
        </p>
      </header>

      <div className="booking-step__content">
        <div className="booking-step__calendar">
          <div className="booking-step__location">
            <label htmlFor="booking-location">Voorkeurslocatie</label>
            <select id="booking-location" value={selectedLocation} onChange={handleLocationChange}>
              {LOCATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <p
            className={`booking-step__status${
              availability.status === 'loading'
                ? ' booking-step__status--loading'
                : availability.status === 'failed'
                  ? ' booking-step__status--error'
                  : ''
            }`}
          >
            {availabilityStatusText[availability.status]}
          </p>

          <DayPicker
            mode="single"
            month={currentMonth}
            onMonthChange={(nextMonth) => setCurrentMonth(startOfMonth(nextMonth))}
            selected={selectedDateObj ?? undefined}
            onSelect={handleDaySelect}
            disabled={disabledDays}
            modifiers={modifiers}
            modifiersClassNames={{
              booked: 'rdp-day_booked',
              blackout: 'rdp-day_blackout',
            }}
            showOutsideDays
          />

          {selectedDateObj && (
            <p className="booking-step__selected-date">
              Geselecteerde datum: {selectedDateObj.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          )}

          {validationError && <p className="booking-step__validation">{validationError}</p>}

          {availability.status === 'failed' && availability.error && (
            <p className="booking-step__validation">{availability.error}</p>
          )}
        </div>

        <aside className="booking-step__aside">
          {travelConstraints && (
            <div className="booking-step__panel" aria-live="polite">
              <h3>Reisvoorwaarden</h3>
              <ul>
                <li>
                  <span>
                    Basislocatie: <strong>{travelConstraints.baseLocation}</strong>
                  </span>
                </li>
                <li>
                  <span>
                    Maximale reisafstand: <strong>{Math.round(travelConstraints.maxDistanceKm)} km</strong>
                  </span>
                </li>
                <li>
                  <span>
                    Opbouwbuffer: <strong>{travelConstraints.bufferHours} uur</strong>
                    {typeof travelConstraints.extraBufferHours === 'number' && travelConstraints.extraBufferHours > 0
                      ? ` (+${travelConstraints.extraBufferHours} uur voor deze regio)`
                      : ''}
                  </span>
                </li>
                <li>
                  <span>
                    Weekendtoeslag actief: <strong>{travelConstraints.weekendTravelPremium ? 'Ja' : 'Nee'}</strong>
                  </span>
                </li>
                {travelConstraints.unavailableRegions?.length ? (
                  <li>
                    <span>Niet beschikbaar in: {travelConstraints.unavailableRegions.join(', ')}</span>
                  </li>
                ) : null}
                {travelConstraints.trafficAdvisory ? (
                  <li>
                    <span>{travelConstraints.trafficAdvisory}</span>
                  </li>
                ) : null}
                {travelConstraints.notes ? (
                  <li>
                    <span>{travelConstraints.notes}</span>
                  </li>
                ) : null}
              </ul>
            </div>
          )}

          <div className="booking-step__panel">
            <h3>Niet-beschikbare data</h3>
            {blackoutSummary.length === 0 ? (
              <p>Geen blokkades gevonden in deze periode.</p>
            ) : (
              <ul>
                {blackoutSummary.map((entry) => {
                  const date = parseISODate(entry.date)
                  return (
                    <li key={entry.date}>
                      <strong>{date?.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', weekday: 'short' })}</strong>
                      <span>{entry.reason}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="booking-step__panel">
            <h3>Geboekte events in dit venster</h3>
            {bookedSummary.length === 0 ? (
              <p>Geen conflicten gevonden voor deze periode.</p>
            ) : (
              <ul>
                {bookedSummary.map((slot) => {
                  const date = parseISODate(slot.date)
                  return (
                    <li key={`${slot.date}-${slot.eventType}`}>
                      <strong>{slot.eventType}</strong>
                      <time dateTime={slot.date}>
                        {date?.toLocaleDateString('nl-NL', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'long',
                        })}{' '}
                        · {slot.startTime} - {slot.endTime}
                      </time>
                      <span>{slot.venue}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Step1Availability
