'use strict';

exports.up = async function up(knex) {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION is_valid_on(valid_from date, valid_to date, ref date)
    RETURNS boolean
    LANGUAGE sql
    IMMUTABLE
    AS $$
      SELECT (valid_from IS NULL OR valid_from <= ref)
         AND (valid_to   IS NULL OR valid_to   >= ref);
    $$;
  `);

  await knex.raw(`
    CREATE OR REPLACE VIEW v_taric_nomenclature AS
    SELECT
      n.code::varchar(10)      AS taric_code,
      n.cn_code::varchar(8)    AS hs_code8,
      n.description            AS description,
      n.valid_from::date       AS valid_from,
      n.valid_to::date         AS valid_to,
      n.parent_code            AS parent_code
    FROM taric_nomenclature n;
  `);

  await knex.raw(`
    CREATE OR REPLACE VIEW v_taric_measures AS
    SELECT
      m.taric_code::varchar(10) AS taric_code,
      m.measure_type            AS measure_type,
      m.country_code::varchar(2) AS country_code,
      m.valid_from::date,
      m.valid_to::date,
      m.additional_code,
      m.footnotes
    FROM taric_measures m;
  `);

  await knex.raw(`
    CREATE OR REPLACE VIEW v_hs_codes AS
    SELECT
      h.hs_code8::varchar(8) AS hs_code8,
      h.chapter               AS chapter,
      h.heading               AS heading,
      h.subheading            AS subheading,
      h.description,
      h.valid_from::date,
      h.valid_to::date
    FROM hs_codes h;
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS bti_rulings (
      id uuid PRIMARY KEY,
      ruling_ref text NOT NULL,
      hs_code8 varchar(8) NOT NULL,
      taric_code varchar(10),
      country_scope varchar(2),
      keywords tsvector,
      commodity_examples jsonb,
      attachments jsonb,
      valid_from date NOT NULL,
      valid_to date,
      precedence smallint NOT NULL DEFAULT 100,
      status varchar(16) NOT NULL DEFAULT 'ACTIVE',
      source text,
      created_at timestamptz DEFAULT now()
    );
  `);

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_bti_rulings_valid
    ON bti_rulings (valid_from, valid_to, precedence);
  `);

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_bti_rulings_text
    ON bti_rulings USING GIN (keywords);
  `);

  await knex.raw(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_hs_taric_today AS
    SELECT t.hs_code8, t.taric_code, t.description
    FROM v_taric_nomenclature t
    WHERE is_valid_on(t.valid_from, t.valid_to, CURRENT_DATE);
  `);

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_mv_hs_taric_today_hs
    ON mv_hs_taric_today (hs_code8);
  `);

  await knex.raw(`
    ALTER TABLE cbam_report_drafts
      ADD COLUMN IF NOT EXISTS hs_code8 varchar(8),
      ADD COLUMN IF NOT EXISTS taric_code varchar(10),
      ADD COLUMN IF NOT EXISTS ruling_id uuid,
      ADD COLUMN IF NOT EXISTS classification_source varchar(16);
  `);

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS shipment_classifications (
      id uuid PRIMARY KEY,
      shipment_id uuid NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
      hs_code8 varchar(8) NOT NULL,
      taric_code varchar(10),
      ruling_id uuid,
      classification_source varchar(16) NOT NULL,
      decided_at timestamptz DEFAULT now(),
      ref_date date NOT NULL
    );
  `);

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_ship_class_ship
    ON shipment_classifications (shipment_id, decided_at DESC);
  `);
};

exports.down = async function down(knex) {
  await knex.raw('DROP INDEX IF EXISTS idx_ship_class_ship');
  await knex.raw('DROP TABLE IF EXISTS shipment_classifications');
  await knex.raw(`
    ALTER TABLE cbam_report_drafts
      DROP COLUMN IF EXISTS classification_source,
      DROP COLUMN IF EXISTS ruling_id,
      DROP COLUMN IF EXISTS taric_code,
      DROP COLUMN IF EXISTS hs_code8;
  `);
  await knex.raw('DROP INDEX IF EXISTS idx_mv_hs_taric_today_hs');
  await knex.raw('DROP MATERIALIZED VIEW IF EXISTS mv_hs_taric_today');
  await knex.raw('DROP INDEX IF EXISTS idx_bti_rulings_text');
  await knex.raw('DROP INDEX IF EXISTS idx_bti_rulings_valid');
  await knex.raw('DROP TABLE IF EXISTS bti_rulings');
  await knex.raw('DROP FUNCTION IF EXISTS is_valid_on(date, date, date)');
  await knex.raw('DROP VIEW IF EXISTS v_taric_measures');
  await knex.raw('DROP VIEW IF EXISTS v_taric_nomenclature');
  await knex.raw('DROP VIEW IF EXISTS v_hs_codes');
};
