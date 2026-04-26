import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts } from "../data/posts";
import "./BlogPost.css";
import SiteHeader from "../components/SiteHeader";
import BlogImage from "../components/BlogImage";
import { useSiteLang } from "../content/useSiteLang";
import { useSEO } from "../seo/useSEO";
import { SEO_SITE_NAME } from "../seo/constants";
import girlTherapySessionImage from "../assets/blog/girl-therapy-session.jpg";

const EMPOWERED_IMAGE_POST_SLUG = "how-is-it-like-being-a-girl";
const EMPOWERED_IMAGE_ALT =
  "A confident woman speaking during a therapy session";
const EMPOWERED_IMAGE_CAPTION =
  "Finding your voice is not loud. It's clear, grounded, and unapologetic.";

function splitAtFirstParagraph(markdown = "") {
  const normalized = markdown.trim();
  const separatorMatch = normalized.match(/\n\s*\n/);

  if (!separatorMatch) {
    return { intro: normalized, rest: "" };
  }

  const splitIndex = separatorMatch.index ?? normalized.length;

  return {
    intro: normalized.slice(0, splitIndex).trim(),
    rest: normalized.slice(splitIndex).trim(),
  };
}

export default function BlogPost() {
  const { slug } = useParams();
  const { text, lang } = useSiteLang();
  const post = posts.find((p) => p.slug === slug);
  const localized = post ? post[lang] || post.en : null;
  const showEmpoweredImage = slug === EMPOWERED_IMAGE_POST_SLUG;
  let introBody = localized?.body || "";
  let remainingBody = "";

  if (showEmpoweredImage && localized?.body) {
    const { intro, rest } = splitAtFirstParagraph(localized.body);
    introBody = intro || localized.body;
    remainingBody = rest;
  }

  useSEO(
    post
      ? {
          title: `${localized.title} | ${SEO_SITE_NAME}`,
          description: localized.excerpt,
          canonicalPath: `/blog/${post.slug}`,
          locale: lang === "vi" ? "vi_VN" : "en_CA",
          type: "article",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: localized.title,
            datePublished: localized.date,
            author: {
              "@type": "Person",
              name: localized.author || "Tracy Nguyen",
            },
          },
        }
      : {
          title: `Blog Post Not Found | ${SEO_SITE_NAME}`,
          description: "The requested blog article could not be found.",
          canonicalPath: `/blog/${slug || ""}`,
          locale: lang === "vi" ? "vi_VN" : "en_CA",
          noindex: true,
        },
  );

  if (!post) return <div style={{ padding: 40 }}>{text.common.notFound}</div>;

  return (
    <div className="blogPage">
      <SiteHeader />

      <div className="blogWrap">
        <div className="blogContent">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{introBody}</ReactMarkdown>

          {showEmpoweredImage ? (
            <BlogImage
              src={girlTherapySessionImage}
              alt={EMPOWERED_IMAGE_ALT}
              caption={EMPOWERED_IMAGE_CAPTION}
            />
          ) : null}

          {remainingBody ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{remainingBody}</ReactMarkdown>
          ) : null}
        </div>
      </div>
    </div>
  );
}
