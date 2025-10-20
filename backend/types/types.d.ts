declare type BookingPayload = {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    eventDate?: string | Date | null;
    packageId?: string | null;
    message?: string | null;
};

declare type RentGuySyncResult = {
    delivered: boolean;
    queued: boolean;
    queueSize?: number;
    reason?: string;
};

declare type BookingRecord = {
    id: string;
    status: string;
    createdAt: Date;
    persisted: boolean;
    name: string;
    email: string;
    phone: string;
    eventType: string;
    eventDate: Date | null;
    packageId: string | null;
    message: string | null;
};

declare type CreateBookingResult = {
    id: string;
    status: string;
    createdAt: Date;
    persisted: boolean;
    rentGuySync: RentGuySyncResult;
};

/**
 * Persists a booking in Postgres when available and mirrors it to RentGuy.
 */
declare function createBooking(payload: BookingPayload): Promise<CreateBookingResult>;

/**
 * Fetches the most recent bookings, falling back to the in-memory store.
 */
declare function getRecentBookings(limit?: number): Promise<{ persisted: boolean; bookings: BookingRecord[]; }>;

/**
 * Clears the in-memory booking cache (used in tests).
 */
declare function resetInMemoryStore(): void;

/**
 * Provides diagnostics about the current booking persistence strategy.
 */
declare function getBookingServiceStatus(): any;

declare type CallbackRequestPayload = {
    name: string;
    phone: string;
    eventType?: string | null;
};

declare type CallbackRequestRecord = {
    id: string;
    status: string;
    createdAt: Date;
    persisted: boolean;
    eventType: string | null;
    name: string;
    phone: string;
};

declare type RentGuySyncResult = {
    delivered: boolean;
    queued: boolean;
    queueSize?: number;
    reason?: string;
};

declare type SevensaSyncResult = {
    delivered: boolean;
    queued: boolean;
    queueSize?: number;
    reason?: string;
    lastError?: string;
};

declare type SaveCallbackRequestResult = {
    id: string;
    status: string;
    createdAt: Date;
    persisted: boolean;
    eventType: string | null;
    name: string;
    phone: string;
    rentGuySync: RentGuySyncResult;
    sevensaSync: SevensaSyncResult;
};

/**
 * Stores a callback request, falling back to an in-memory queue and syncing with partners.
 */
declare function saveCallbackRequest(payload: CallbackRequestPayload): Promise<SaveCallbackRequestResult>;

/**
 * Returns the operational status for the callback request pipeline.
 */
declare function getCallbackRequestServiceStatus(): any;

/**
 * Clears the in-memory booking cache (used in tests).
 */
declare function resetInMemoryStore(): void;

declare type CityAutomationContext = {
    repoRoot: string;
    fs: any;
    fetchImpl: (...params: any[]) => any;
    seoApiUrl: string;
    seoApiKey: string;
    seoKeywordSetId: string;
    seoRegion: string;
    themeKeywords: string[];
    llmProvider: string;
    llmModel: string;
    llmApiKey: string;
    approvalEmail: string;
    dryRun: boolean;
    bannedClaims: string[];
    reviewFilePath: string;
    reportFilePath: string;
    citiesFilePath: string;
    generatorScriptPath: string;
    limit: number;
};

declare type KeywordEntry = {
    keyword: string;
    city?: string;
    searchVolume?: number;
    serpFeatures?: string[];
    region?: string;
    country?: string;
    geo?: string;
};

declare type FilteredKeywordEntry = {
    keyword: string;
    city?: string;
    searchVolume?: number;
    serpFeatures?: string[];
    region?: string;
    country?: string;
    geo?: string;
    slug: string;
};

declare type GeneratedCityContent = {
    slug: string;
    city: string;
    intro: string;
    cases: object[];
    venues: string[];
    faqs: object[];
};

declare type TemplateContentParams = {
    keyword: string;
    city: string;
    searchVolume?: number;
    serpFeatures?: string[];
};

declare type WorkflowResultItem = {
    slug: string;
    keyword: string;
    city: string;
    searchVolume?: number;
    serpFeatures?: string[];
    content: GeneratedCityContent;
    issues?: string[];
};

declare type GeneratorSummary = {
    success: boolean;
    skipped: boolean;
    script: string;
    error: string;
};

