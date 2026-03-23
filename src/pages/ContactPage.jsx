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

  return (
    <div className="contactPageWrap">
      <SiteHeader />

      <main className="contactMain">
        <h1 className="contactTitle">{contact.title}</h1>

        <p className="contactIntro">
          {contact.introPrefix}{" "}
          <a href="mailto:tracyincounseling@gmail.com">tracyincounseling@gmail.com</a>{" "}
          <span className="contactCallLine">
            {contact.introCall}{" "}
            <a href="tel:+14168306425" className="contactPhoneLink">
              {"(416)\u00A0830\u00A06425"}
            </a>
          </span>
          .
        </p>

        <p className="contactRequirement">{contact.beforeAppointment}</p>

        <div className="contactCtaWrap">
          <Link className="contactFormCta" to="/contact/questionnaire">
            {contact.completeFormCta}
          </Link>
        </div>
      </main>
    </div>
  );
}
