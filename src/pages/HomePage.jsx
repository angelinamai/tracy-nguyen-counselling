import "../App.css";
import tracyPhoto from "../assets/Tracy-Nguyen.webp";
import office1 from "../assets/office-1.jpg";
import office2 from "../assets/office-2.jpg";
import EmailButton from "../components/EmailButton";
import ShareMenu from "../components/ShareMenu";
import SiteHeader from "../components/SiteHeader";
import { Link } from "react-router-dom";
import { useSiteLang } from "../content/useSiteLang";
import { useSEO } from "../seo/useSEO";
import { SEO_SITE_NAME } from "../seo/constants";

export default function HomePage() {
  const { text, lang } = useSiteLang();
  const locationMapUrl =
    "https://www.google.com/maps/search/?api=1&query=36+Hiscott+Street%2C+St.+Catharines%2C+ON";
  const [feesPrimary, ...feesRestParts] = text.feesDesc.split("·");
  const feesSecondary = feesRestParts.join("·").trim();
  const pageTitle =
    lang === "vi"
      ? "Tư vấn với Tracy Nguyen | Nhân viên Công tác Xã hội"
      : "Tracy Nguyen Counseling | Registered Social Worker";
  const pageDescription =
    lang === "vi"
      ? "Tư vấn trực tiếp và trực tuyến tại St. Catharines cho lo âu, sang chấn, mối quan hệ và chuyển giai đoạn cuộc sống."
      : "In-person and virtual counseling in St. Catharines for anxiety, trauma, relationships, and life transitions.";

  useSEO({
    title: pageTitle,
    description: pageDescription,
    canonicalPath: "/",
    locale: lang === "vi" ? "vi_VN" : "en_CA",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: SEO_SITE_NAME,
      telephone: "+1-416-830-6425",
      email: "tracyincounseling@gmail.com",
      areaServed: "Ontario, Canada",
      address: {
        "@type": "PostalAddress",
        streetAddress: "36 Hiscott Street",
        addressLocality: "St. Catharines",
        addressRegion: "ON",
        addressCountry: "CA",
      },
    },
  });

  return (
    <div className="page">
      <SiteHeader />

      <main className="container layout">
        {/* LEFT */}
        <section className="mainCol">
          <div className="card profileHeader">
            <img className="avatar" src={tracyPhoto} alt={text.profileAlt} />

            <div className="profileTitle">
              <h1 className="name">Tracy Nguyen</h1>
              <div className="subtitle">{text.titleLine}</div>

              <div className="badges">
                <span className="badge badge--verified">
                  {text.badgeAccepting}
                </span>
                <span className="badge">{text.badgeMode}</span>
              </div>
            </div>
          </div>

          <div className="card" id="about">
            <h2 className="sectionTitle">{text.aboutTitle}</h2>
            <p className="bodyText">{text.aboutText}</p>
          </div>

          <div className="card">
            <h2 className="sectionTitle">{text.officePhotos}</h2>
            <div className="gallery">
              <img src={office1} alt={text.officeAlt1} />
              <img src={office2} alt={text.officeAlt2} />
            </div>
          </div>

          <div className="card" id="specialties">
            <h2 className="sectionTitle">{text.specialties}</h2>

            <div className="chips">
              {text.chips.map((chip, i) => (
                <span key={i} className="chip">
                  {chip}
                </span>
              ))}
            </div>

            <div className="divider" />

            <h3 className="miniTitle">{text.whoIWorkWith}</h3>
            <ul className="list">
              {text.people.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="sideCol" id="contact">
          <div className="card contactCard">
            <div className="contactTop">
              <div>
                <div className="label">{text.letsConnect}</div>
                <a href="tel:+14168306425" className="phoneLink">
                  (416) 830-6425
                </a>
              </div>

              <img
                className="avatarSmall"
                src={tracyPhoto}
                alt={text.profileSmallAlt}
              />
            </div>

            <EmailButton />

            <div className="buttonRow">
              <Link className="btnGhost btnLink" to="/contact">
                {text.bookSession}
              </Link>

              <ShareMenu
                instagramProfileUrl="https://www.instagram.com/YOUR_HANDLE/"
                tiktokProfileUrl="https://www.tiktok.com/@YOUR_HANDLE"
              />
            </div>
          </div>

          <div className="card stickyCard">
            <h2 className="sectionTitle">{text.glanceTitle}</h2>

            <div className="glanceItem">
              <span className="icon">💻</span>
              <div>
                <div className="glanceTitle">{text.sessions}</div>
                <div className="glanceText">{text.sessionsDesc}</div>
              </div>
            </div>

            <div className="glanceItem">
              <span className="icon">📍</span>
              <div>
                <div className="glanceTitle">{text.location}</div>
                <a
                  href={locationMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="glanceText glanceAddressLink"
                >
                  {text.locationAddress}
                </a>
              </div>
            </div>

            <div className="quoteBox">
              <div className="quoteMark"></div>
              <div className="quoteText">{text.quote}</div>
            </div>

            <div className="glanceItem">
              <span className="icon">🧠</span>
              <div>
                <div className="glanceTitle">{text.focus}</div>
                <div className="glanceText">{text.focusDesc}</div>
              </div>
            </div>

            <div className="glanceItem">
              <span className="icon">💳</span>
              <div>
                <div className="glanceTitle">{text.fees}</div>
                <div className="glanceText">
                  <span className="feesPrimary">{feesPrimary.trim()}</span>
                  {feesSecondary ? <> · {feesSecondary}</> : null}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          © {new Date().getFullYear()} Tracy Nguyen · {text.footer}
        </div>
      </footer>
    </div>
  );
}
