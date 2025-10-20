const request = require('supertest');
const app = require('../app');
const { resetInMemoryStore } = require('../services/bookingService');
const { buildBookingPayload, buildBookingUpdatePayload } = require('../../tests/fixtures');

describe('Bookings API integration', () => {
  beforeEach(() => {
    resetInMemoryStore();
  });

  afterEach(() => {
    resetInMemoryStore();
  });

  it('creates a booking via the public endpoint', async () => {
    const payload = buildBookingPayload();

    const response = await request(app).post('/bookings').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      status: 'pending',
      persisted: false
    });
    expect(response.body.bookingId).toEqual(expect.any(String));
    expect(response.body.rentGuySync).toEqual(expect.objectContaining({ queued: true }));
  });

  it('returns created bookings in subsequent fetches', async () => {
    const payload = buildBookingPayload({ name: 'Lister Booker' });
    await request(app).post('/bookings').send(payload).expect(201);

    const response = await request(app).get('/bookings');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.bookings)).toBe(true);
    expect(response.body.bookings[0]).toMatchObject({
      name: 'Lister Booker',
      eventType: payload.eventType
    });
  });

  it('updates a booking with new details', async () => {
    const createResponse = await request(app).post('/bookings').send(buildBookingPayload());
    const bookingId = createResponse.body.bookingId;

    const updatePayload = buildBookingUpdatePayload({ message: 'Bijgewerkt bericht.' });
    const response = await request(app).put(`/bookings/${bookingId}`).send(updatePayload);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      booking: expect.objectContaining({
        id: bookingId,
        status: updatePayload.status,
        message: updatePayload.message
      })
    });
    expect(new Date(response.body.booking.updatedAt).getTime()).toBeGreaterThan(0);
  });

  it('deletes a booking and removes it from the list', async () => {
    const createResponse = await request(app).post('/bookings').send(buildBookingPayload());
    const bookingId = createResponse.body.bookingId;

    const deleteResponse = await request(app).delete(`/bookings/${bookingId}`);
    expect(deleteResponse.status).toBe(204);

    const listResponse = await request(app).get('/bookings');
    expect(listResponse.status).toBe(200);
    const identifiers = listResponse.body.bookings.map((booking) => booking.id);
    expect(identifiers).not.toContain(bookingId);
  });
});
