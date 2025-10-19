// src/tests/clientService.test.ts
import clientService from '../services/clientService';
import { prisma } from '../utils/prisma';
import { NotFoundError, ValidationError } from '../errors';

describe('ClientService', () => {
  const testClient = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+1234567890',
  };

  afterEach(async () => {
    await prisma.client.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createClient', () => {
    it('should create a new client', async () => {
      const client = await clientService.createClient(testClient);
      expect(client).toHaveProperty('id');
      expect(client.email).toBe(testClient.email);
    });

    it('should reject duplicate emails', async () => {
      await clientService.createClient(testClient);
      await expect(clientService.createClient(testClient)).rejects.toThrow(ValidationError);
    });
  });

  describe('getClientById', () => {
    it('should retrieve a client by ID', async () => {
      const client = await clientService.createClient(testClient);
      const found = await clientService.getClientById(client.id);
      expect(found?.id).toBe(client.id);
    });

    it('should throw NotFoundError for invalid ID', async () => {
      await expect(clientService.getClientById('invalid-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateClient', () => {
    it('should update client information', async () => {
      const client = await clientService.createClient(testClient);
      const updated = await clientService.updateClient(client.id, { phone: '+0987654321' });
      expect(updated.phone).toBe('+0987654321');
    });
  });

  describe('deleteClient', () => {
    it('should delete a client and their bookings', async () => {
      const client = await clientService.createClient(testClient);
      await clientService.deleteClient(client.id);
      await expect(clientService.getClientById(client.id)).rejects.toThrow(NotFoundError);
    });
  });
});
