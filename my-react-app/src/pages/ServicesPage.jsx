import { useState } from "react";
import "./ServicesPage.css";
import { Link } from "react-router-dom";
import { useSiteLang } from "../content/useSiteLang";

export default function ServicesPage() {
  const [active, setActive] = useState("counselling");
  const { text } = useSiteLang();
  const services = text.servicesPage;

  return (
    <div className="servicesPage">
      <header className="pageTopbar">
        <div className="pageTopbarInner">
          <Link to="/" className="backLink">
            ← {text.common.back}
          </Link>
          <div className="brand">{text.brand}</div>
          <div className="spacer" />
        </div>
      </header>

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
              className={`servicesTab ${active === "counselling" ? "active" : ""}`}
              onClick={() => setActive("counselling")}
              type="button"
            >
              <div className="tabTitle">{services.counsellingTabTitle}</div>
              <div className="tabSub">{services.counsellingTabSub}</div>
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
            {active === "counselling" ? (
              <>
                <h2 className="panelTitle">{services.counsellingPanelTitle}</h2>
                <p className="panelLead">{services.counsellingLead}</p>

                <h3 className="servicesSectionTitle">
                  {services.counsellingSection1Title}
                </h3>
                <ul className="servicesGridList">
                  {services.counsellingSection1Items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="servicesMiniDivider" />

                <h3 className="servicesSectionTitle">
                  {services.counsellingSection2Title}
                </h3>
                <ul className="servicesGridList">
                  {services.counsellingSection2Items.map((item) => (
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
