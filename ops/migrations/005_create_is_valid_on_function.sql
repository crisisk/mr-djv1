-- Helper function to check whether a record is valid on a specific reference date.
CREATE OR REPLACE FUNCTION is_valid_on(valid_from date, valid_to date, ref date)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (valid_from IS NULL OR valid_from <= ref)
     AND (valid_to   IS NULL OR valid_to   >= ref);
$$;
