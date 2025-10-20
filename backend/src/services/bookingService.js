const { randomUUID } = require('crypto');
const db = require('../lib/db');
const config = require('../config');
const rentGuyService = require('./rentGuyService');
const mailService = require('./mailService');
const packageService = require('./packageService');
const personalizationService = require('./personalizationService');

const inMemoryBookings = new Map();

const DEFAULT_SUPPORT_PHONE = process.env.SUPPORT_PHONE || '085 303 0780';

const dutchDateFormatter = new Intl.DateTimeFormat('nl-NL', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const dutchDateShortFormatter = new Intl.DateTimeFormat('nl-NL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const dutchDateTimeFormatter = new Intl.DateTimeFormat('nl-NL', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

const euroFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR'
});

const NEXT_STEPS = [
  'Onze producer belt binnen 24 uur voor de laatste details en muziekvoorkeuren.',
  'We reserveren crew, apparatuur en back-up direct na jullie telefonische bevestiging.',
  'Je ontvangt een draaiboek en Spotify-playlist op maat binnen 48 uur.'
];

const INFO_LIST = [
  'Vrijblijvend annuleren kan binnen 48 uur na deze bevestiging.',
  'Aanpassingen aan pakket of locatie? Reageer eenvoudig op deze mail.',
  '100% dansgarantie: bij calamiteiten staat ons backup-team stand-by.'
];

