import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { FEATURED_COURSE } from "../data/courseCatalog";
import { useSEO } from "../seo/useSEO";
import {
  COURSE_TITLE,
  COURSE_VIMEO_EMBED_URL,
} from "../config/courseConfig";
import "./CoursesPage.css";

export default function CourseLearnPage() {
  const lessons = Array.isArray(FEATURED_COURSE.curriculum)
    ? FEATURED_COURSE.curriculum
    : [];

  useSEO({
    title: `${COURSE_TITLE} | Learn`,
    description: "Private course lesson page.",
    canonicalPath: "/courses/learn",
    locale: "en_CA",
    noindex: true,
  });

  return (
    <div className="courseShell">
      <SiteHeader />
      <main className="courseMain">
        <section className="courseCard">
          <h1 className="pageH1 courseTitle">{COURSE_TITLE}</h1>
          <p className="courseLead">
            Welcome to your course. This page is available only to verified purchasers.
          </p>

          {lessons.length ? (
            <div className="courseLessonList">
              {lessons.map((lesson) => (
                <section className="courseLessonCard" key={lesson.title}>
                  <h2 className="courseLessonTitle">{lesson.title}</h2>
                  <p className="courseLessonDescription">{lesson.description}</p>
                  <div className="courseVideoFrameWrap">
                    {lesson.videoUrl ? (
                      <iframe
                        src={lesson.videoUrl}
                        className="courseVideoFrame"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={lesson.title}
                      />
                    ) : null}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="courseVideoFrameWrap">
              {COURSE_VIMEO_EMBED_URL ? (
                <iframe
                  src={COURSE_VIMEO_EMBED_URL}
                  className="courseVideoFrame"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={COURSE_TITLE}
                />
              ) : (
                <div className="courseVideoPlaceholder">
                  Add <code>VITE_COURSE_VIMEO_EMBED_URL</code> to display the lesson video.
                </div>
              )}
            </div>
          )}

          <div className="courseActionRow">
            <Link to="/courses" className="courseSecondaryBtn">
              Back to Course Info
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
