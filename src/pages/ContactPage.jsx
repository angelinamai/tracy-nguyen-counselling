import "./ContactPage.css";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";

export default function ContactPage() {
  const { text } = useSiteLang();
  const contact = text.contactPage;

  return (
    <div className="contactPageWrap">
      <SiteHeader />

      <main className="contactMain">
        <h1 className="contactTitle">{contact.title}</h1>

        <p className="contactIntro">
          {contact.introStart}{" "}
          <a href="mailto:tracyincounselling@gmail.com">
            tracyincounselling@gmail.com
          </a>{" "}
          <span className="contactCallLine">
            {contact.introMiddle}{" "}
            <a href="tel:+14168306425" className="contactPhoneLink">
              {"(416)\u00A0830\u00A06425"}
            </a>
          </span>{" "}
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
