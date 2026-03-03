import "./CoursesPage.css";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";

export default function CoursesPage() {
  const { text } = useSiteLang();
  const courses = text.coursesPage;

  return (
    <div className="page">
      <SiteHeader />

      <main className="container coursesMain">
        <section className="card coursesCard">
          <h1 className="coursesTitle">{courses.title}</h1>
          <p className="coursesLead">{courses.lead}</p>
        </section>
      </main>
    </div>
  );
}
