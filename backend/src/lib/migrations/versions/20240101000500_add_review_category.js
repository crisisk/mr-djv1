exports.up = async (knex) => {
  await knex.schema.alterTable('reviews', (table) => {
    table.string('category', 50).notNullable().defaultTo('bruiloft');
  });

  await knex('reviews').update(
    'category',
    knex.raw(`CASE
      WHEN LOWER(COALESCE(event_type, '')) LIKE '%bedrij%' OR LOWER(COALESCE(event_type, '')) LIKE '%corporate%' OR LOWER(COALESCE(event_type, '')) LIKE '%business%' THEN 'bedrijfsfeest'
      WHEN LOWER(COALESCE(event_type, '')) LIKE '%jubile%' OR LOWER(COALESCE(event_type, '')) LIKE '%verjaardag%' OR LOWER(COALESCE(event_type, '')) LIKE '%private%' THEN 'private'
      ELSE 'bruiloft'
    END`)
  );

  await knex.schema.raw(
    "ALTER TABLE reviews ADD CONSTRAINT reviews_category_check CHECK (category IN ('bruiloft','bedrijfsfeest','private'))"
  );

  await knex.schema.raw('ALTER TABLE reviews ALTER COLUMN category DROP DEFAULT');
};

exports.down = async (knex) => {
  await knex.schema.raw('ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_category_check');
  await knex.schema.alterTable('reviews', (table) => {
    table.dropColumn('category');
  });
};
