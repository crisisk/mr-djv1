// src/tests/eventService.test.ts
import { createEvent, getEventById, updateEvent, deleteEvent } from '../services/eventService';

describe('Event Service', () => {
  it('should create a new event', async () => {
    const eventData = {
      date: new Date(),
      type: 'Wedding',
      status: 'Pending',
      client_id: 1,
    };

    const event = await createEvent(eventData);
    expect(event).toHaveProperty('id');
    expect(event.type).toBe('Wedding');
  });

  it('should throw a validation error for missing fields', async () => {
    const eventData = {
      date: new Date(),
      type: 'Wedding',
      status: '',
      client_id: 1,
    };

    await expect(createEvent(eventData)).rejects.toThrow('Missing required fields');
  });

  it('should get an event by ID', async () => {
    const event = await getEventById(1);
    expect(event).toHaveProperty('id');
    expect(event.id).toBe(1);
  });

  it('should throw a not found error for non-existent event', async () => {
    await expect(getEventById(999)).rejects.toThrow('Event not found');
  });

  it('should update an event', async () => {
    const updatedEvent = await updateEvent(1, { status: 'Confirmed' });
    expect(updatedEvent.status).toBe('Confirmed');
  });

  it('should delete an event', async () => {
    await deleteEvent(1);
    await expect(getEventById(1)).rejects.toThrow('Event not found');
  });
});
