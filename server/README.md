AcademicPaperOrganiser - Backend

Quick start

1. Install dependencies

   - Open a terminal inside `server/` and run:

     npm install

2. Create a `.env` file based on `.env.example` and fill your MySQL credentials.

3. Import the provided SQL schema first. I recommend keeping the dump inside the
   server folder; this repo includes the SQL at `server/sql/AcademicPaperOrganiser.sql`.

   - Using MySQL client (from the `server` folder):

     mysql -u root -p < "sql/AcademicPaperOrganiser.sql"

   - Then run the migration to add the password column (optional if already present):

     mysql -u root -p AcademicPaperOrganiser < migrations/init.sql

4. Start the server

   npm run dev

API endpoints (minimal)

- POST /api/auth/register  { name, email, password }
- POST /api/auth/login     { email, password } -> { token }
- GET /api/papers         -> list papers with authors & tags
- GET /api/papers/:id     -> paper details
- POST /api/papers        -> create paper (protected)
- GET /api/users/:id/papers -> papers added by a user
- GET /api/tags
- GET /api/authors

Notes

- This backend expects the schema from `AcademicPaperOrganiser.sql`. The `migrations/init.sql` file will add a `password` column to `Users` if missing.
