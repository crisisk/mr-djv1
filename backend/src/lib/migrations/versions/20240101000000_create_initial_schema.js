exports.up = async (knex) => {
  await knex.schema.createTable('bookings', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('phone', 50).notNullable();
    table.string('event_type', 100).notNullable();
    table.date('event_date');
    table.text('message');
    table.string('package_id', 50);
    table.string('status', 50).defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index(['status'], 'idx_bookings_status');
    table.index(['event_date'], 'idx_bookings_event_date');
  });

  await knex.schema.createTable('contacts', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('phone', 50);
    table.text('message');
    table.string('event_type', 100);
    table.date('event_date');
    table.string('package_id', 50);
    table.string('status', 50).defaultTo('new');
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index(['status'], 'idx_contacts_status');
  });

  await knex.schema.createTable('callback_requests', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('phone', 50).notNullable();
    table.string('event_type', 100);
    table.string('status', 50).defaultTo('new');
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index(['status'], 'idx_callback_requests_status');
  });

  await knex.schema.createTable('packages', (table) => {
    table.string('id', 50).primary();
    table.string('name', 255).notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.string('duration', 50);
    table.text('description');
    table.jsonb('features');
    table.boolean('popular').defaultTo(false);
    table.boolean('active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('reviews', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('event_type', 100);
    table.integer('rating').notNullable();
    table.text('review_text');
    table.boolean('approved').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index(['approved'], 'idx_reviews_approved');
  });
  await knex.schema.raw(
    'ALTER TABLE reviews ADD CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5)'
  );
};

exports.down = async (knex) => {
  await knex.schema.raw('ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_rating_check');
  await knex.schema.dropTableIfExists('reviews');
  await knex.schema.dropTableIfExists('packages');
  await knex.schema.dropTableIfExists('callback_requests');
  await knex.schema.dropTableIfExists('contacts');
  await knex.schema.dropTableIfExists('bookings');
};
