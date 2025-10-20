exports.up = async (knex) => {
  await knex.raw(
    `INSERT INTO packages (id, name, price, duration, features, popular, active) VALUES
      ('bronze', 'Brons Pakket', 795.00, '4 uur',
        '["Professionele DJ", "Geluidssysteem", "Basisverlichting", "Muziekvoorkeuren formulier", "100% Dansgarantie"]'::jsonb,
        FALSE, TRUE),
      ('silver', 'Zilver Pakket', 995.00, '5 uur',
        '["Professionele DJ", "Premium geluidssysteem", "LED verlichting", "Rookmachine", "Muziekvoorkeuren formulier", "Persoonlijk intakegesprek", "100% Dansgarantie"]'::jsonb,
        TRUE, TRUE),
      ('gold', 'Goud Pakket', 1295.00, '6 uur',
        '["Professionele DJ", "Premium geluidssysteem", "Moving head verlichting", "Rookmachine", "DJ booth met logo", "Muziekvoorkeuren formulier", "Persoonlijk intakegesprek", "Saxofonist (optioneel)", "100% Dansgarantie"]'::jsonb,
        FALSE, TRUE)
    ON CONFLICT (id) DO NOTHING`
  );

  await knex.raw(
    `INSERT INTO reviews (name, event_type, rating, review_text, approved) VALUES
      ('Sarah & Tom', 'Bruiloft 2024', 5, 'Mister DJ maakte onze bruiloft onvergetelijk! De dansvloer was de hele avond vol en de muziekkeuze was perfect. Onze gasten praten er nog steeds over!', TRUE),
      ('Mark van der Berg', 'Corporate Event 2024', 5, 'Professioneel, betrouwbaar en geweldig in het lezen van het publiek. Ons bedrijfsfeest was een groot succes dankzij Mister DJ!', TRUE),
      ('Linda Janssen', '50 Jaar Jubileum 2024', 5, 'Van begin tot eind perfect geregeld. De 100% dansgarantie is geen loze belofte - iedereen stond op de dansvloer!', TRUE)
    ON CONFLICT DO NOTHING`
  );
};

exports.down = async (knex) => {
  await knex('reviews')
    .whereIn('name', ['Sarah & Tom', 'Mark van der Berg', 'Linda Janssen'])
    .del();

  await knex('packages')
    .whereIn('id', ['bronze', 'silver', 'gold'])
    .del();
};
