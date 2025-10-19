// src/services/clientService.ts
import { PrismaClient, Client } from '@prisma/client';
import { NotFoundError, ValidationError } from '../errors';

const prisma = new PrismaClient();

/**
 * Client Service - Handles all business logic related to Clients
 */
class ClientService {
  /**
   * Create a new client with validation
   */
  async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'bookings'>): Promise<Client> {
    if (!clientData.email) {
      throw new ValidationError('Email is required');
    }

    try {
      return await prisma.client.create({
        data: clientData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ValidationError('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Get client by ID with optional booking history
   */
  async getClientById(id: string, includeBookings = false): Promise<Client | null> {
    const client = await prisma.client.findUnique({
      where: { id },
      include: { bookings: includeBookings },
    });

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    return client;
  }

  /**
   * Search clients by name or email (paginated)
   */
  async searchClients(
    query: string,
    page = 1,
    limit = 10
  ): Promise<{ clients: Client[]; total: number }> {
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
          ],
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { lastName: 'asc' },
      }),
      prisma.client.count({
        where: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return { clients, total };
  }

  /**
   * Update client information with validation
   */
  async updateClient(
    id: string,
    updateData: Partial<Client>
  ): Promise<Client> {
    // Check if client exists
    await this.getClientById(id);

    try {
      return await prisma.client.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ValidationError('Email already in use by another client');
      }
      throw error;
    }
  }

  /**
   * Delete a client and cascade delete their bookings
   */
  async deleteClient(id: string): Promise<void> {
    // Using transaction to ensure data consistency
    await prisma.$transaction([
      prisma.booking.deleteMany({ where: { clientId: id } }),
      prisma.client.delete({ where: { id } }),
    ]);
  }
}

export default new ClientService();
