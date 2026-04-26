import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { COURSE_SLUG } from "../config/courseConfig";
import { getCourseAccess } from "../lib/courseApiClient";
import { useSupabaseSession } from "../hooks/useSupabaseSession";

export default function ProtectedCourseRoute({ children }) {
  const { session, loading, isSupabaseConfigured } = useSupabaseSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkedUserId, setCheckedUserId] = useState(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isSupabaseConfigured) {
      return;
    }

    if (!session?.access_token) {
      const next = `${location.pathname}${location.search}`;
      navigate(`/courses/login?next=${encodeURIComponent(next)}`, { replace: true });
      return;
    }

    let cancelled = false;

    getCourseAccess({
      accessToken: session.access_token,
      courseSlug: COURSE_SLUG,
    })
      .then((result) => {
        if (cancelled) {
          return;
        }

        if (!result.hasAccess) {
          navigate("/courses?access=required", { replace: true });
          return;
        }

        setCheckedUserId(session.user.id);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        navigate("/courses?access=error", { replace: true });
      });

    return () => {
      cancelled = true;
    };
  }, [isSupabaseConfigured, loading, location.pathname, location.search, navigate, session]);

  const checkingAccess =
    Boolean(isSupabaseConfigured) &&
    Boolean(session?.user?.id) &&
    checkedUserId !== session.user.id;

  if (loading || checkingAccess) {
    return (
      <div className="courseShell">
        <main className="courseMain">
          <section className="courseCard courseCardNarrow">
            <h1 className="pageH1 courseTitle">Loading your course...</h1>
            <p className="courseLead">Please wait while we verify your access.</p>
          </section>
        </main>
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="courseShell">
        <main className="courseMain">
          <section className="courseCard courseCardNarrow">
            <h1 className="pageH1 courseTitle">Course Access Is Not Configured</h1>
            <p className="courseLead">
              Add Supabase environment variables before using protected course routes.
            </p>
          </section>
        </main>
      </div>
    );
  }

  return children;
}
