import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { useSEO } from "../seo/useSEO";
import { FEATURED_COURSE, getCourseBySlug } from "../data/courseCatalog";
import { confirmCoursePurchase } from "../lib/courseApiClient";
import "./CoursesPage.css";

export default function CoursePurchaseSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = useMemo(() => searchParams.get("session_id") || "", [searchParams]);
  const requestedCourseSlug = useMemo(
    () => (searchParams.get("course") || "").trim() || FEATURED_COURSE.slug,
    [searchParams],
  );
  const courseTitle = useMemo(
    () => getCourseBySlug(requestedCourseSlug)?.title || "your course",
    [requestedCourseSlug],
  );
  const [state, setState] = useState(() => (sessionId ? "loading" : "error"));
  const [message, setMessage] = useState(() =>
    sessionId ? "" : "Missing Stripe session ID. Please return to the course page.",
  );

  useSEO({
    title: "Purchase Confirmed | Tracy Nguyen Counseling",
    description: "Confirming your course purchase and granting access.",
    canonicalPath: "/courses/success",
    locale: "en_CA",
    noindex: true,
  });

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;

    confirmCoursePurchase({
      courseSlug: requestedCourseSlug,
      sessionId,
    })
      .then(() => {
        if (cancelled) {
          return;
        }
        setState("success");
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setState("error");
        setMessage(error?.message || "Unable to confirm your purchase right now.");
      });

    return () => {
      cancelled = true;
    };
  }, [requestedCourseSlug, sessionId]);

  return (
    <div className="courseShell">
      <SiteHeader />
      <main className="courseMain">
        <section className="courseCard courseCardNarrow">
          <h1 className="pageH1 courseTitle">Purchase Confirmation</h1>

          {state === "loading" ? (
            <p className="courseLead">Finalizing your course access...</p>
          ) : null}

          {state === "success" ? (
            <>
              <p className="courseLead">
                Payment received. Access is now active for {courseTitle}.
              </p>
              <div className="courseActionRow">
                <Link to={`/courses/${requestedCourseSlug}`} className="coursePrimaryBtn">
                  View Course
                </Link>
                <Link to="/courses" className="courseSecondaryBtn">
                  Back to Courses
                </Link>
              </div>
            </>
          ) : null}

          {state === "error" ? (
            <>
              <p className="courseError">{message}</p>
              <div className="courseActionRow">
                <Link to="/courses" className="courseSecondaryBtn">
                  Back to Courses
                </Link>
              </div>
            </>
          ) : null}
        </section>
      </main>
    </div>
  );
}
