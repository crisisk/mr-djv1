// src/models/dj.model.ts
import { BaseModel } from './baseModel';
import { knex } from '../config/database';

export class DJ extends BaseModel {
  static get tableName() {
    return 'djs';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'genre'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        genre: { type: 'string', minLength: 1, maxLength: 255 },
        pricePerHour: { type: 'number', minimum: 0 },
        deletedAt: { type: ['string', 'null'], format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    // Define relationships here
    return {};
  }
}

// Create the table migration (would be in a separate migration file)
export async function createDJTable() {
  const exists = await knex.schema.hasTable('djs');
  if (!exists) {
    await knex.schema.createTable('djs', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('genre').notNullable();
      table.decimal('price_per_hour').notNullable();
      table.timestamp('deleted_at').nullable();
      table.timestamps(true, true);
    });
  }
}
