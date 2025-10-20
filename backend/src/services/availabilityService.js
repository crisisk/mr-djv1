const { formatISO, parseISO } = (() => {
  const formatISO = (date) => date.toISOString().split('T')[0];

  const parseISO = (value) => {
    if (typeof value !== 'string') {
      return null;
    }

    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!isoMatch) {
      return null;
    }

    const parsed = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed;
  };

  return { formatISO, parseISO };
})();

class AvailabilityValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'AvailabilityValidationError';
    if (details) {
      this.details = details;
    }
  }
}

const BASE_TRAVEL_CONSTRAINTS = {
  baseLocation: 'Utrecht, NL',
  maxDistanceKm: 180,
  bufferHours: 2,
  weekendTravelPremium: true,
  unavailableRegions: ['Waddeneilanden'],
  notes: 'Evenementen verder dan 120km vereisen mogelijk een hotelovernachting.',
};

const SHARED_BLACKOUT_DATES = [
  { date: '2025-01-01', reason: 'Nieuwjaarsdag' },
  { date: '2025-04-20', reason: 'Paasweekend familie-evenement' },
  { date: '2025-05-27', reason: 'Team trainingsdag' },
];

const LOCATION_PROFILES = {
  amsterdam: {
    blackoutDates: [
      { date: '2025-04-26', reason: 'Koningsnacht residencies' },
      { date: '2025-04-27', reason: 'Koningsdag optredens' },
    ],
    bookedSlots: [
      {
        date: '2025-03-08',
        startTime: '18:00',
        endTime: '23:30',
        eventType: 'Bruiloft',
        venue: 'De Duif',
        status: 'confirmed',
        travel: {
          distanceKm: 9,
          estimatedTravelMinutes: 30,
          surcharge: false,
        },
      },
      {
        date: '2025-03-21',
        startTime: '19:00',
        endTime: '00:00',
        eventType: 'Bedrijfsfeest',
        venue: 'A\'DAM Toren',
        status: 'confirmed',
        travel: {
          distanceKm: 7,
          estimatedTravelMinutes: 28,
          surcharge: false,
        },
      },
      {
        date: '2025-04-12',
        startTime: '17:30',
        endTime: '23:00',
        eventType: 'Jubileum',
        venue: 'Hotel Okura',
        status: 'pending',
        travel: {
          distanceKm: 8,
          estimatedTravelMinutes: 26,
          surcharge: false,
        },
      },
    ],
    travelOverrides: {
      maxDistanceKm: 160,
      extraBufferHours: 1,
      trafficAdvisory: 'Verhoogde drukte op de A10 in weekendavonden.',
    },
  },
  rotterdam: {
    blackoutDates: [
      { date: '2025-03-01', reason: 'Intern festival' },
      { date: '2025-05-05', reason: 'Bevrijdingsdag optreden' },
    ],
    bookedSlots: [
      {
        date: '2025-02-28',
        startTime: '18:30',
        endTime: '23:30',
        eventType: 'Bruiloft',
        venue: 'Onderzeebootloods',
        status: 'confirmed',
        travel: {
          distanceKm: 63,
          estimatedTravelMinutes: 55,
          surcharge: false,
        },
      },
      {
        date: '2025-03-29',
        startTime: '20:00',
        endTime: '01:00',
        eventType: 'Clubnacht',
        venue: 'Toffler',
        status: 'confirmed',
        travel: {
          distanceKm: 66,
          estimatedTravelMinutes: 58,
          surcharge: true,
        },
      },
    ],
    travelOverrides: {
      maxDistanceKm: 190,
      notes: 'Rotterdamse havengebieden vereisen extra logistieke planning.',
    },
  },
  utrecht: {
    blackoutDates: [
      { date: '2025-02-14', reason: 'Valentijnsreservering' },
    ],
    bookedSlots: [
      {
        date: '2025-02-22',
        startTime: '17:00',
        endTime: '23:00',
        eventType: 'Bruiloft',
        venue: 'Kasteel De Haar',
        status: 'confirmed',
        travel: {
          distanceKm: 24,
          estimatedTravelMinutes: 32,
          surcharge: false,
        },
      },
      {
        date: '2025-03-15',
        startTime: '19:30',
        endTime: '00:30',
        eventType: 'Gala',
        venue: 'TivoliVredenburg',
        status: 'pending',
        travel: {
          distanceKm: 2,
          estimatedTravelMinutes: 10,
          surcharge: false,
        },
      },
    ],
    travelOverrides: {
      bufferHours: 1,
      notes: 'Binnen Utrecht geldt een extra opbouwbuffer voor historische locaties.',
    },
  },
  default: {
    blackoutDates: [
      { date: '2025-02-01', reason: 'Ingepland onderhoud' },
    ],
    bookedSlots: [
      {
        date: '2025-03-01',
        startTime: '18:00',
        endTime: '23:00',
        eventType: 'Bruiloft',
        venue: 'Landgoed Westerliefde',
        status: 'confirmed',
        travel: {
          distanceKm: 40,
          estimatedTravelMinutes: 45,
          surcharge: false,
        },
      },
    ],
    travelOverrides: {
      notes: 'Neem contact op voor locaties buiten de Randstad.',
    },
  },
};

