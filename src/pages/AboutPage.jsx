import "./AboutPage.css";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";
import { useSEO } from "../seo/useSEO";

export default function AboutPage() {
  const { text, lang } = useSiteLang();
  const aboutPage = text.aboutPage ?? { title: "About Tracy", paragraphs: [] };
  const pageTitle = lang === "vi" ? "Về Tracy | Tracy Nguyen Counseling" : "About Tracy | Tracy Nguyen Counseling";
  const pageDescription =
    lang === "vi"
      ? "Thông tin chuyên môn, kinh nghiệm và cách làm việc của Tracy Nguyen."
      : "Learn about Tracy Nguyen's background, training, and counseling approach.";

  useSEO({
    title: pageTitle,
    description: pageDescription,
    canonicalPath: "/about",
    locale: lang === "vi" ? "vi_VN" : "en_CA",
  });

  return (
    <div className="aboutPage">
      <SiteHeader />

      <main className="container aboutMain">
        <section className="aboutCardFull">
          <h1 className="aboutPageTitle pageH1">{aboutPage.title}</h1>
          {aboutPage.paragraphs.map((paragraph, index) => (
            <p className="aboutPageParagraph" key={index}>
              {paragraph}
            </p>
          ))}
        </section>
      </main>
    </div>
  );
}
