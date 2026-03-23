import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts } from "../data/posts";
import "./BlogPost.css";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";
import { useSEO } from "../seo/useSEO";
import { SEO_SITE_NAME } from "../seo/constants";

export default function BlogPost() {
  const { slug } = useParams();
  const { text, lang } = useSiteLang();
  const post = posts.find((p) => p.slug === slug);
  const localized = post ? post[lang] || post.en : null;

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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {localized.body}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
