import "./ContactPage.css";
import SiteHeader from "../components/SiteHeader";
import PreliminaryQuestionnaireForm from "../components/PreliminaryQuestionnaireForm";
import { useSiteLang } from "../content/useSiteLang";
import { useSEO } from "../seo/useSEO";

export default function QuestionnairePage({ validationStyleVariant }) {
  const { text, lang } = useSiteLang();
  const contact = text.contactPage;
  const pageTitle =
    lang === "vi"
      ? "Bảng câu hỏi sơ bộ | Tracy Nguyen Counseling"
      : "Preliminary Questionnaire | Tracy Nguyen Counseling";
  const pageDescription =
    lang === "vi"
      ? "Hoàn thành bảng câu hỏi sơ bộ trước buổi hẹn đầu tiên."
      : "Complete the preliminary intake questionnaire before your first appointment.";

  useSEO({
    title: pageTitle,
    description: pageDescription,
    canonicalPath: "/contact/questionnaire",
    locale: lang === "vi" ? "vi_VN" : "en_CA",
  });

  return (
    <div className="contactPageWrap">
      <SiteHeader />

      <main className="contactMain">
        <PreliminaryQuestionnaireForm
          contact={contact}
          validationStyleVariant={validationStyleVariant}
        />
      </main>
    </div>
  );
}