declare type WorkflowSummary = {
    processed: number;
    approved: WorkflowResultItem[];
    flagged: WorkflowResultItem[];
    skipped: number;
    generator?: GeneratorSummary;
};

/**
 * Creates a normalized execution context that can be overridden during tests.
 */
declare function resolveContext(overrides?: any): CityAutomationContext;

/**
 * Builds a deterministic slug for a keyword or city entry.
 */
declare function buildSlugFromKeyword(item: KeywordEntry): string | null;

/**
 * Fetches keyword candidates from the SEO automation API.
 */
declare function fetchKeywordSet(contextOverrides?: any): Promise<{ keywords: KeywordEntry[]; }>;

/**
 * Filters the inbound keyword list so only relevant, unique slugs remain.
 */
declare function filterKeywords(keywords?: KeywordEntry[], contextOverrides?: any): FilteredKeywordEntry[];

/**
 * Resolves which slugs already exist in Postgres or the local JSON cache.
 */
declare function lookupExistingSlugs(slugs: string[], contextOverrides?: any): Promise<Set<string>>;

/**
 * Requests generated copy from the configured LLM provider.
 */
declare function callLlm(prompt: string, context: CityAutomationContext): Promise<string | null>;

/**
 * Builds templated content when the LLM cannot be used or returns invalid JSON.
 */
declare function buildTemplateContent(params: TemplateContentParams): GeneratedCityContent;

/**
 * Generates SEO landing page content for a city keyword.
 */
declare function generateCityContent(entry: KeywordEntry, contextOverrides?: any): Promise<GeneratedCityContent>;

/**
 * Runs basic QC checks to ensure the generated copy meets editorial standards.
 */
declare function qualityCheck(content: GeneratedCityContent, contextOverrides?: any): any;

/**
 * Persists approved content into the `cities.json` dataset.
 */
declare function upsertCityContent(entries: GeneratedCityContent[], contextOverrides?: any): Promise<{ updated: number; }>;

/**
 * Appends flagged entries to the manual review queue markdown file.
 */
declare function appendReviewQueue(flagged: WorkflowResultItem[], contextOverrides?: any): Promise<void>;

/**
 * Writes a run summary for the automation workflow.
 */
declare function writeReport(summary: WorkflowSummary, contextOverrides?: any): Promise<void>;

/**
 * Executes the static site generator after new content is approved.
 */
declare function runStaticGenerator(contextOverrides?: any): Promise<{ success: boolean; skipped: boolean; script: string; error: string | null; }>;

/**
 * Coordinates the full city content automation pipeline.
 */
declare function runWorkflow(options?: {
    limit?: number;
    dryRun?: boolean;
    contextOverrides?: any;
}): Promise<WorkflowSummary>;

declare type DashboardEntry = {
    name: string;
    hasValue: boolean;
    preview: string | null;
};

declare type DashboardGroup = {
    id: string;
    label: string;
    description?: string;
    entries: DashboardEntry[];
};

declare type DashboardState = {
    managedKeys: string[];
    entries: DashboardEntry[];
    groups: DashboardGroup[];
    metadata: any;
};

/**
 * Replaces sensitive values with a masked representation.
 */
declare function maskValue(value: string | null | undefined): string | null;

/**
 * Normalizes user supplied values to strings for storage.
 */
declare function normalizeValue(value: unknown): string | null;

/**
 * Loads the managed environment file.
 */
declare function getCurrentValues(): {
    [key: string]: string;
};

/**
 * Builds the dashboard view model for the provided configuration values.
 */
declare function buildState(values: {
    [key: string]: string;
}): DashboardState;

/**
 * Persists submitted dashboard changes and reloads runtime config.
 */
declare function updateValues(payload: {
    [key: string]: any;
}): Promise<DashboardState>;

/**
 * Returns the current dashboard state for rendering.
 */
declare function getState(): DashboardState;

declare type ContactPayload = {
    name: string;
    email: string;
    phone: string;
    message?: string | null;
    eventType?: string | null;
    eventDate?: string | Date | null;
    packageId?: string | null;
};

