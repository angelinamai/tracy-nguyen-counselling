import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";
import { useSEO } from "../seo/useSEO";
import "./FormSuccessPage.css";

const variantPathMap = {
  v4: "/form-success-v4",
};

function SuccessCtas({ cta }) {
  return (
    <div className="formSuccessActions">
      <Link to="/" className="formSuccessBtn formSuccessBtn--primary">
        {cta.home}
      </Link>
      <Link to="/contact" className="formSuccessBtn formSuccessBtn--ghost">
        {cta.contact}
      </Link>
    </div>
  );
}

function VariantFour({ content }) {
  return (
    <section className="formSuccessPanel formSuccessPanel--v4">
      <div className="formSuccessSplit">
        <div className="formSuccessEditorialMain">
          <span className="formSuccessBadge">{content.confirmationLabel}</span>
          <h1 className="formSuccessHeading">{content.heading}</h1>
          <p className="formSuccessLead">{content.subtext}</p>
          <SuccessCtas cta={content.cta} />
        </div>
        <aside className="formSuccessEditorialAside" aria-label={content.nextStepsTitle}>
          <h2>{content.nextStepsTitle}</h2>
          <ol>
            {content.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>{content.note}</p>
        </aside>
      </div>
    </section>
  );
}
export default function FormSuccessPage({ variant = "v4" }) {
  const { text, lang } = useSiteLang();
  const successContent = text.contactPage.questionnaire.successPage;
  const activeVariant = variantPathMap[variant] ? variant : "v4";

  useSEO({
    title: `${successContent.heading} | Tracy Nguyen Counseling`,
    description: successContent.subtext,
    canonicalPath: variantPathMap[activeVariant],
    locale: lang === "vi" ? "vi_VN" : "en_CA",
    noindex: true,
  });

  return (
    <div className={`contactPageWrap formSuccessWrap formSuccessWrap--${activeVariant}`}>
      <SiteHeader />

      <main className="contactMain formSuccessMain">
        <VariantFour content={successContent} />
      </main>
    </div>
  );
}
