import { Link, useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { FEATURED_COURSE } from "../data/courseCatalog";
import { useSEO } from "../seo/useSEO";
import { COURSE_TITLE } from "../config/courseConfig";
import "./CoursesPage.css";

export default function CourseLockedPage() {
  const [searchParams] = useSearchParams();
  const lessons = Array.isArray(FEATURED_COURSE.curriculum)
    ? FEATURED_COURSE.curriculum
    : [];
  const lessonIndex = Math.max(0, Number(searchParams.get("lesson") || "1") - 1);
  const lesson = lessons[lessonIndex] || lessons[0];

  useSEO({
    title: `${lesson?.title || COURSE_TITLE} | Locked`,
    description: "This course lesson is locked until purchase is confirmed.",
    canonicalPath: "/courses/locked",
    locale: "en_CA",
    noindex: true,
  });

  return (
    <div className="courseShell">
      <SiteHeader />
      <main className="courseMain courseLockedMain">
        <section className="courseLockedPage">
          <h1 className="courseLockedLessonTitle">
            <span className="courseLockedLessonIcon" aria-hidden="true">▻</span>
            {lesson?.title || COURSE_TITLE}
          </h1>

          <div className="courseLockedPanel">
            <div className="courseLockedBadge" aria-hidden="true">
              🔒
            </div>
            <h2>Lesson content locked</h2>
            <p>
              If you have any issue, please{" "}
              <Link to="/contact">contact Tracy</Link>
              .
            </p>
            <Link to="/courses" className="courseLockedUnlockBtn">
              Purchase Course to Unlock
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
