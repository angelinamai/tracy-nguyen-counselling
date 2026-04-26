import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CourseCard from "../components/CourseCard";
import { COURSE_SLUG } from "../config/courseConfig";
import { getCourseBySlug } from "../data/courseCatalog";
import { useSEO } from "../seo/useSEO";
import "./CoursesPage.css";

export default function CourseDetailsPage() {
  const { slug = "" } = useParams();
  const course = getCourseBySlug(slug);

  useSEO({
    title: `${course?.title || "Course"} | Tracy Nguyen Counseling`,
    description:
      course?.shortDescription ||
      "Course details from Tracy Nguyen Counseling.",
    canonicalPath: `/courses/${slug}`,
    locale: "en_CA",
  });

  if (!course) {
    return (
      <div className="courseShell">
        <SiteHeader />
        <main className="courseMain courseLibraryMain">
          <section className="courseCard courseCardNarrow">
            <h1 className="pageH1 courseTitle">Course Not Found</h1>
            <p className="courseLead">
              This course is not available right now.
            </p>
            <div className="courseActionRow">
              <Link to="/courses" className="courseSecondaryBtn">
                Back to Course Library
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const primaryAction =
    course.slug === COURSE_SLUG && course.purchasable
      ? {
          type: "link",
          to: "/courses",
          label: "Get Instant Access",
          className: "coursePrimaryBtn coursePrimaryBtnStrong",
        }
      : {
          type: "link",
          to: "/contact",
          label: "Contact Tracy",
          className: "coursePrimaryBtn",
        };

  return (
    <div className="courseShell">
      <SiteHeader />
      <main className="courseMain courseLibraryMain">
        <section className="courseSection">
          <header className="courseSectionHead">
            <p className="courseSectionLabel">Course Details</p>
          </header>

          <CourseCard
            course={course}
            featured={course.slug === COURSE_SLUG}
            primaryAction={primaryAction}
            secondaryAction={{
              type: "link",
              to: "/courses",
              label: "Back to Course Library",
              className: "courseSecondaryBtn",
            }}
          />

          <p className="courseFootnote courseDetailNote">
            Detailed lesson breakdown sections can be added here next while keeping this page at <code>/courses/:slug</code>.
          </p>
        </section>
      </main>
    </div>
  );
}
