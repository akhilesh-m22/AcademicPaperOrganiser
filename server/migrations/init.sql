/*
  Migration: add password column to Users.
  - This file is intentionally small and intended to be run AFTER importing
    the main SQL file located at `server/sql/AcademicPaperOrganiser.sql`.

  Notes on portability:
  - Older MySQL versions do not support `IF NOT EXISTS` on ALTER TABLE or
    CREATE INDEX. To keep this migration simple and compatible, the ALTER
    statement below will attempt to add the `password` column. If the column
    already exists, most clients will show an error which can be safely
    ignored.
  - The `email` column in the original schema is created as `UNIQUE`, so an
    index already exists for it; creating another index will fail. Do not
    create a duplicate index here.

  If you prefer a no-error approach for your MySQL version, open a SQL client
  (MySQL Workbench) and run the following only if the `password` column is
  not present:

    ALTER TABLE Users ADD COLUMN password VARCHAR(255) DEFAULT NULL;

*/

-- Try to add password column (may error if already present; safe to ignore)
ALTER TABLE Users ADD COLUMN password VARCHAR(255) DEFAULT NULL;
