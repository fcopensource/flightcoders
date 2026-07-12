# FlightCoders

FlightCoders is a full-stack Next.js learning platform for aviation software, autonomy, robotics, and flight data.

## Stack

- Next.js 16 / React 19
- Hostinger MySQL
- FlightCoders email/password accounts with bcrypt hashing
- Opaque database-backed sessions in secure HTTP-only cookies
- Groq-powered Vector AI mentor

## Local setup

1. Copy `.env.example` to `.env.local` and fill in MySQL credentials.
2. Import `database/schema.sql` into MySQL.
3. Run `npm install`.
4. Run `npm run dev`.

## Production

See `HOSTINGER_DEPLOYMENT.md` for deployment settings, required environment variables, database setup, and the complete API reference.
