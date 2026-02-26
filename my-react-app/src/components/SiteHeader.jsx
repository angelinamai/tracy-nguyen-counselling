import { Link } from "react-router-dom";
import { useSiteLang } from "../content/useSiteLang";

export default function SiteHeader() {
  const { text, toggleLang } = useSiteLang();

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <div className="brand">{text.brand}</div>

        <nav className="nav">
          <Link to="/welcome">{text.nav[0]}</Link>
          <Link to="/services">{text.nav[1]}</Link>
          <Link to="/contact">{text.nav[2]}</Link>
          <Link to="/resources">{text.nav[3]}</Link>
          <Link to="/blog">{text.nav[4]}</Link>
          <Link to="/faqs">{text.nav[5]}</Link>

          <button type="button" className="langBtn" onClick={toggleLang}>
            {text.langToggle}
          </button>
        </nav>
      </div>
    </header>
  );
}
