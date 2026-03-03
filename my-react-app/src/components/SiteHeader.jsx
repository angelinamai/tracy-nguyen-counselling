import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSiteLang } from "../content/useSiteLang";

export default function SiteHeader() {
  const { text, toggleLang } = useSiteLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLangToggle = () => {
    toggleLang();
    closeMenu();
  };

  const navClass = ({ isActive }) => (isActive ? "activeNav" : undefined);

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          {text.brand}
        </Link>

        <button
          type="button"
          className="menuBtn"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {text.common.menu}
        </button>

        <nav id="site-nav" className={`nav ${menuOpen ? "isOpen" : ""}`}>
          <NavLink to="/" end className={navClass} onClick={closeMenu}>
            {text.common.home}
          </NavLink>
          <NavLink to="/welcome" className={navClass} onClick={closeMenu}>
            {text.nav[0]}
          </NavLink>
          <NavLink to="/about" className={navClass} onClick={closeMenu}>
            {text.nav[1]}
          </NavLink>
          <NavLink to="/services" className={navClass} onClick={closeMenu}>
            {text.nav[2]}
          </NavLink>
          <NavLink to="/contact" className={navClass} onClick={closeMenu}>
            {text.nav[3]}
          </NavLink>
          <NavLink to="/courses" className={navClass} onClick={closeMenu}>
            {text.nav[4]}
          </NavLink>
          <NavLink to="/faqs" className={navClass} onClick={closeMenu}>
            {text.nav[5]}
          </NavLink>
          <NavLink to="/resources" className={navClass} onClick={closeMenu}>
            {text.nav[6]}
          </NavLink>
          <NavLink to="/blog" className={navClass} onClick={closeMenu}>
            {text.nav[7]}
          </NavLink>

          <button type="button" className="langBtn" onClick={handleLangToggle}>
            {text.langToggle}
          </button>
        </nav>
      </div>
    </header>
  );
}
