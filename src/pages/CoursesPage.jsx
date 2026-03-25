import "./CoursesPage.css";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";
import { useSEO } from "../seo/useSEO";

export default function CoursesPage() {
  const { text, lang } = useSiteLang();
  const courses = text.coursesPage;
  const pageTitle = lang === "vi" ? "Khóa học | Tracy Nguyen Counseling" : "Courses | Tracy Nguyen Counseling";
  const pageDescription =
    lang === "vi"
      ? "Thông tin các khóa học thực hành về sức khỏe tinh thần sẽ sớm được cập nhật."
      : "Practical mental wellness courses and updates from Tracy Nguyen Counseling.";

  useSEO({
    title: pageTitle,
    description: pageDescription,
    canonicalPath: "/courses",
    locale: lang === "vi" ? "vi_VN" : "en_CA",
  });

  return (
    <div className="page">
      <SiteHeader />

      <main className="container coursesMain">
        <section className="card coursesCard">
          <h1 className="coursesTitle pageH1">{courses.title}</h1>
          <p className="coursesLead">{courses.lead}</p>
        </section>
      </main>
    </div>
  );
}
