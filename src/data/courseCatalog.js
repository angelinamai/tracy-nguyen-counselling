import {
  COURSE_PRICE_LABEL,
  COURSE_SLUG,
  COURSE_TITLE,
} from "../config/courseConfig";

function youtubeEmbedUrl(videoId) {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export const COURSE_LIBRARY = [
  {
    id: "boundaries-emotional-clarity",
    slug: COURSE_SLUG,
    badge: "Featured Course",
    title: COURSE_TITLE,
    subtitle: "What to Expect in This Course",
    shortDescription:
      "This course offers a safe, compassionate space to explore your relationship with your immigrant parents—without guilt or pressure to choose sides.",
    price: COURSE_PRICE_LABEL,
    duration: "10 mins video",
    format: "Self-paced",
    access: "Lifetime access",
    bullets: [
      "Guided reflections to help you understand your emotions and experiences",
      "Gentle visualizations to build compassion without dismissing your pain",
      "Practical tools for communication and setting boundaries",
      "A balance of emotional insight and real-life application",
      "A pace that honors your readiness—no forcing, no rushing",
    ],
    closingCopy: [
      "This is not about blaming your parents or fixing them.",
      "It’s about understanding, healing, and reconnecting with yourself.",
    ],
    topicsTitle: "Topics Covered in This Course",
    topics: [
      "The love–hurt dynamic in immigrant families",
      "Emotional neglect vs. survival-based parenting",
      "Cultural values: respect, obedience, and silence",
      "Unmet emotional needs and inner child awareness",
      "Compassion for your parents’ story",
      "Identity, belonging, and cultural integration",
      "Guilt, obligation, and people-pleasing patterns",
      "Emotional regulation and self-healing",
      "Healthy communication and conflict navigation",
      "Boundaries without guilt",
      "Breaking generational cycles",
    ],
    curriculumTitle: "Course Curriculum",
    curriculum: [
      {
        title: "Module 1: Understanding the Pain Beneath the Love",
        description:
          "Explore the emotional impact of growing up in a survival-focused household and begin validating your own experience.",
        videoUrl: youtubeEmbedUrl("ZhhmggGAEk4"),
      },
      {
        title: "Module 2: Seeing Your Parents Through a Wider Lens",
        description:
          "Build compassion by understanding your parents’ history, without minimizing your pain.",
        videoUrl: youtubeEmbedUrl("mR7V8ommIPY"),
      },
      {
        title: "Module 3: Culture, Identity & Holding Both Truths",
        description:
          "Learn how to honor your cultural roots while acknowledging the parts that hurt you.",
        videoUrl: youtubeEmbedUrl("43iq-uC4ubI"),
      },
      {
        title: "Module 4: Healing Yourself First",
        description:
          "Shift the focus inward—process emotions, reconnect with your needs, and begin personal healing.",
        videoUrl: youtubeEmbedUrl("lpqArCfRJRw"),
      },
      {
        title: "Module 5: Communication, Boundaries & Lasting Change",
        description:
          "Develop practical skills to communicate clearly, set boundaries, and create healthier relationship patterns.",
        videoUrl: youtubeEmbedUrl("CSQRBmjqFOo"),
      },
    ],
    previewLabel: "Watch Preview",
    previewThumbnail: "/images/course-thumbnail.jpg",
    previewAlt: "Mini Course Healing & Connection with Immigrant Parents thumbnail",
    previewEmbedUrl: "",
    trustLine: "Grounded in Tracy Nguyen's counseling practice.",
    reassuranceLine: "7-day refund if the course is not helpful.",
    featured: true,
    purchasable: true,
  },
  {
    id: "navigating-family-expectations",
    slug: "navigating-family-expectations",
    badge: "Course",
    title: "Navigating Family Expectations",
    shortDescription:
      "Learn practical ways to hold your values while staying connected in emotionally loaded family dynamics.",
    price: "$79 CAD",
    duration: "55m video",
    format: "Self-paced",
    access: "Lifetime access",
    bullets: [
      "Set limits with less conflict and less emotional spillover.",
      "Reduce guilt loops after difficult family conversations.",
      "Respond with clarity when pressure and criticism increase.",
    ],
    previewLabel: "Watch Preview",
    previewThumbnail: "",
    featured: false,
    purchasable: true,
  },
  {
    id: "calm-communication-foundations",
    slug: "calm-communication-foundations",
    badge: "Course",
    title: "Calm Communication Foundations",
    shortDescription:
      "Build a repeatable communication method for high-stress moments at home, work, and in close relationships.",
    price: "$69 CAD",
    duration: "48m video",
    format: "Self-paced",
    access: "Lifetime access",
    bullets: [
      "Use language that is clear, firm, and not defensive.",
      "De-escalate conflict while protecting your boundaries.",
      "Replace reactive patterns with grounded responses.",
    ],
    previewLabel: "Watch Preview",
    previewThumbnail: "",
    featured: false,
    purchasable: true,
  },
  {
    id: "emotional-reset-routines",
    slug: "emotional-reset-routines",
    badge: "Course",
    title: "Emotional Reset Routines",
    shortDescription:
      "A practical guide to short reset routines that help you recover faster after emotionally draining days.",
    price: "$59 CAD",
    duration: "42m video",
    format: "Self-paced",
    access: "Lifetime access",
    bullets: [
      "Identify the early signs of emotional overload.",
      "Use short routines to regulate and recover more quickly.",
      "Create steadier energy for work, family, and rest.",
    ],
    previewLabel: "Watch Preview",
    previewThumbnail: "",
    featured: false,
    purchasable: true,
  },
];

export const FEATURED_COURSE =
  COURSE_LIBRARY.find((course) => course.featured) || COURSE_LIBRARY[0];

export const ADDITIONAL_COURSES = COURSE_LIBRARY.filter(
  (course) => course.id !== FEATURED_COURSE.id,
);

export function getCourseBySlug(slug) {
  return COURSE_LIBRARY.find((course) => course.slug === slug) || null;
}
