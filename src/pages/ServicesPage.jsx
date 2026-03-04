import { useState } from "react";
import "./ServicesPage.css";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";

export default function ServicesPage() {
  const [active, setActive] = useState("counseling");
  const { text } = useSiteLang();
  const services = text.servicesPage;

  return (
    <div className="servicesPage">
      <SiteHeader />

      <main className="servicesContainer">
        <section className="servicesHero">
          <h1 className="servicesTitle">{services.title}</h1>
          <p className="servicesIntro">{services.intro}</p>
          <p className="servicesMeta">{services.meta}</p>

          <div className="servicesChips">
            {services.chips.map((chip) => (
              <span className="chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </section>

        <section className="servicesSplit">
          {/* Left: tabs */}
          <aside className="servicesNav">
            <button
              className={`servicesTab ${active === "counseling" ? "active" : ""}`}
              onClick={() => setActive("counseling")}
              type="button"
            >
              <div className="tabTitle">{services.counselingTabTitle}</div>
              <div className="tabSub">{services.counselingTabSub}</div>
            </button>

            <button
              className={`servicesTab ${active === "coaching" ? "active" : ""}`}
              onClick={() => setActive("coaching")}
              type="button"
            >
              <div className="tabTitle">{services.coachingTabTitle}</div>
              <div className="tabSub">{services.coachingTabSub}</div>
            </button>
          </aside>

          {/* Right: content */}
          <div className="servicesPanel">
            {active === "counseling" ? (
              <>
                <h2 className="panelTitle">{services.counselingPanelTitle}</h2>
                <p className="panelLead">{services.counselingLead}</p>

                <h3 className="servicesSectionTitle">
                  {services.counselingSection1Title}
                </h3>
                <ul className="servicesGridList">
                  {services.counselingSection1Items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="servicesMiniDivider" />

                <h3 className="servicesSectionTitle">
                  {services.counselingSection2Title}
                </h3>
                <ul className="servicesGridList">
                  {services.counselingSection2Items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h2 className="panelTitle">{services.coachingPanelTitle}</h2>
                <p className="panelLead">{services.coachingLead}</p>

                <h3 className="servicesSectionTitle">
                  {services.coachingSection1Title}
                </h3>
                <ul className="servicesGridList">
                  {services.coachingSection1Items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="servicesMiniDivider" />

                <h3 className="servicesSectionTitle">
                  {services.coachingSection2Title}
                </h3>
                <ul className="servicesGridList servicesOneCol">
                  {services.coachingSection2Items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
