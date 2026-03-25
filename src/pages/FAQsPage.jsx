import { useState } from "react";
import "./FAQsPage.css";
import SiteHeader from "../components/SiteHeader";
import { useSiteLang } from "../content/useSiteLang";
import { useSEO } from "../seo/useSEO";

export default function FAQsPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const { text, lang } = useSiteLang();
  const faqs = text.faqsPage.items;
  const pageTitle = lang === "vi" ? "Hỏi đáp | Tracy Nguyen Counseling" : "FAQs | Tracy Nguyen Counseling";
  const pageDescription =
    lang === "vi"
      ? "Các câu hỏi thường gặp về đặt lịch, chi phí, bảo hiểm và hình thức tư vấn."
      : "Frequently asked questions about booking, fees, insurance, and session formats.";

  useSEO({
    title: pageTitle,
    description: pageDescription,
    canonicalPath: "/faqs",
    locale: lang === "vi" ? "vi_VN" : "en_CA",
  });

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faqPage">
      <SiteHeader />

      <main className="faqMain">
        <div className="faqCard">
          <h1 className="faqTitle pageH1">{text.faqsPage.title}</h1>
          <p className="faqSubtitle">{text.faqsPage.subtitle}</p>

          <div className="faqList">
            {faqs.map((faq, index) => {
              const open = activeIndex === index;
              const normalizedAnswer = faq.answer.replace(/\\n/g, "\n");

              return (
                <div key={index} className={`faqItem ${open ? "open" : ""}`}>
                  <button className="faqQuestion" onClick={() => toggle(index)}>
                    <span>{faq.question}</span>
                    <span className={`faqChevron ${open ? "open" : ""}`}>
                      ▾
                    </span>
                  </button>

                  {open && <div className="faqAnswer">{normalizedAnswer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
