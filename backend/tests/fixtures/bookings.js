const defaultEventDate = new Date('2025-01-15T18:00:00.000Z');

function buildBookingPayload(overrides = {}) {
  return {
    name: 'Test Booker',
    email: 'booker@example.com',
    phone: '0612345678',
    eventType: 'bruiloft',
    eventDate: defaultEventDate.toISOString(),
    message: 'We zijn klaar om te feesten!',
    packageId: 'premium',
    ...overrides
  };
}

function buildBookingUpdatePayload(overrides = {}) {
  return {
    status: 'confirmed',
    message: 'Boeking bevestigd en bijgewerkt.',
    eventDate: new Date('2025-02-01T20:00:00.000Z').toISOString(),
    ...overrides
  };
}

module.exports = {
  buildBookingPayload,
  buildBookingUpdatePayload
};
