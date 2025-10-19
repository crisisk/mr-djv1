// src/services/eventService.ts
import { PrismaClient } from '@prisma/client';
import { NotFoundError, ValidationError } from '../errors';

const prisma = new PrismaClient();

/**
 * Create a new event
 * @param {Object} eventData - Event data including date, type, status, and client_id
 * @returns {Promise<Event>} The created event
 * @throws {ValidationError} If required fields are missing or invalid
 */
export const createEvent = async (eventData: {
  date: Date;
  type: string;
  status: string;
  client_id: number;
}) => {
  const { date, type, status, client_id } = eventData;

  // Validate required fields
  if (!date || !type || !status || !client_id) {
    throw new ValidationError('Missing required fields');
  }

  // Create the event
  const event = await prisma.event.create({
    data: {
      date,
      type,
      status,
      client_id,
    },
  });

  return event;
};

/**
 * Get an event by ID
 * @param {number} id - The ID of the event
 * @returns {Promise<Event>} The event
 * @throws {NotFoundError} If the event is not found
 */
export const getEventById = async (id: number) => {
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    throw new NotFoundError('Event not found');
  }

  return event;
};

/**
 * Update an event by ID
 * @param {number} id - The ID of the event
 * @param {Object} eventData - Event data to update including date, type, status, and client_id
 * @returns {Promise<Event>} The updated event
 * @throws {NotFoundError} If the event is not found
 * @throws {ValidationError} If required fields are missing or invalid
 */
export const updateEvent = async (
  id: number,
  eventData: {
    date?: Date;
    type?: string;
    status?: string;
    client_id?: number;
  }
) => {
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    throw new NotFoundError('Event not found');
  }

  // Update the event
  const updatedEvent = await prisma.event.update({
    where: { id },
    data: eventData,
  });

  return updatedEvent;
};

/**
 * Delete an event by ID
 * @param {number} id - The ID of the event
 * @returns {Promise<void>}
 * @throws {NotFoundError} If the event is not found
 */
export const deleteEvent = async (id: number) => {
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    throw new NotFoundError('Event not found');
  }

  // Delete the event
  await prisma.event.delete({
    where: { id },
  });
};
