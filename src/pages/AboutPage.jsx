import "./AboutPage.css";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";

export default function AboutPage() {
  const { text } = useSiteLang();
  const aboutPage = text.aboutPage ?? { title: "About Tracy", paragraphs: [] };

  return (
    <div className="page">
      <SiteHeader />

      <main className="container aboutMain">
        <section className="card aboutCardFull">
          <h1 className="aboutPageTitle">{aboutPage.title}</h1>
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
