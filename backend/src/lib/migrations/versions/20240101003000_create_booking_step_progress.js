exports.up = async (knex) => {
  await knex.schema.createTable('booking_step_progress', (table) => {
    table.increments('id').primary();
    table.string('flow_id', 64).notNullable();
    table.string('step_id', 64).notNullable();
    table.boolean('is_complete').notNullable().defaultTo(false);
    table.jsonb('payload');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.unique(['flow_id', 'step_id'], 'uq_booking_step_progress_flow_step');
    table.index(['flow_id'], 'idx_booking_step_progress_flow');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('booking_step_progress');
};
