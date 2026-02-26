import "./ResourcesPage.css";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";

function ResourceCard({ item }) {
  return (
    <a
      className="resourceCard resourceLinkCard"
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="resourceMetaRow">
        <span className="resourceMeta">{item.type}</span>
        <span className="resourceArrow" aria-hidden="true">
          ↗
        </span>
      </div>

      <h3 className="resourceCardTitle">
        {item.title}
        {item.author ? (
          <span className="resourceAuthor"> — {item.author}</span>
        ) : null}
      </h3>

      {item.desc ? <p className="resourceCardDesc">{item.desc}</p> : null}
    </a>
  );
}

export default function ResourcesPage() {
  const { text } = useSiteLang();
  const resources = text.resourcesPage;

  return (
    <div className="resourcesPageWrap">
      <SiteHeader />

      <main className="resourcesMain">
        <h1 className="resourcesTitle">{resources.title}</h1>
        <p className="resourcesLead">{resources.lead}</p>

        <section className="resourceSection">
          <h2>{resources.videosTitle}</h2>
          <p className="sectionIntro">{resources.videosIntro}</p>

          <div className="resourceGrid">
            {resources.videos.map((video) => (
              <ResourceCard key={video.href} item={video} />
            ))}
          </div>
        </section>

        <section className="resourceSection">
          <h2>{resources.booksTitle}</h2>
          <p className="sectionIntro">{resources.booksIntro}</p>

          <div className="resourceGrid">
            {resources.books.map((book) => (
              <ResourceCard key={book.href} item={book} />
            ))}
          </div>
        </section>

        <section className="resourceSection">
          <h2>{resources.organizationsTitle}</h2>
          <p className="sectionIntro">{resources.organizationsIntro}</p>

          <div className="resourceGrid">
            {resources.organizations.map((org) => (
              <ResourceCard key={org.href} item={org} />
            ))}
          </div>
        </section>

        <div className="resourcesCTA">
          <p className="resourcesCTAText">{resources.ctaText}</p>

          <p className="resourcesCTASub">{resources.ctaSub}</p>

          <Link to="/contact" className="resourcesCTAButton">
            {resources.ctaButton}
          </Link>
        </div>
      </main>
    </div>
  );
}
