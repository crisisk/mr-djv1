-- Creates a canonical TARIC nomenclature view that normalises column names.
CREATE OR REPLACE VIEW v_taric_nomenclature AS
SELECT
  n.code::varchar(10)      AS taric_code,
  n.cn_code::varchar(8)    AS hs_code8,
  n.description            AS description,
  n.valid_from::date       AS valid_from,
  n.valid_to::date         AS valid_to,
  n.parent_code            AS parent_code
FROM taric_nomenclature n;