declare type ContactRecord = {
    id: string;
    status: string;
    createdAt: Date;
    persisted: boolean;
    eventType: string | null;
    eventDate: Date | null;
    packageId: string | null;
    name: string;
    email: string;
    phone: string;
    message: string | null;
};

declare type RentGuySyncResult = {
    delivered: boolean;
    queued: boolean;
    queueSize?: number;
    reason?: string;
};

declare type SevensaSyncResult = {
    delivered: boolean;
    queued: boolean;
    queueSize?: number;
    reason?: string;
    lastError?: string;
};

declare type SaveContactResult = {
    id: string;
    status: string;
    createdAt: Date;
    persisted: boolean;
    eventType: string | null;
    eventDate: Date | null;
    packageId: string | null;
    name: string;
    email: string;
    phone: string;
    message: string | null;
    rentGuySync: RentGuySyncResult;
    sevensaSync: SevensaSyncResult;
};

/**
 * Normalizes incoming event dates into valid Date objects when possible.
 */
declare function normalizeEventDate(value: string | Date | null | undefined): Date | null;

/**
 * Stores a contact form submission and synchronizes it with external systems.
 */
declare function saveContact(payload: ContactPayload): Promise<SaveContactResult>;

/**
 * Summarizes the contact service health and storage strategy.
 */
declare function getContactServiceStatus(): any;

/**
 * Clears the in-memory booking cache (used in tests).
 */
declare function resetInMemoryStore(): void;

declare type QueueEntry = {
    id: string;
    url: string;
    device: string;
    trigger: string;
    tools: string[];
    variantId?: string | null;
    status: string;
    requestedAt: string;
    startedAt?: string;
    completedAt?: string;
};

declare type MonitoringRun = {
    id: string;
    url: string;
    device: string;
    trigger: string;
    status: string;
    metrics: any;
    axe: any;
    requestedAt: string;
    startedAt: string;
    completedAt: string;
    variantId?: string | null;
};

declare type MonitoringSummary = {
    lastRunAt: string | null;
    averageScores: any | null;
    degradedRuns: number;
};

declare type MonitoringState = {
    updatedAt: string | null;
    queue: QueueEntry[];
    runs: MonitoringRun[];
    targets: object[];
    summary: MonitoringSummary;
};

declare type VariantAnalytics = {
    variantId: string;
    label: string;
    experimentId: string | null;
    exposures: number;
    impressions: number;
    ctaClicks: number;
    conversions: number;
    conversionRate: number;
    ctaClickRate: number;
    formCompletionRate: number;
    matchTypes: {
        [key: string]: number;
    };
    topKeywords: { keyword: string; count: number; }[];
    recentEvents: { type: string; createdAt: string; }[];
};

declare type VariantAnalyticsTotals = {
    exposures: number;
    impressions: number;
    ctaClicks: number;
    conversions: number;
    conversionRate: number;
    ctaClickRate: number;
};

/**
 * Lazily loads persisted monitoring history and ensures in-memory structures are ready.
 */
declare function ensureInitialized(): Promise<void>;

/**
 * Writes monitoring history to disk for durability.
 */
declare function persistHistory(): Promise<void>;

/**
 * Builds a queue entry describing a scheduled monitoring run.
 */
declare function createQueueEntry(options?: {
    url?: string;
    device?: string;
    variantId?: string | null;
    trigger?: string;
    tools?: string[];
}): QueueEntry;

/**
 * Queues a new monitoring task and triggers background processing.
 */
declare function scheduleRun(options?: {
    url?: string;
    device?: string;
    variantId?: string | null;
    trigger?: string;
    tools?: string[];
}): Promise<QueueEntry>;

/**
 * Retrieves the current monitoring queue, recent runs and summary statistics.
 */
declare function getMonitoringState(): Promise<MonitoringState>;

/**
 * Aggregates personalization variant engagement metrics.
 */
declare function getVariantAnalytics(): Promise<{ updatedAt: string; variants: VariantAnalytics[]; totals: VariantAnalyticsTotals; }>;

/**
 * Clears all runtime state (used during tests).
 */
declare function reset(): void;

declare type Package = {
    id: string;
    name: string;
    price: number;
    duration: string | null;
    description: string;
    features: string[];
    popular?: boolean;
};

/**
 * Normalizes rows returned by Postgres into package objects.
 */
