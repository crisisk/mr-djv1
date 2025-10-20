exports.up = async (knex) => {
  await knex.schema.createTable('survey_feedback', (table) => {
    table.string('id', 36).primary();
    table.string('contact_id', 64);
    table.string('contact_source', 64);
    table.string('email', 255).notNullable();
    table.string('name', 255).notNullable();
    table.string('event_type', 100);
    table.date('event_date');
    table.string('package_id', 50);
    table.string('response_token', 64).notNullable().unique();
    table.string('response_url', 512);
    table.string('status', 50).notNullable().defaultTo('pending');
    table.integer('rating');
    table.text('review_text');
    table.boolean('would_recommend');
    table.boolean('approved').notNullable().defaultTo(false);
    table.timestamp('sent_at');
    table.timestamp('submitted_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.text('last_error');

    table.index(['status'], 'idx_survey_feedback_status');
    table.index(['approved'], 'idx_survey_feedback_approved');
    table.index(['submitted_at'], 'idx_survey_feedback_submitted_at');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('survey_feedback');
};
