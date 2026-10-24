# FlightCoders SEO and deployment

The site now leads with custom software development and AI solutions. Four crawlable service pages explain the actual services, project approach, deliverables, and scoping questions. Each has its own title, description, canonical URL, sharing metadata, and service/breadcrumb structured data.

The homepage uses a real product screenshot, visible software-company copy, internal service links, and a project FAQ. Organization structured data includes the public sales email. The 1200 × 630 sharing image is generated at `/opengraph-image`.

Account pages use `noindex` and are omitted from the sitemap. Robots rules allow crawlers to see those noindex tags. Private workspace/API paths remain excluded. The sitemap includes the four service pages and published database content when available.

## After deploying to flightcoders.com

1. Confirm the live site is running the latest Git commit. A GitHub push alone does not confirm that Hostinger has deployed it.
2. Verify the domain in Google Search Console. If using the HTML verification method, set the supplied token as `GOOGLE_SITE_VERIFICATION` in the hosting environment and redeploy. Never commit credentials.
3. Submit `https://flightcoders.com/sitemap.xml` and inspect the homepage and service URLs in Search Console.
4. Review indexing and search queries after Google processes the changes. These changes improve crawlability and clarity; ranking and indexing are not guaranteed.

Google guidance: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

GitHub sign-in appears only when `GITHUB_CLIENT_ID` is configured. The existing OAuth callback also needs its existing secret/settings. Email registration and verification still use the existing database/SMTP setup.
