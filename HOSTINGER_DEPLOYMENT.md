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
9. In **hPanel → Websites → Dashboard → Performance → CDN**, press **Purge cache** after every production deployment. This prevents cached HTML from referencing CSS chunks removed by the new build.

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
APP_URL=https://flightcoders.com
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=hello@flightcoders.com
SMTP_PASSWORD=your_hostinger_mailbox_password
SMTP_FROM=FlightCoders <hello@flightcoders.com>
ADMIN_EMAILS=your-admin@flightcoders.com
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

Never commit `.env.local` or paste the Groq key into browser-side code. The implemented AI route reads it only on the server.

`GROQ_MODEL` is optional because the backend has the displayed model as its default. `SMTP_FROM` is optional and falls back to `SMTP_USER`. The database, application URL, and SMTP variables are required for registration and verified login. Separate multiple admin emails in `ADMIN_EMAILS` with commas.

### GitHub sign-in setup

1. In GitHub open **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Set **Homepage URL** to `https://flightcoders.com`.
3. Set **Authorization callback URL** to `https://flightcoders.com/api/auth/github/callback`.
4. Add the generated Client ID and Client Secret to the Hostinger environment variables above.
5. Redeploy or restart the Node.js application after saving them.

FlightCoders requests only `read:user` and `user:email`. It requires a verified GitHub email, does not store the GitHub access token, and creates the same revocable database session as password login.

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
| `POST` | `/api/auth/register` | Create an account and send its verification email | Form data: `name`, `email`, `password`, `confirmPassword`, optional `role`, optional `track`, `terms=on` |
| `POST` | `/api/auth/login` | Verify credentials and create a session | Form data: `email`, `password`, optional `next` |
| `GET` | `/api/auth/github` | Begin GitHub OAuth login | Optional query: `next` |
| `GET` | `/api/auth/github/callback` | Validate GitHub OAuth and create a session | GitHub callback parameters |
| `GET` | `/api/auth/verify-email?token=...` | Verify a new member email | None |
| `POST` | `/api/auth/verify-email` | Resend a verification message | Form data: `email` |
| `GET` | `/api/blogs` | List published SEO articles | None |
| `GET` | `/api/jobs` | List current job openings | None |
| `GET` | `/api/projects` | List featured FlightCoders projects | None |

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
| `GET` | `/api/lab/submissions` | Return the member's latest Flight Lab submissions | None |
| `POST` | `/api/lab/submissions` | Save source, runtime, and validation outcome | JSON: `{ "challengeSlug", "language", "code", "passed", "testsPassed", "totalTests", "runtimeMs" }` |

### Admin publishing

These endpoints require a logged-in account whose email appears in `ADMIN_EMAILS`.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/blogs` | Publish a blog article |
| `PATCH`, `DELETE` | `/api/blogs/:id` | Update or delete an article |
| `POST` | `/api/jobs` | Publish a job opening |
| `PATCH`, `DELETE` | `/api/jobs/:id` | Update or delete a job opening |
| `POST` | `/api/projects` | Publish a project case study |
| `PATCH`, `DELETE` | `/api/projects/:id` | Update or delete a project |

## Security behavior

- Passwords are hashed with bcrypt cost 12 and never stored in plain text.
- Session cookies are HTTP-only, same-site, secure in production, and expire after 30 days.
- Only SHA-256 hashes of session tokens are stored in MySQL.
- Protected endpoints resolve identity on the server.
- Login attempts are throttled after 10 failures in a 15-minute window.
- New accounts cannot log in until their signed, single-use email link is verified.
- AI access requires login, is limited to 30 prompts per member per day, and keeps the Groq key server-only.
- SQL values use prepared statements.
- Flight Lab programs execute in a disposable browser worker with a two-second limit; untrusted learner code never executes on the application server.

## Database tables

- `users`: account identity and password hash
- `profiles`: role, track, experience, and learning goal
- `sessions`: revocable login sessions
- `ai_messages`: member-specific Vector conversation history
- `auth_attempts`: login security and throttling records
- `learning_progress`: persistent modules, streak, focus time, and shipped-project counts
- `code_submissions`: Flight Lab source code, validation totals, runtime, and completion history
- `email_verification_tokens`: hashed, single-use, 24-hour verification tokens
- `social_accounts`: GitHub identity links without stored OAuth access tokens
- `blog_posts`: dynamic ranking content and article metadata
- `jobs`: dynamic openings and application links
- `projects`: dynamic project portfolio and detailed case studies

## Production checklist

- Use HTTPS on the final domain.
- Purge Hostinger CDN cache immediately after deploying a new Next.js build.
- Open the stylesheet URL from the deployed page source and confirm it returns HTTP `200`, not `404`.
- Confirm `https://flightcoders.com/robots.txt` and `/sitemap.xml` load.
- Replace all sample environment values.
- Import the schema before accepting registrations.
- Confirm `/api/health` is healthy.
- Create a Hostinger mailbox, add the SMTP variables, register a test account, verify the email, then log in.
- Add the Groq key and test Vector from the protected dashboard.
- Configure Hostinger backups for the MySQL database.

## Member experience included

- Global command navigation with `Ctrl/Command + K`.
- Flight Operations Lab with isolated JavaScript, Python, C++, and Java execution through Judge0.
- Add `JUDGE0_API_URL`; when using RapidAPI, also add `JUDGE0_API_KEY` and `JUDGE0_API_HOST`.
- Compiler errors, standard input/output, runtime and memory telemetry, and persistent submission history.
- Per-mission drafts saved on the member's own device; `Ctrl/Command + S` saves and `Ctrl/Command + Enter` runs validation.
- Advanced aircraft-system missions, searchable mission bank, dashboard launchpad, AI mentor, profiles, progress, projects, jobs, and technical publishing.
