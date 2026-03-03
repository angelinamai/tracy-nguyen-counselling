import "./AboutPage.css";
import SiteHeader from "../components/SiteHeader";

const aboutParagraphs = [
  "I am a registered Social Worker in good standing with the Ontario College of Social Workers and Social Service Workers.",
  "I was born and raised in Vietnam. I came to Canada when I was 18 years old to study. And then, I decided to settle down here. I can understand what it feels like when you come from one country and emerge in a completely different one. You constantly have to juggle with different values, negotiate with different acceptances, and adjust to different belief systems.",
  "After graduating from York University where I earned Master’s Degree in Social Work, I worked as a Clinical Social Worker for a mental health agency in Toronto. I also worked for a school board in Mississauga supporting international students with their practical and emotional needs so they can focus on studying well in school. When COVID hit, I decided to quit my office job, homeschooled my daughter and started my online counselling private practice. After living in Mississauga for a while, I moved to Niagara region and have been loving it here ever since.",
  "I had trainings in Cognitive Behavioral Therapy (CBT) for anxiety and depression, Strength-based practice, Attachment-Focused Adult Psychotherapy,  Acceptance Commitment Therapy (ACT), Solution Focused Brief Therapy (SFBT), Motivational Interviewing, Mindfulness Meditation, and Trauma-informed counseling. I have over ten years of experience in supportive counselling, with a focus on helping people create change and reach their goals.",
  "I also became a Master Practitioner in NLP (neurolinguistic programming) as I want to expand my counselling to coaching. I find that when your mind-brain-body are aligned, you become more self-aware, and you can make better choices. When you are well, you feel better, so you can do better. I can coach you to be at your best state, so you can communicate better and achieve more.",
  "My passion is to help others work through emotional issues, so that they can have a more fulfilling life. In my practice, I use a variety of evidence-based strategies and techniques to help my clients improve their communications skills, experience breakthroughs, and make meaningful and long-lasting changes in their lives. I can appreciate how past wounds can contribute to your situation and I am here to offer my understanding and compassion as I help you discover your true self.",
  "I currently live in St. Catharines, Ontario, Canada with my husband and daughter.",
];

export default function AboutPage() {
  return (
    <div className="page">
      <SiteHeader />

      <main className="container aboutMain">
        <section className="card aboutCardFull">
          <h1 className="aboutPageTitle">About Tracy</h1>
          {aboutParagraphs.map((paragraph, index) => (
            <p className="aboutPageParagraph" key={index}>
              {paragraph}
            </p>
          ))}
        </section>
      </main>
    </div>
  );
}
