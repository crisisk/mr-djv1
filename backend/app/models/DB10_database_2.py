// tests/dj.model.test.ts
import { DJ, createDJTable } from '../src/models/dj.model';
import { knex } from '../src/config/database';

describe('DJ Model - Soft Delete', () => {
  beforeAll(async () => {
    await createDJTable();
    await knex('djs').del();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it('should create a DJ', async () => {
    const dj = await DJ.query().insert({
      name: 'Test DJ',
      genre: 'House',
      pricePerHour: 200,
    });

    expect(dj).toBeDefined();
    expect(dj.name).toBe('Test DJ');
    expect(dj.deletedAt).toBeNull();
  });

  it('should soft delete a DJ', async () => {
    const dj = await DJ.query().first();
    if (!dj) throw new Error('No DJ found');

    await DJ.softDeleteById(dj.id);
    const deletedDj = await DJ.query().findById(dj.id);

    // Should not find with default query
    const shouldBeNull = await DJ.query().findById(dj.id);
    expect(shouldBeNull).toBeUndefined();

    // Should find with withDeleted modifier
    const withDeleted = await DJ.query().withGraphFetched('').modify('withDeleted').findById(dj.id);
    expect(withDeleted).toBeDefined();
    expect(withDeleted?.deletedAt).not.toBeNull();
  });

  it('should restore a soft deleted DJ', async () => {
    const dj = await DJ.query().withGraphFetched('').modify('withDeleted').first();
    if (!dj) throw new Error('No DJ found');

    await DJ.restoreById(dj.id);
    const restoredDj = await DJ.query().findById(dj.id);

    expect(restoredDj).toBeDefined();
    expect(restoredDj?.deletedAt).toBeNull();
  });

  it('should permanently delete a DJ', async () => {
    const dj = await DJ.query().first();
    if (!dj) throw new Error('No DJ found');

    await DJ.forceDeleteById(dj.id);
    const deletedDj = await DJ.query().withGraphFetched('').modify('withDeleted').findById(dj.id);

    expect(deletedDj).toBeUndefined();
  });
});
