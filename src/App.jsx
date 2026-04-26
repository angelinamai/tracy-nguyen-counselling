import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import QuestionnairePage from "./pages/QuestionnairePage";
import FAQsPage from "./pages/FAQsPage";
import WelcomePage from "./pages/WelcomePage";
import AboutPage from "./pages/AboutPage";
import ResourcesPage from "./pages/ResourcesPage";
import ServicesPage from "./pages/ServicesPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CourseLockedPage from "./pages/CourseLockedPage";
import CourseLoginPage from "./pages/CourseLoginPage";
import CourseLearnPage from "./pages/CourseLearnPage";
import CoursePurchaseSuccessPage from "./pages/CoursePurchaseSuccessPage";
import Blog from "./pages/Blog";
import MoneyStory from "./pages/MoneyStory";
import BlogPost from "./pages/BlogPost";
import FormSuccessPage from "./pages/FormSuccessPage";
import ProtectedCourseRoute from "./components/ProtectedCourseRoute";
import { useSiteLang } from "./content/useSiteLang";
export default function App() {
  const { text } = useSiteLang();
  const location = useLocation();

  useEffect(() => {
    const navVariant = new URLSearchParams(location.search).get("nav");
    const isValidVariant = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(
      navVariant || "",
    );

    if (isValidVariant) {
      document.documentElement.setAttribute("data-nav-pill", navVariant);
      return;
    }

    document.documentElement.removeAttribute("data-nav-pill");
  }, [location.search]);

  return (
    <Routes>
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/contact/questionnaire" element={<QuestionnairePage />} />
      <Route
        path="/contact/questionnaire-validation-v1"
        element={<QuestionnairePage validationStyleVariant="v1" />}
      />
      <Route
        path="/contact/questionnaire-validation-v2"
        element={<QuestionnairePage validationStyleVariant="v2" />}
      />
      <Route
        path="/contact/questionnaire-validation-v3"
        element={<QuestionnairePage validationStyleVariant="v3" />}
      />
      <Route
        path="/contact/questionnaire-validation-v4"
        element={<QuestionnairePage validationStyleVariant="v4" />}
      />
      <Route
        path="/contact/questionnaire-validation-v5"
        element={<QuestionnairePage validationStyleVariant="v5" />}
      />
      <Route path="/faqs" element={<FAQsPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/locked" element={<CourseLockedPage />} />
      <Route path="/courses/login" element={<CourseLoginPage />} />
      <Route path="/courses/success" element={<CoursePurchaseSuccessPage />} />
      <Route path="/courses/:slug" element={<CourseDetailsPage />} />
      <Route
        path="/courses/learn"
        element={(
          <ProtectedCourseRoute>
            <CourseLearnPage />
          </ProtectedCourseRoute>
        )}
      />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/money" element={<MoneyStory />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/form-success-v4" element={<FormSuccessPage variant="v4" />} />
      <Route path="/form-success" element={<FormSuccessPage variant="v4" />} />
      <Route
        path="*"
        element={<div style={{ padding: 40 }}>{text.common.notFound}</div>}
      />
    </Routes>
  );
}