function escapeHtml(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildListHtml(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function extractNameParts(name) {
  if (!name || typeof name !== 'string') {
    return { firstName: null, lastName: null };
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return { firstName: null, lastName: null };
  }

  const [firstName, ...rest] = parts;
  return {
    firstName,
    lastName: rest.length ? rest.join(' ') : null
  };
}

function formatEventDate(value) {
  if (!value) {
    return {
      iso: null,
      human: 'Datum in overleg',
      short: null
    };
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      iso: null,
      human: 'Datum in overleg',
      short: null
    };
  }

  return {
    iso: date.toISOString(),
    human: dutchDateFormatter.format(date),
    short: dutchDateShortFormatter.format(date)
  };
}

function formatSubmittedAt(value) {
  const date = value instanceof Date ? value : new Date(value);
  const valid = !Number.isNaN(date.getTime());
  const safeDate = valid ? date : new Date();

  return {
    iso: safeDate.toISOString(),
    human: dutchDateTimeFormatter.format(safeDate)
  };
}

function buildPhoneLink(phone) {
  if (!phone) {
    return '';
  }

  const normalized = String(phone).replace(/[^0-9+]/g, '');
  if (!normalized) {
    return '';
  }

  return normalized.startsWith('+') ? `tel:${normalized}` : `tel:${normalized}`;
}

async function resolvePackageDetails(packageId) {
  if (!packageId) {
    return null;
  }

  try {
    const { packages } = await packageService.getPackages({ forceRefresh: false });
    if (Array.isArray(packages)) {
      return packages.find((pkg) => pkg.id === packageId) || null;
    }
  } catch (error) {
    console.error('[bookingService] Failed to resolve package details:', error.message);
  }

  return null;
}

function buildPackageSummary(details, fallbackId) {
  if (details) {
    const name = escapeHtml(details.name || '');
    const priceLabel = Number.isFinite(details.price)
      ? ` • ${escapeHtml(euroFormatter.format(details.price))}`
      : '';
    const durationLabel = details.duration ? ` (${escapeHtml(details.duration)})` : '';
    return `${name}${durationLabel}${priceLabel}`;
  }

  if (fallbackId) {
    return `Pakket ${escapeHtml(fallbackId)}`;
  }

  return 'Op maat samen te stellen';
}

function buildMessageHtml(message) {
  if (!message || !String(message).trim()) {
    return '<em>Geen aanvullende wensen gedeeld.</em>';
  }

  return escapeHtml(message).replace(/\r?\n/g, '<br />');
}

function buildMessagePlain(message) {
  if (!message || !String(message).trim()) {
    return 'Geen aanvullende wensen gedeeld.';
  }

  return String(message).trim();
}

function buildPreviewText({ eventTypeLabel, eventDateHuman }) {
  const label = typeof eventTypeLabel === 'string' ? eventTypeLabel : '';
  const normalizedLabel = label ? label.toLowerCase() : '';

  if (normalizedLabel && eventDateHuman && eventDateHuman !== 'Datum in overleg') {
    return `We plannen jullie ${normalizedLabel} op ${eventDateHuman}.`;
  }

  if (normalizedLabel) {
    return `We bevestigen jullie ${normalizedLabel} en nemen snel contact op.`;
  }

  return 'Jullie boeking is ontvangen – we nemen binnen 24 uur contact op.';
}

function buildIntroParagraph({ eventTypeLabel, firstName }) {
  const label = typeof eventTypeLabel === 'string' ? eventTypeLabel.toLowerCase() : null;
  const base = label
    ? `Wat leuk dat jullie Mister DJ kiezen voor jullie ${label}`
    : 'Wat gaaf dat jullie Mister DJ kiezen voor jullie event';

  const greeting = firstName ? `${firstName},` : '';
  const sentence = `${base}! We zetten ons team alvast klaar en zorgen dat alles perfect aansluit op jullie wensen.`;
  return greeting ? `${sentence}` : sentence;
}

async function buildPersonalizationSummary(tokens, payload) {
  const context =
    (payload && typeof payload.personalization === 'object' && payload.personalization) ||
    (payload && typeof payload.personalizationContext === 'object' && payload.personalizationContext) ||
    null;

  const summary = {
    variantId: null,
    matchType: 'default',
    keywords: [],
    city: null
  };

  if (!context) {
    tokens.personalizationSummary =
      escapeHtml(
        'Zodra we jullie intake hebben gehad koppelen we de juiste crew en playlist aan jullie event.'
      );
    tokens.personalizationMatchType = summary.matchType ? escapeHtml(summary.matchType) : '';
    tokens.personalizationVariant = null;
    tokens.personalizationKeywords = '';
    tokens.personalizationCity = null;
    return summary;
  }

  try {
    const { variant, meta } = await personalizationService.getVariantForRequest(context);
    summary.variantId = meta?.variantId || variant?.id || null;
    summary.matchType = meta?.matchType || 'default';
    summary.keywords = Array.isArray(meta?.matchedKeywords) ? meta.matchedKeywords : [];
    summary.city = meta?.city || null;

    const keywordLabel = summary.keywords.length ? `Zoektermen: ${summary.keywords.join(', ')}` : null;
    const cityLabel = summary.city ? `Regio focus: ${summary.city}` : null;
    const variantLabel = summary.variantId ? `Variant: ${summary.variantId}` : null;
    const matchLabel = summary.matchType ? `Matchtype: ${summary.matchType}` : null;

    tokens.personalizationMatchType = summary.matchType ? escapeHtml(summary.matchType) : '';
    tokens.personalizationVariant = summary.variantId ? escapeHtml(summary.variantId) : null;
    tokens.personalizationKeywords = summary.keywords.length
      ? escapeHtml(summary.keywords.join(', '))
      : '';
    tokens.personalizationCity = summary.city ? escapeHtml(summary.city) : null;
    tokens.personalizationSummary = [variantLabel, matchLabel, cityLabel, keywordLabel]
      .filter(Boolean)
      .map(escapeHtml)
      .join(' • ') ||
      escapeHtml('We combineren jullie voorkeuren met onze bewezen eventformules voor maximale impact.');
  } catch (error) {
    console.error('[bookingService] Failed to derive personalization tokens:', error.message);
    tokens.personalizationSummary =
      escapeHtml('Personalisatiegegevens konden niet geladen worden. We stemmen telefonisch de details af.');
    tokens.personalizationMatchType = summary.matchType ? escapeHtml(summary.matchType) : '';
    tokens.personalizationVariant = null;
    tokens.personalizationKeywords = '';
    tokens.personalizationCity = null;
  }

  return summary;
}

async function buildBookingEmailContext(payload, record) {
  const packageDetails = await resolvePackageDetails(record.packageId);
  const { firstName, lastName } = extractNameParts(record.name || payload.name);
  const eventDate = formatEventDate(record.eventDate || payload.eventDate);
  const submittedAt = formatSubmittedAt(record.createdAt);
  const packageSummary = buildPackageSummary(packageDetails, record.packageId || payload.packageId);
  const packagePrice = Number.isFinite(packageDetails?.price) ? packageDetails.price : null;
  const eventTypeRaw = record.eventType || payload.eventType;
  const eventTypeLabel = eventTypeRaw ? String(eventTypeRaw) : 'Event in overleg';

  const sanitizedFirstName = firstName ? escapeHtml(firstName) : 'DJ liefhebbers';
  const sanitizedLastName = lastName ? escapeHtml(lastName) : '';
  const sanitizedFullName = record.name
    ? escapeHtml(record.name)
    : payload.name
    ? escapeHtml(payload.name)
    : sanitizedFirstName;

  const eventDateFriendly = eventDate.human ? escapeHtml(eventDate.human) : 'Datum in overleg';
  const eventDateShort = eventDate.short ? escapeHtml(eventDate.short) : '';
  const packageName = packageDetails?.name ? escapeHtml(packageDetails.name) : '';
  const packageDuration = packageDetails?.duration ? escapeHtml(packageDetails.duration) : '';
  const packagePriceFormatted = packagePrice ? escapeHtml(euroFormatter.format(packagePrice)) : '';
  const contactEmail = record.email ? escapeHtml(record.email) : '';
  const contactPhone = record.phone ? escapeHtml(String(record.phone)) : '';
  const contactPhoneLink = escapeHtml(buildPhoneLink(record.phone));
  const bookingReference = escapeHtml(String(record.id));
  const bookingStatusLabel = record.status ? escapeHtml(record.status) : 'In behandeling';
  const messageHtml = buildMessageHtml(record.message || payload.message);
  const messagePlain = buildMessagePlain(record.message || payload.message);
  const submittedAtFriendly = escapeHtml(submittedAt.human);
  const replyToCandidate = config.mail?.replyTo || config.mail?.from || record.email || contactEmail || 'info@misterdj.nl';
  const replyToAddress = escapeHtml(replyToCandidate);
  const supportPhone = escapeHtml(process.env.SUPPORT_PHONE || DEFAULT_SUPPORT_PHONE);
  const ctaUrl = escapeHtml(payload.ctaUrl || `https://misterdj.nl/booking/${record.id}`);
  const previewTextRaw = buildPreviewText({
    eventTypeLabel,
    eventDateHuman: eventDate.human
  });
  const introParagraphRaw = buildIntroParagraph({
    eventTypeLabel,
    firstName
  });
  const emailSubjectRaw = eventDate.short
    ? `Boeking bevestigd: ${eventTypeLabel} op ${eventDate.short}`
    : `Bedankt voor jullie boeking bij Mister DJ`;
  const packageIdValue = record.packageId || payload.packageId || '';
  const packageId = packageIdValue ? escapeHtml(String(packageIdValue)) : '';

  const tokens = {
    customerFirstName: sanitizedFirstName,
    customerFullName: sanitizedFullName,
    customerLastName: sanitizedLastName,
    eventTypeLabel: escapeHtml(eventTypeLabel),
    eventDateFriendly,
    eventDateIso: eventDate.iso || '',
    eventDateShort,
    packageSummary,
    packageId,
    packageName,
    packageDuration,
    packagePrice,
    packagePriceFormatted,
    contactEmail,
    contactPhone,
    contactPhoneLink,
    bookingReference,
    bookingStatusLabel,
    messageHtml,
    messagePlain,
    submittedAtFriendly,
    submittedAtIso: submittedAt.iso,
    replyToAddress,
    supportPhone,
    currentYear: new Date().getFullYear(),
    nextStepsHtml: buildListHtml(NEXT_STEPS),
    infoListHtml: buildListHtml(INFO_LIST),
    ctaUrl,
    emailSubjectText: emailSubjectRaw
  };

  tokens.previewText = escapeHtml(previewTextRaw);
  tokens.headerSummary = tokens.previewText;
  tokens.introParagraph = escapeHtml(introParagraphRaw);
  tokens.emailSubject = escapeHtml(emailSubjectRaw);

  const personalization = await buildPersonalizationSummary(tokens, payload);

  return { tokens, personalization };
}

async function createBooking(payload) {
  const timestamp = new Date();
  let result;

  if (db.isConfigured()) {
    try {
      const queryResult = await db.runQuery(
        `INSERT INTO bookings (name, email, phone, event_type, event_date, message, package_id, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, $8)
         RETURNING id, status, created_at`,
        [
          payload.name,
          payload.email,
          payload.phone,
          payload.eventType,
          payload.eventDate ? new Date(payload.eventDate) : null,
          payload.message,
          payload.packageId || null,
          timestamp
        ]
      );

      const row = queryResult.rows[0];
      result = {
        id: row.id,
        status: row.status,
        createdAt: row.created_at,
        persisted: true,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        eventType: payload.eventType,
        eventDate: payload.eventDate ? new Date(payload.eventDate) : null,
        packageId: payload.packageId || null,
        message: payload.message || null
      };
    } catch (error) {
      console.error('[bookingService] Database insert failed:', error.message);
    }
  }

  if (!result) {
    const id = randomUUID();
    const record = {
      id,
      status: 'pending',
      createdAt: timestamp,
      persisted: false,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      eventType: payload.eventType,
      eventDate: payload.eventDate ? new Date(payload.eventDate) : null,
      packageId: payload.packageId || null,
      message: payload.message || null
    };

    inMemoryBookings.set(id, record);
    result = record;
  }

  const rentGuySync = await rentGuyService.syncBooking(
    {
      id: result.id,
      status: result.status,
      createdAt: result.createdAt,
      persisted: result.persisted,
      name: result.name,
      email: result.email,
      phone: result.phone,
      eventType: result.eventType,
      eventDate: result.eventDate,
      packageId: result.packageId,
      message: result.message
    },
    {
      source: 'booking-flow'
    }
  );

  let mailDelivery = {
    delivered: false,
    queued: false,
    skipped: true,
    reason: 'missing-recipient'
  };
  let personalizationMeta = {
    variantId: null,
    matchType: 'default',
    keywords: [],
    city: null
  };

  try {
    const { tokens, personalization } = await buildBookingEmailContext(payload, result);
    personalizationMeta = personalization;

    if (result.email) {
      mailDelivery = await mailService.sendBookingConfirmation({
        to: result.email,
        tokens,
        meta: {
          bookingId: result.id,
          matchType: personalization.matchType,
          variantId: personalization.variantId,
          packageId: result.packageId || payload.packageId || null,
          eventType: result.eventType || payload.eventType || null
        }
      });
    }
  } catch (error) {
    console.error('[bookingService] Failed to send booking confirmation email:', error.message);
    mailDelivery = {
      delivered: false,
      queued: false,
      error: error.message
    };
  }

  return {
    id: result.id,
    status: result.status,
    createdAt: result.createdAt,
    persisted: result.persisted,
    rentGuySync,
    mailDelivery,
    personalization: personalizationMeta
  };
}

async function getRecentBookings(limit = 10) {
  if (db.isConfigured()) {
    try {
      const result = await db.runQuery(
        `SELECT id, name, email, phone, event_type AS "eventType", event_date AS "eventDate", package_id AS "packageId", status, created_at AS "createdAt"
         FROM bookings
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );

      if (result) {
        return {
          persisted: true,
          bookings: result.rows
        };
      }
    } catch (error) {
      console.error('[bookingService] Failed to fetch bookings from database:', error.message);
    }
  }

  const bookings = Array.from(inMemoryBookings.values())
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit)
    .map(({ id, status, createdAt, name, email, phone, eventType, eventDate, packageId }) => ({
      id,
      status,
      createdAt,
      name,
      email,
      phone,
      eventType,
      eventDate,
      packageId
    }));

  return {
    persisted: false,
    bookings
  };
}

function resetInMemoryStore() {
  inMemoryBookings.clear();
}

function getBookingServiceStatus() {
  const dbStatus = db.getStatus();

  return {
    databaseConnected: dbStatus.connected,
    storageStrategy: dbStatus.connected ? 'postgres' : 'in-memory',
    fallbackQueueSize: inMemoryBookings.size,
    lastError: dbStatus.lastError
  };
}

module.exports = {
  createBooking,
  getRecentBookings,
  resetInMemoryStore,
  getBookingServiceStatus
};
