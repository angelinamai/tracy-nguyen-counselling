import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CourseCard from "../components/CourseCard";
import { useSiteLang } from "../content/useSiteLang";
import { useSEO } from "../seo/useSEO";
import {
  ADDITIONAL_COURSES,
  FEATURED_COURSE,
  getCourseBySlug,
} from "../data/courseCatalog";
import {
  createCourseCheckoutSession,
} from "../lib/courseApiClient";
import "./CoursesPage.css";

export default function CoursesPage() {
  const { lang } = useSiteLang();
  const [searchParams] = useSearchParams();
  const [checkoutCourseSlug, setCheckoutCourseSlug] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMoreCourses, setShowMoreCourses] = useState(false);
  
  const designParam = searchParams.get("design") || "5";
  const courseDesign = ["1", "2", "3", "4", "5"].includes(designParam)
    ? designParam
    : "1";
  const cancelledCheckout = searchParams.get("checkout") === "cancelled";
  const cancelledCourseSlug = (searchParams.get("course") || "").trim();
  const cancelledCourseTitle = useMemo(() => {
    if (!cancelledCourseSlug) {
      return "this course";
    }
    return getCourseBySlug(cancelledCourseSlug)?.title || "this course";
  }, [cancelledCourseSlug]);

  const pageDescription =
    lang === "vi"
      ? "Thư viện khóa học tinh gọn với khóa học nổi bật và các khóa học thực hành sắp ra mắt."
      : "A curated course library with one featured lesson and additional practical courses.";

  useSEO({
    title: "Courses | Tracy Nguyen Counseling",
    description: pageDescription,
    canonicalPath: "/courses",
    locale: lang === "vi" ? "vi_VN" : "en_CA",
  });

  const handleCourseCheckout = async (courseSlug) => {
    setErrorMessage("");

    setCheckoutCourseSlug(courseSlug);

    try {
      const result = await createCourseCheckoutSession({
        courseSlug,
      });

      if (!result.checkoutUrl) {
        throw new Error("Unable to start checkout right now.");
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setErrorMessage(error?.message || "Unable to create checkout session.");
    } finally {
      setCheckoutCourseSlug("");
    }
  };

  const buildPrimaryAction = (course, { featured = false } = {}) => {
    return {
      type: "button",
      label:
        checkoutCourseSlug === course.slug
          ? "Preparing Checkout..."
          : featured
            ? "Purchase Course"
            : "Get Instant Access",
      onClick: () => handleCourseCheckout(course.slug),
      disabled: Boolean(checkoutCourseSlug),
      className: featured
        ? "coursePrimaryBtn coursePrimaryBtnStrong"
        : "coursePrimaryBtn",
    };
  };

  const featuredPrimaryAction = buildPrimaryAction(FEATURED_COURSE, {
    featured: true,
  });

  return (
    <div className="courseShell" data-course-design={courseDesign}>
      <SiteHeader />

      <main className="courseMain courseLibraryMain">
        <section className="courseSection coursePrimaryCourseSection">
          <CourseCard
            course={FEATURED_COURSE}
            featured
            designVariant={courseDesign}
            primaryAction={featuredPrimaryAction}
          />

          {cancelledCheckout ? (
            <p className="courseStatus">
              Checkout for {cancelledCourseTitle} was cancelled. You can try again anytime.
            </p>
          ) : null}

          {errorMessage ? <p className="courseError">{errorMessage}</p> : null}

          <p className="courseFootnote">Secure checkout powered by Stripe.</p>
        </section>

        <section className="courseMoreCoursesSection">
          <button
            type="button"
            className="courseMoreCoursesBtn"
            onClick={() => setShowMoreCourses((current) => !current)}
            aria-expanded={showMoreCourses}
          >
            {showMoreCourses ? "Hide More Courses" : "More Courses"}
          </button>

          {showMoreCourses ? (
            <div className="courseMoreCoursesPanel">
              <header className="courseSectionHead">
                <h2 className="courseSectionTitle">Explore Courses</h2>
                <p className="courseSectionSub">
                  Additional guided lessons are being released in a small, intentional catalog.
                </p>
              </header>

              <div className="courseGrid">
                {ADDITIONAL_COURSES.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    primaryAction={buildPrimaryAction(course)}
                    secondaryAction={{
                      type: "link",
                      to: `/courses/${course.slug}`,
                      label: "View Details",
                      className: "courseSecondaryBtn",
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="courseLibraryBottomCta">
          <p className="courseLibraryBottomCopy">Need help choosing the best course for your goals?</p>
          <Link to="/contact" className="courseSecondaryBtn">
            Contact Tracy
          </Link>
        </section>
      </main>
    </div>
  );
}
