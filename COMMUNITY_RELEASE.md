# Community workspace release

The dashboard now provides authenticated publishing and a public community feed, with recent-post search and category filters. Posts expose the author's display name and role, never their email. Posting requires a session, a same-origin request, valid text/link input, and a one-minute per-account cooldown serialized using a database transaction.

## Database deployment

Before deploying the app, apply `database/migrations/20261003_community.sql` to the configured MySQL database with your normal migration tooling. This additive migration creates only `community_posts`; existing installations do not need to re-import the full schema. New installations can use `database/schema.sql`.

## Release checks

- Sign in and verify the dashboard opens; signed-out dashboard requests must redirect to login.
- Publish one post of each type and verify it persists after refresh and appears on `/community` in a signed-out browser.
- Verify invalid links and empty posts are rejected; a second post within one minute receives 429.
- Verify the database outage state offers retry and does not display sample people or invented activity.
- Check mobile navigation, keyboard focus, search, filters, and profile/project links.

## Remaining launch work

This is a community foundation, not a fully operated worldwide social platform. Moderation/reporting and author edit/delete controls, account recovery, notifications, threaded replies, and feed pagination beyond the latest 100 posts need follow-up before a broad public launch. Establish moderation ownership and operational monitoring. Runtime database integration and authenticated browser flows require a configured database with this migration applied.
