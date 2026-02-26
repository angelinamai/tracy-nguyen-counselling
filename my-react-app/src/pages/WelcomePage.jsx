import "./WelcomePage.css";
import tracyPhoto from "../assets/Tracy-Nguyen.webp";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";

export default function WelcomePage() {
  const { text } = useSiteLang();
  const welcome = text.welcomePage;

  return (
    <div className="welcomePage">
      <SiteHeader />

      <main className="welcomeContainer">
        <h1 className="welcomeTitle">{welcome.title}</h1>
        <p className="welcomeLead">{welcome.lead}</p>

        <section className="welcomeHero">
          <div className="welcomePhotoWrap">
            <img className="welcomePhoto" src={tracyPhoto} alt={welcome.photoAlt} />
          </div>

          <div className="welcomeText">
            {welcome.paragraphs.slice(0, 1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div className="guaranteeBox">
              <div className="guaranteeIcon">✓</div>
              <div className="guaranteeText">
                <h3>{welcome.guaranteeTitle}</h3>
                <p>{welcome.guaranteeText}</p>
              </div>
            </div>
            <div className="trustRow">
              {welcome.trustItems.map((item) => (
                <div className="trustItem" key={item}>
                  <span className="trustDot" />
                  {item}
                </div>
              ))}
            </div>

            {welcome.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
