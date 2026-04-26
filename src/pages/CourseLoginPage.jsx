import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { useSEO } from "../seo/useSEO";
import { supabase } from "../lib/supabaseClient";
import { useSupabaseSession } from "../hooks/useSupabaseSession";
import "./CoursesPage.css";

export default function CourseLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, loading, isSupabaseConfigured } = useSupabaseSession();
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = useMemo(() => {
    const requested = searchParams.get("next") || "/courses/learn";
    return requested.startsWith("/") ? requested : "/courses/learn";
  }, [searchParams]);

  useSEO({
    title: "Course Login | Tracy Nguyen Counseling",
    description: "Sign in to access your purchased course.",
    canonicalPath: "/courses/login",
    locale: "en_CA",
  });

  useEffect(() => {
    if (loading) {
      return;
    }

    if (session) {
      navigate(nextPath, { replace: true });
    }
  }, [loading, navigate, nextPath, session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage("Supabase login is not configured.");
      return;
    }

    setIsSubmitting(true);

    try {
      const redirect = `${window.location.origin}/courses/login?next=${encodeURIComponent(nextPath)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirect,
        },
      });

      if (error) {
        throw error;
      }

      setStatusMessage("Magic link sent. Please check your email to continue.");
    } catch (error) {
      setErrorMessage(error?.message || "Unable to send magic link right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="courseShell">
      <SiteHeader />
      <main className="courseMain">
        <section className="courseCard courseCardNarrow">
          <h1 className="pageH1 courseTitle">Login To Access Your Course</h1>
          <p className="courseLead">
            Enter your email and we will send you a secure sign-in link.
          </p>

          <form className="courseLoginForm" onSubmit={handleSubmit}>
            <label htmlFor="course-login-email" className="courseLabel">
              Email address
            </label>
            <input
              id="course-login-email"
              type="email"
              required
              autoComplete="email"
              className="courseInput"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />

            <button
              type="submit"
              className="coursePrimaryBtn"
              disabled={isSubmitting || !isSupabaseConfigured}
            >
              {isSubmitting ? "Sending..." : "Send Magic Link"}
            </button>
          </form>

          {statusMessage ? <p className="courseStatus">{statusMessage}</p> : null}
          {errorMessage ? <p className="courseError">{errorMessage}</p> : null}

          <p className="courseFootnote">
            <Link to="/courses" className="courseTextLink">
              Back to course page
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
