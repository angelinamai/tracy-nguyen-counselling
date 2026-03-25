import { Link } from "react-router-dom";
import "./ContactPage.css";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";
import { useSEO } from "../seo/useSEO";

export default function ContactPage() {
  const { text, lang } = useSiteLang();
  const contact = text.contactPage;
  const pageTitle =
    lang === "vi"
      ? "Liên hệ | Tracy Nguyen Counseling"
      : "Contact | Tracy Nguyen Counseling";
  const pageDescription =
    lang === "vi"
      ? "Liên hệ Tracy Nguyen và chuyển sang trang bảng câu hỏi sơ bộ trước buổi hẹn đầu tiên."
      : "Contact Tracy Nguyen and continue to the preliminary intake questionnaire before your first appointment.";

  useSEO({
    title: pageTitle,
    description: pageDescription,
    canonicalPath: "/contact",
    locale: lang === "vi" ? "vi_VN" : "en_CA",
  });

  const emphasizedPhrase = "Preliminary Form";
  const phraseStart = contact.beforeAppointment.indexOf(emphasizedPhrase);
  const beforeAppointmentContent =
    phraseStart >= 0 ? (
      <>
        {contact.beforeAppointment.slice(0, phraseStart)}
        <strong>{emphasizedPhrase}</strong>
        {contact.beforeAppointment.slice(phraseStart + emphasizedPhrase.length)}
      </>
    ) : (
      contact.beforeAppointment
    );

  return (
    <div className="contactPageWrap">
      <SiteHeader />

      <main className="contactMain">
        <section className="contactHeroCard">
          <h1 className="contactTitle pageH1">{contact.title}</h1>

          <p className="contactRequirement">{beforeAppointmentContent}</p>

          <div className="contactCtaWrap">
            <Link className="contactFormCta" to="/contact/questionnaire">
              {contact.completeFormCta}
            </Link>
          </div>

          <div className="contactDetails">
            <p className="contactIntro contactIntroSecondary">
              {contact.introPrefix} {contact.introCall}.
            </p>

            <div className="contactLinkList">
              <a href="mailto:tracyincounseling@gmail.com" className="contactDetailLink">
                tracyincounseling@gmail.com
              </a>
              <a href="tel:+14168306425" className="contactDetailLink">
                {"(416)\u00A0830\u00A06425"}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
