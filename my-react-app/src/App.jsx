import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import FAQsPage from "./pages/FAQsPage";
import WelcomePage from "./pages/WelcomePage";
import ResourcesPage from "./pages/ResourcesPage";
import ServicesPage from "./pages/ServicesPage";
import Blog from "./pages/Blog";
import MoneyStory from "./pages/MoneyStory";
import BlogPost from "./pages/BlogPost";
import { useSiteLang } from "./content/useSiteLang";
export default function App() {
  const { text } = useSiteLang();

  return (
    <Routes>
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faqs" element={<FAQsPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/money" element={<MoneyStory />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route
        path="*"
        element={<div style={{ padding: 40 }}>{text.common.notFound}</div>}
      />
    </Routes>
  );
}
