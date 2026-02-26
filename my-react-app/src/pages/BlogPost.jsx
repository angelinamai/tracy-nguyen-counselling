import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts } from "../data/posts";
import "./BlogPost.css";
import { useSiteLang } from "../content/useSiteLang";

export default function BlogPost() {
  const { slug } = useParams();
  const { text } = useSiteLang();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <div style={{ padding: 40 }}>{text.common.notFound}</div>;

  return (
    <div className="blogPage">
      {/* ✅ TOPBAR like other pages */}
      <header className="pageTopbar">
        <div className="pageTopbarInner">
          <Link to="/blog" className="backLink">
            ← {text.blogPostPage.back}
          </Link>
          <div className="brand">{text.brand}</div>
          <div className="spacer" />
        </div>
      </header>

      <div className="blogWrap">
        <div className="blogContent">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
