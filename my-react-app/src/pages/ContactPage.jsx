import "./ContactPage.css";
import { Link } from "react-router-dom";
import { useSiteLang } from "../content/useSiteLang";

export default function ContactPage() {
  const { text } = useSiteLang();
  const contact = text.contactPage;

  return (
    <div className="contactPageWrap">
      <header className="contactTopbar">
        <div className="contactTopbarInner">
          <Link to="/" className="tncBackLink">
            ← {text.common.back}
          </Link>

          <div className="contactBrand">{text.brand}</div>
          <div style={{ width: 64 }} />
        </div>
      </header>

      <main className="contactMain">
        <h1 className="contactTitle">{contact.title}</h1>

        <p className="contactIntro">
          {contact.introStart}{" "}
          <a href="mailto:tracyincounselling@gmail.com">
            tracyincounselling@gmail.com
          </a>{" "}
          {contact.introMiddle} <a href="tel:+14168306425">(416) 830-6425</a>{" "}
          {contact.introEnd}
        </p>

        <form className="contactForm">
          <label>
            {contact.nameLabel} <span>{text.common.required}</span>
          </label>
          <input type="text" required />

          <label>
            {contact.emailLabel} <span>{text.common.required}</span>
          </label>
          <input type="email" required />

          <label>{contact.phoneLabel}</label>
          <input type="tel" />

          <label>
            {contact.messageLabel} <span>{text.common.required}</span>
          </label>
          <textarea rows="8" required />

          <button type="submit" className="contactSubmit">
            {contact.submit}
          </button>
        </form>
      </main>
    </div>
  );
}
