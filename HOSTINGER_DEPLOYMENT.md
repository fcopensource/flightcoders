# FlightCoders — Hostinger deployment and API reference

## Hosting requirement

Use a Hostinger **Node.js Web App** on a Business Web Hosting, Cloud, or VPS plan. A static-only hosting plan cannot run authentication, MySQL sessions, or the AI endpoint.

## Deploy

1. In hPanel, create a MySQL database under **Databases → MySQL Databases**.
2. Open phpMyAdmin and import `database/schema.sql`.
3. Add a **Node.js Web App** and upload the project ZIP or connect its GitHub repository.
4. Select Node.js 22 or 24.
5. Use build command `npm run build` and start command `npm run start`.
6. Add the environment variables below in the Hostinger app settings.
7. Connect `flightcoders.com` to the Node.js application and enable its automatic SSL certificate.
8. Deploy, then open `https://flightcoders.com/api/health` and confirm it returns `database: connected`.

## Environment variables

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_hostinger_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_hostinger_database_name
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
NEXT_PUBLIC_APP_URL=https://flightcoders.com
```

Never commit `.env.local` or paste the Groq key into browser-side code. The implemented AI route reads it only on the server.

`GROQ_MODEL` is optional because the backend has the displayed model as its default. All other variables are required for the complete production application.

## GitHub deployment

1. Push the project source to your GitHub repository. Do not commit any `.env.local`, `.env.production`, database password, or Groq key.
2. In Hostinger hPanel choose **Add Website → Node.js Web App → Import Git Repository**.
3. Select the repository and production branch, then choose Node.js 22.
4. Use build command `npm run build` and start command `npm run start`.
5. Import the variables from `.env.production.example`, replacing every placeholder with the real value.
6. Deploy and connect `flightcoders.com` from the application dashboard.

## API endpoints

### Public

| Method | Endpoint | Purpose | Body |
|---|---|---|---|
| `GET` | `/api/health` | Health and MySQL connectivity check | None |
| `POST` | `/api/auth/register` | Create an account and session | Form data: `name`, `email`, `password`, `confirmPassword`, optional `role`, optional `track`, `terms=on` |
| `POST` | `/api/auth/login` | Verify credentials and create a session | Form data: `email`, `password`, optional `next` |

### Authenticated

The browser sends the secure `fc_session` HTTP-only cookie automatically.

| Method | Endpoint | Purpose | Body |
|---|---|---|---|
| `POST` | `/api/auth/logout` | Delete the active database session and cookie | None |
| `GET` | `/api/auth/me` | Return the signed-in user and profile | None |
| `GET` | `/api/profile` | Return the member profile | None |
| `PUT` | `/api/profile` | Update name, role, track, and goal | JSON: `{ "name", "role", "track", "goal" }` |
| `GET` | `/api/progress` | Return persistent dashboard learning progress | None |
| `PATCH` | `/api/progress` | Complete the next learning module | JSON: `{ "action": "complete_module" }` |
| `GET` | `/api/ai/chat` | Return the latest 20 Vector AI messages | None |
| `POST` | `/api/ai/chat` | Ask Vector and persist the answer | JSON: `{ "message": "..." }` |

## Security behavior

- Passwords are hashed with bcrypt cost 12 and never stored in plain text.
- Session cookies are HTTP-only, same-site, secure in production, and expire after 30 days.
- Only SHA-256 hashes of session tokens are stored in MySQL.
- Protected endpoints resolve identity on the server.
- Login attempts are throttled after 10 failures in a 15-minute window.
- AI access requires login, is limited to 30 prompts per member per day, and keeps the Groq key server-only.
- SQL values use prepared statements.

## Database tables

- `users`: account identity and password hash
- `profiles`: role, track, experience, and learning goal
- `sessions`: revocable login sessions
- `ai_messages`: member-specific Vector conversation history
- `auth_attempts`: login security and throttling records
- `learning_progress`: persistent modules, streak, focus time, and shipped-project counts

## Production checklist

- Use HTTPS on the final domain.
- Confirm `https://flightcoders.com/robots.txt` and `/sitemap.xml` load.
- Replace all sample environment values.
- Import the schema before accepting registrations.
- Confirm `/api/health` is healthy.
- Register a test account, log out, and log back in.
- Add the Groq key and test Vector from the protected dashboard.
- Configure Hostinger backups for the MySQL database.
