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
import generatedBeingAsianImage from "../assets/blog/generated-being-asian.jpg";
import generatedGirlFamilyImage from "../assets/blog/generated-girl-family.jpg";
import generatedMoneyFamilyImage from "../assets/blog/generated-money-family.jpg";
import generatedMovingCountryImage from "../assets/blog/generated-moving-country.jpg";
import generatedPreventionImage from "../assets/blog/generated-prevention.jpg";
import generatedStudentsImage from "../assets/blog/generated-students.jpg";

const BLOG_STORY_IMAGES = {
  "being-asian": {
    src: generatedBeingAsianImage,
    alt: "A reflective Asian adult sitting near a softly lit window",
    caption: "Identity can hold love, history, belonging, and complexity at the same time.",
  },
  "how-is-it-like-being-a-girl": {
    src: generatedGirlFamilyImage,
    alt: "A grounded young woman speaking in a calm counseling space",
    caption: "Finding your voice is not loud. It's clear, grounded, and unapologetic.",
  },
  "its-all-about-prevention": {
    src: generatedPreventionImage,
    alt: "A calm journaling scene with tea and soft morning light",
    caption: "Prevention begins with noticing stress before it becomes too heavy to carry.",
  },
  "struggles-moving-country": {
    src: generatedMovingCountryImage,
    alt: "A person sitting beside an unpacked suitcase in a new apartment",
    caption: "Starting over can be hopeful and overwhelming at the same time.",
  },
  "unspoken-burdens-students": {
    src: generatedStudentsImage,
    alt: "An international student studying quietly at a desk in the evening",
    caption: "Some burdens are carried quietly, even when everything looks fine from outside.",
  },
  "why-is-it-always-about-the-money": {
    src: generatedMoneyFamilyImage,
    alt: "A young adult sitting thoughtfully at a family dining table",
    caption: "Money conversations often carry deeper stories about safety, sacrifice, and love.",
  },
};

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
  const storyImage = BLOG_STORY_IMAGES[slug];
  let introBody = localized?.body || "";
  let remainingBody = "";

  if (storyImage && localized?.body) {
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

          {storyImage ? (
            <BlogImage
              src={storyImage.src}
              alt={storyImage.alt}
              caption={storyImage.caption}
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
