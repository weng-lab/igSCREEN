import type { MetadataRoute } from "next";
import { SITE_URL } from "./sitemap";

/**
 * Crawler policy: deny by default, allowing only the static pages in the top nav
 * (see common/components/HomeAppBar.tsx). Everything else is the per-element pages under
 * /gene, /icre and /variant (plus their tabs) and the /api/graphql calls they make while
 * rendering -- an effectively unbounded URL space that crawlers will otherwise walk indefinitely.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        // The $ anchors are load-bearing -- a bare "/" would re-open the entire site, and a bare
        // "/gene" would re-open every /gene/<id> page beneath it.
        "/$",
        "/about$",
        "/gene$",
        "/icre$",
        "/variant$",
        "/lineage$",
        "/phenotype$",
        // Assets required to render the pages allowed above. Without these Googlebot fetches the
        // pages, fails to load their images and stylesheets, and scores them as broken. The
        // extension wildcards cover the images in public/ outside /assets (/helix.png,
        // /cells/*.png, ...) and the /icon.svg?icon.<hash>.svg link Next emits for app/icon.svg.
        "/_next/static/",
        "/assets/",
        "/*.svg$",
        "/*.png$",
      ],
      disallow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
