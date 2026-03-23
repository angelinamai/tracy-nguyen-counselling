import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SEO_DEFAULT_DESCRIPTION, SEO_SITE_NAME } from "./constants";

function upsertMetaByName(name, content) {
  if (!content) return;
  let node = document.head.querySelector(`meta[name="${name}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute("name", name);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function upsertMetaByProperty(property, content) {
  if (!content) return;
  let node = document.head.querySelector(`meta[property="${property}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute("property", property);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function upsertCanonical(href) {
  if (!href) return;
  let node = document.head.querySelector("link[rel='canonical']");
  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", "canonical");
    document.head.appendChild(node);
  }
  node.setAttribute("href", href);
}

function upsertJsonLd(jsonLd) {
  const scriptId = "seo-jsonld";
  const existing = document.getElementById(scriptId);

  if (!jsonLd) {
    if (existing) existing.remove();
    return;
  }

  const script = existing || document.createElement("script");
  script.id = scriptId;
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify(jsonLd);

  if (!existing) {
    document.head.appendChild(script);
  }
}

function normalizeUrl(pathnameOrUrl, origin) {
  if (!pathnameOrUrl) return `${origin}/`;
  if (/^https?:\/\//i.test(pathnameOrUrl)) return pathnameOrUrl;
  return new URL(pathnameOrUrl, origin).toString();
}

export function useSEO({
  title,
  description,
  canonicalPath,
  image,
  type = "website",
  noindex = false,
  locale = "en_CA",
  jsonLd,
}) {
  const location = useLocation();

  useEffect(() => {
    const origin = window.location.origin;
    const fallbackCanonical = `${location.pathname}${location.search}`;
    const canonicalUrl = normalizeUrl(canonicalPath || fallbackCanonical, origin);

    const finalTitle = title || SEO_SITE_NAME;
    const finalDescription = description || SEO_DEFAULT_DESCRIPTION;

    document.title = finalTitle;

    upsertCanonical(canonicalUrl);
    upsertMetaByName("description", finalDescription);
    upsertMetaByName("robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertMetaByName("twitter:card", image ? "summary_large_image" : "summary");
    upsertMetaByName("twitter:title", finalTitle);
    upsertMetaByName("twitter:description", finalDescription);

    upsertMetaByProperty("og:type", type);
    upsertMetaByProperty("og:site_name", SEO_SITE_NAME);
    upsertMetaByProperty("og:title", finalTitle);
    upsertMetaByProperty("og:description", finalDescription);
    upsertMetaByProperty("og:url", canonicalUrl);
    upsertMetaByProperty("og:locale", locale);

    if (image) {
      const imageUrl = normalizeUrl(image, origin);
      upsertMetaByProperty("og:image", imageUrl);
      upsertMetaByName("twitter:image", imageUrl);
    }

    upsertJsonLd(jsonLd);
  }, [
    canonicalPath,
    description,
    image,
    jsonLd,
    locale,
    location.pathname,
    location.search,
    noindex,
    title,
    type,
  ]);
}