const clampRange = (start, end) => {
  const MAX_RANGE_DAYS = 120;
  const msPerDay = 24 * 60 * 60 * 1000;
  const difference = Math.floor((end.getTime() - start.getTime()) / msPerDay);
  if (difference > MAX_RANGE_DAYS) {
    return {
      start,
      end: new Date(start.getTime() + MAX_RANGE_DAYS * msPerDay),
    };
  }

  return { start, end };
};

const isWithinRange = (dateString, start, end) => {
  const parsed = parseISO(dateString);
  if (!parsed) {
    return false;
  }

  return parsed >= start && parsed <= end;
};

const mergeTravelConstraints = (overrides = {}) => {
  return {
    ...BASE_TRAVEL_CONSTRAINTS,
    ...overrides,
  };
};

const normaliseLocation = (location) => {
  if (!location) {
    return 'default';
  }

  return String(location).trim().toLowerCase();
};

const serializeDate = (date) => formatISO(date);

function getAvailability({ startDate, endDate, location }) {
  const parsedStart = parseISO(startDate);
  const parsedEnd = parseISO(endDate);

  if (!parsedStart || !parsedEnd) {
    throw new AvailabilityValidationError('startDate en endDate moeten geldige ISO-datums zijn (YYYY-MM-DD).');
  }

  if (parsedStart > parsedEnd) {
    throw new AvailabilityValidationError('startDate moet eerder zijn dan endDate.');
  }

  const { start: clampedStart, end: clampedEnd } = clampRange(parsedStart, parsedEnd);

  const profileKey = normaliseLocation(location);
  const profile = LOCATION_PROFILES[profileKey] || LOCATION_PROFILES.default;

  const blackoutDates = [
    ...SHARED_BLACKOUT_DATES,
    ...LOCATION_PROFILES.default.blackoutDates,
    ...(profile.blackoutDates || []),
  ];

  const blackoutSet = new Map();
  for (const blackout of blackoutDates) {
    if (isWithinRange(blackout.date, clampedStart, clampedEnd)) {
      blackoutSet.set(blackout.date, blackout);
    }
  }

  const bookedSlots = [
    ...(LOCATION_PROFILES.default.bookedSlots || []),
    ...(profile.bookedSlots || []),
  ].filter((slot) => isWithinRange(slot.date, clampedStart, clampedEnd));

  const unavailableDateKeys = new Set([
    ...Array.from(blackoutSet.keys()),
    ...bookedSlots.map((slot) => slot.date),
  ]);

  return {
    range: {
      start: serializeDate(clampedStart),
      end: serializeDate(clampedEnd),
    },
    timezone: 'Europe/Amsterdam',
    location: profileKey,
    requestedLocation: location ?? null,
    bookedSlots,
    blackoutDates: Array.from(blackoutSet.values()),
    travelConstraints: mergeTravelConstraints(profile.travelOverrides),
    unavailableDates: Array.from(unavailableDateKeys.values()),
    metadata: {
      generatedAt: new Date().toISOString(),
      datasetVersion: 'v1-static-profile',
    },
  };
}

module.exports = {
  getAvailability,
  AvailabilityValidationError,
};
