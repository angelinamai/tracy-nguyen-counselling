import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts } from "../data/posts";
import "./BlogPost.css";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";

export default function BlogPost() {
  const { slug } = useParams();
  const { text } = useSiteLang();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <div style={{ padding: 40 }}>{text.common.notFound}</div>;

  return (
    <div className="blogPage">
      <SiteHeader />

      <div className="blogWrap">
        <div className="blogContent">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