declare function mapDatabasePackages(result: any | null): Package[] | null;

/**
 * Resolves packages from content, the database or the static fallback.
 */
declare function getPackages(options?: {
    forceRefresh?: boolean;
}): Promise<{ packages: Package[]; source: string; cacheStatus: string; }>;

/**
 * Clears the package cache forcing the next call to re-fetch data.
 */
declare function resetCache(): void;

declare type PersonalizationVariant = {
    id: string;
    label: string;
    keywords?: string[];
    intentTags?: string[];
    keywordsNormalized?: string[];
    intentTagsNormalized?: string[];
    labelNormalized?: string;
    hero?: any;
    cro?: any;
    features?: any;
    testimonials?: any;
    pricing?: any;
    leadCapture?: any;
    automation?: any;
};

declare type PersonalizationConfig = {
    variants: PersonalizationVariant[];
    defaultVariant: PersonalizationVariant | null;
    defaultVariantId: string | null;
};

declare type CityEntry = {
    slug: string;
    city: string;
    intro: string;
    cases?: object[];
    venues?: string[];
    faqs?: object[];
    normalizedCity?: string;
    tokens?: Set<string>;
};

declare type PersonalizationContext = {
    keywords?: string[];
    keyword?: string;
    utmTerm?: string;
    search?: string;
    query?: string;
    personaHint?: string;
    additionalHints?: string[];
    landing?: string;
    utmCampaign?: string;
    utmSource?: string;
    referrer?: string;
};

declare type VariantSelectionMeta = {
    variantId: string;
    matchType: string;
    matchedKeywords: string[];
    keywordInput: string[];
    normalizedKeywords: string[];
    automationTriggered: boolean;
    experimentId: string | null;
    city: string | null;
};

declare type VariantSelection = {
    variant: PersonalizationVariant;
    meta: VariantSelectionMeta;
};

declare type PersonalizationEvent = {
    id: string;
    type: string;
    variantId: string;
    keyword: string | null;
    payload: {
        [key: string]: any;
    };
    context: {
        [key: string]: any;
    };
    createdAt: string;
    automationTriggered: boolean;
};

declare type ExposureLogEntry = {
    id: string;
    variantId: string;
    matchType: string;
    matchedKeywords: string[];
    keywordInput: string[];
    landing: string | null;
    utmCampaign: string | null;
    utmSource: string | null;
    city: string | null;
    createdAt: string;
};

/**
 * Loads personalization variant definitions from disk (with caching).
 */
declare function loadVariantsConfig(force?: boolean): Promise<PersonalizationConfig>;

/**
 * Loads known city entries to support location-based personalization.
 */
declare function loadCities(force?: boolean): Promise<CityEntry[]>;

/**
 * Selects the best-fit personalization variant for an incoming request.
 */
declare function getVariantForRequest(context?: PersonalizationContext): Promise<VariantSelection>;

/**
 * Records engagement events for analytics and triggers downstream automations.
 */
declare function recordEvent(params: {
    type: string;
    variantId: string;
    keyword?: string | null;
    payload?: {
        [key: string]: any;
    };
    context?: {
        [key: string]: any;
    };
}): Promise<PersonalizationEvent>;

/**
 * Returns a snapshot of the in-memory exposure log.
 */
declare function getExposureLog(): ExposureLogEntry[];

/**
 * Returns a snapshot of the in-memory event log.
 */
declare function getEventLog(): PersonalizationEvent[];

/**
 * Clears the exposure and event logs.
 */
declare function resetLogs(): void;

/**
 * Clears the package cache forcing the next call to re-fetch data.
 */
declare function resetCache(): void;

declare type RentGuyDeliveryMeta = {
    id?: string;
    source?: string;
    dedupeKey?: string;
};

declare type RentGuyDeliveryResult = {
    delivered: boolean;
    queued: boolean;
    queueSize: number;
    reason?: string;
};

declare type RentGuyBookingPayload = {
    id: string;
    status: string;
    eventType: string;
    eventDate?: Date | string | null;
    packageId?: string | null;
    name: string;
    email: string;
    phone: string;
    message?: string | null;
    persisted: boolean;
};

