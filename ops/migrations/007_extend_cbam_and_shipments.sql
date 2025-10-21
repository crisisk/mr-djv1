-- Adds classification related columns and snapshot table.
ALTER TABLE IF EXISTS cbam_report_drafts
  ADD COLUMN IF NOT EXISTS hs_code8 varchar(8),
  ADD COLUMN IF NOT EXISTS taric_code varchar(10),
  ADD COLUMN IF NOT EXISTS ruling_id uuid,
  ADD COLUMN IF NOT EXISTS classification_source varchar(16);

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

CREATE INDEX IF NOT EXISTS idx_ship_class_ship
  ON shipment_classifications(shipment_id, decided_at DESC);
