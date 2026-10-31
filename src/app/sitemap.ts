import type { MetadataRoute } from "next";

const PRODUCTION_URL = "https://igscreen.wenglab.org";

/**
 * Canonical origin for this deployment. Sitemap entries must be on the same host as the sitemap
 * serving them -- Google discards cross-host URLs -- so this has to track where the app is served.
 *
 * Production deliberately keeps the hardcoded domain rather than reading VERCEL_URL: on Vercel that
 * variable is the generated deployment hostname, not the custom domain, even for production
 * deploys. Preview deployments use their own origin; Vercel serves previews with
 * X-Robots-Tag: noindex, so these origins never reach a search index.
 *
 * Read at build time: robots.txt and sitemap.xml are statically generated, so each deployment
 * bakes in its own origin.
 */
export const SITE_URL =
  process.env.VERCEL_ENV !== "production" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : PRODUCTION_URL;

/**
 * The pages crawlers are allowed to index, mirroring the allowlist in robots.ts. Keep the two in
 * sync: a sitemap entry that robots.ts blocks is a contradictory signal, and Search Console reports
 * it as an error.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/gene", "/icre", "/variant", "/lineage", "/phenotype"].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
