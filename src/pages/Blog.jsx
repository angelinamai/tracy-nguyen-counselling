import "./Blog.css";
import { Link } from "react-router-dom";
import { posts } from "../data/posts";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";
import { useSEO } from "../seo/useSEO";

const POSTS_PER_PAGE = 4;

export default function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const { text, lang } = useSiteLang();
  const pageTitle = lang === "vi" ? "Bài viết | Tracy Nguyen Counseling" : "Blog | Tracy Nguyen Counseling";
  const pageDescription =
    lang === "vi"
      ? "Bài viết về sức khỏe tinh thần, mối quan hệ, lo âu, sang chấn và trải nghiệm văn hóa."
      : "Articles on mental health, anxiety, trauma, relationships, and cross-cultural lived experience.";

  useSEO({
    title: pageTitle,
    description: pageDescription,
    canonicalPath: "/blog",
    locale: lang === "vi" ? "vi_VN" : "en_CA",
  });

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const selectedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="blogPage">
      <SiteHeader />

      <div className="blogWrap">
        <h1 className="blogTitle">{text.blogPage.title}</h1>

        <div className="blogList">
          {selectedPosts.map((post) => {
            const localized = post[lang] || post.en;

            return (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="blogCard"
              >
                {post.hero && (
                  <img
                    src={post.hero}
                    alt={localized.title}
                    className="blogCardImage"
                    loading="lazy"
                  />
                )}

                <h2 className="blogCardTitle">{localized.title}</h2>
                <p className="blogCardMeta">
                  {localized.author} · {localized.date}
                </p>
                <p className="blogCardExcerpt">{localized.excerpt}</p>
                <span className="blogCardCta">{text.blogPage.readMore}</span>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`pageBtn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          {currentPage < totalPages && (
            <button
              className="pageBtn next"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {text.blogPage.next}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
