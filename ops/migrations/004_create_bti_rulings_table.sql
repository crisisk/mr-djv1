-- Table to store Binding Tariff Information (BTI) rulings.
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

CREATE INDEX IF NOT EXISTS idx_bti_rulings_valid
  ON bti_rulings(valid_from, valid_to, precedence);

CREATE INDEX IF NOT EXISTS idx_bti_rulings_text
  ON bti_rulings USING GIN (keywords);
