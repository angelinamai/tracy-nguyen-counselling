import { useState } from "react";
import { Link } from "react-router-dom";
import "./FAQsPage.css";
import { useSiteLang } from "../content/useSiteLang";

export default function FAQsPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const { text } = useSiteLang();
  const faqs = text.faqsPage.items;

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faqPage">
      <header className="faqTopbar">
        <div className="faqTopbarInner">
          <Link to="/" className="tncBackLink">
            ← {text.common.back}
          </Link>
          <div className="faqBrand">{text.brand}</div>
          <div className="faqSpacer" />
        </div>
      </header>

      <main className="faqMain">
        <div className="faqCard">
          <h1 className="faqTitle">{text.faqsPage.title}</h1>
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