declare type RentGuyLeadPayload = {
    id: string;
    status: string;
    eventType: string | null;
    eventDate?: Date | string | null;
    packageId?: string | null;
    name: string;
    email?: string;
    phone: string;
    message?: string | null;
    persisted: boolean;
};

declare type RentGuyStatus = {
    configured: boolean;
    workspaceId: string | null;
    queueSize: number;
    activeJobs: number;
    metrics: any;
    deadLetterCount: number;
    lastSyncSuccess: any | null;
    lastSyncError: any | null;
    nextInQueue: any | null;
};

/**
 * Sends booking payloads to the RentGuy API, queueing if necessary.
 */
declare function syncBooking(booking: RentGuyBookingPayload, meta?: RentGuyDeliveryMeta): Promise<RentGuyDeliveryResult>;

/**
 * Sends lead payloads to the RentGuy API, queueing if necessary.
 */
declare function syncLead(lead: RentGuyLeadPayload, meta?: RentGuyDeliveryMeta): Promise<RentGuyDeliveryResult>;

/**
 * Sends personalization telemetry to RentGuy.
 */
declare function syncPersonalizationEvent(event: {
    [key: string]: any;
}, meta?: RentGuyDeliveryMeta): Promise<RentGuyDeliveryResult>;

/**
 * Forces pending jobs to be retried immediately.
 */
declare function flushQueue(limit?: number): Promise<{ configured: boolean; attempted: number; delivered: number; remaining: number; }>;

/**
 * Returns integration health metrics and queue depth information.
 */
declare function getStatus(): Promise<RentGuyStatus>;

/**
 * Replays failed jobs from the dead-letter queue back into the main queue.
 */
declare function replayDeadLetters(limit?: number): Promise<{ replayed: number; }>;

/**
 * Clears all runtime state (used during tests).
 */
declare function reset(): void;

declare type Review = {
    id: string;
    name: string;
    eventType: string;
    rating: number;
    reviewText: string;
    createdAt?: string;
};

/**
 * Retrieves approved reviews with caching and fallback data.
 */
declare function getApprovedReviews(limit?: number, options?: {
    forceRefresh?: boolean;
}): Promise<{ reviews: Review[]; source: string; cacheStatus: string; }>;

/**
 * Clears the package cache forcing the next call to re-fetch data.
 */
declare function resetCache(): void;

declare type SevensaDeliveryMeta = {
    id?: string;
    dedupeKey?: string;
};

declare type SevensaDeliveryResult = {
    delivered: boolean;
    queued: boolean;
    queueSize: number;
    reason?: string;
    lastError?: string;
};

declare type SevensaLead = {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    company?: string;
    message?: string;
    eventDate?: string;
    eventType?: string;
    budget?: string | number;
    pageUri?: string;
    pageName?: string;
    source?: string;
    persisted?: boolean;
    legalConsentOptions?: object[] | null;
};

/**
 * Adds a payload to the durable queue, deduplicating when possible.
 * @returns queue size after enqueueing
 */
declare function enqueue(payload: {
    [key: string]: any;
}, meta?: SevensaDeliveryMeta): Promise<number>;

/**
 * Attempts to deliver immediately and falls back to the queue when unavailable.
 */
declare function tryImmediateDelivery(payload: {
    [key: string]: any;
}, meta?: SevensaDeliveryMeta): Promise<SevensaDeliveryResult>;

/**
 * Converts a lead object into the Sevensa webhook payload structure.
 */
declare function mapLeadToPayload(lead: SevensaLead): any;

/**
 * Sends a lead to Sevensa, queueing if the webhook fails.
 */
declare function submitLead(lead: SevensaLead, meta?: SevensaDeliveryMeta): Promise<SevensaDeliveryResult>;

/**
 * Forces pending jobs to be retried immediately.
 */
declare function flushQueue(limit?: number): Promise<{ configured: boolean; attempted: number; delivered: number; remaining: number; }>;

/**
 * Returns integration health metrics and queue depth information.
 */
declare function getStatus(): Promise<RentGuyStatus>;

/**
 * Replays failed jobs from the dead-letter queue back into the main queue.
 */
declare function replayDeadLetters(limit?: number): Promise<{ replayed: number; }>;

/**
 * Clears all runtime state (used during tests).
 */
declare function reset(): void;

