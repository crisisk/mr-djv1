/* eslint-disable react-refresh/only-export-components -- Generated bundle exposes provider + hook together; tracked in DX-1472 for modularization */
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

type EventType = 'wedding' | 'corporate' | null

type EventTypeContextValue = {
  eventType: EventType
  setEventType: Dispatch<SetStateAction<EventType>>
}

const EventTypeContext = createContext<EventTypeContextValue | undefined>(undefined)

type EventTypeProviderProps = PropsWithChildren<{
  initialEventType?: EventType
}>

export function EventTypeProvider({ children, initialEventType = null }: EventTypeProviderProps) {
  const [eventType, setEventType] = useState<EventType>(initialEventType)

  const value = useMemo<EventTypeContextValue>(
    () => ({ eventType, setEventType }),
    [eventType]
  )

  return <EventTypeContext.Provider value={value}>{children}</EventTypeContext.Provider>
}

export function useEventType(): EventTypeContextValue {
  const context = useContext(EventTypeContext)
  if (!context) {
    throw new Error('useEventType must be used within an EventTypeProvider')
  }
  return context
}
