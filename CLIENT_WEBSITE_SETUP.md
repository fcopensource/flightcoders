# Client services website

## Ready to review

- Homepage leads with custom software development and AI solutions.
- Four actual products support the portfolio; each offers a client inquiry action.
- `/engagements` explains custom quotes, delivery milestones, and engagement types.
- `/hire-us` provides a project brief form; `/api/inquiries` sends plain-text briefs to hire@flightcoders.com using the existing SMTP settings. Reply-To is the visitor's address. It never reports success if delivery fails.
- `/payments` provides an invoice inquiry action, or opens CLIENT_PAYMENT_URL when a valid HTTPS payment link is configured.

## Required before launch

1. Configure SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD and SMTP_FROM in the deployment environment. Confirm that hire@flightcoders.com can receive mail.
2. Submit a real authorized inquiry after configuring mail and confirm receipt. No real emails were sent during local tests.
3. Configure CLIENT_PAYMENT_URL only with your own verified hosted payment/invoice page. The current implementation does not create dynamic checkout sessions, track payments, reconcile invoices, or claim that payments have been verified.
4. Review service agreements and privacy disclosures for inquiry data before launch. Inquiries are sent to the hiring mailbox and are not stored in the application database.
5. The inquiry cooldown is per email and process, not a distributed anti-abuse service. Use a shared rate-limit store and bot protection if needed for a public launch.

## Validation

Production build and targeted ESLint pass. Browser checks cover six public pages at desktop and mobile widths, four portfolio entries, the invoice fallback, invalid input, cross-origin rejection, and missing-SMTP error handling.
