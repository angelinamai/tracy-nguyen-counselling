import { Link } from "react-router-dom";

function renderAction(action, fallbackClassName) {
  if (!action) {
    return null;
  }

  const className = action.className || fallbackClassName;

  if (action.type === "button") {
    return (
      <button
        type="button"
        className={className}
        onClick={action.onClick}
        disabled={Boolean(action.disabled)}
      >
        {action.label}
      </button>
    );
  }

  return (
    <Link to={action.to} className={className}>
      {action.label}
    </Link>
  );
}

function embedUrlToWatchUrl(url) {
  const videoId = String(url || "").split("/embed/")[1]?.split(/[?#]/)[0];
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
}

export default function CourseCard({
  course,
  featured = false,
  primaryAction = null,
  secondaryAction = null,
  designVariant = "1",
}) {
  const HeadingTag = featured ? "h2" : "h3";
  const bullets = Array.isArray(course.bullets)
    ? course.bullets.slice(0, featured ? course.bullets.length : 4)
    : [];
  const closingCopy = Array.isArray(course.closingCopy) ? course.closingCopy : [];
  const topics = Array.isArray(course.topics) ? course.topics : [];
  const curriculum = Array.isArray(course.curriculum) ? course.curriculum : [];
  const hasPreviewEmbed = Boolean(course.previewEmbedUrl);
  const hasPreviewImage = Boolean(course.previewThumbnail);

  if (featured) {
    const showCurriculumVideos = ["1", "4"].includes(designVariant);

    const renderPurchaseBlock = (actionLabel) => {
      const action = primaryAction
        ? {
            ...primaryAction,
            label:
              primaryAction.label === "Preparing Checkout..."
                ? primaryAction.label
                : actionLabel,
          }
        : null;

      return (
      <aside className="courseFeaturePurchase" aria-label="Course purchase">
        <span className="coursePriceLabel">Course price</span>
        <strong className="courseFeaturePrice">{course.price}</strong>
        <div className="courseFeatureActions">
          {renderAction(action, "coursePrimaryBtn coursePrimaryBtnStrong")}
          {renderAction(secondaryAction, "courseSecondaryBtn")}
        </div>
        {course.reassuranceLine ? (
          <p className="courseReassurance">{course.reassuranceLine}</p>
        ) : null}
      </aside>
      );
    };

    const previewBlock = (
      <section
        className="coursePreviewBlock courseFeaturePreview"
        aria-label={`${course.title} preview`}
      >
        {hasPreviewEmbed ? (
          <iframe
            src={course.previewEmbedUrl}
            className="coursePreviewFrame"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={`${course.title} preview`}
          />
        ) : hasPreviewImage ? (
          <img
            src={course.previewThumbnail}
            alt={course.previewAlt || `${course.title} preview`}
            className="coursePreviewImage"
          />
        ) : (
          <div className="coursePreviewPlaceholder">
            <span className="coursePreviewPlay" aria-hidden="true">
              ▶
            </span>
            <div className="coursePreviewCopy">
              <p className="coursePreviewLabel">{course.previewLabel || "Watch Preview"}</p>
            </div>
          </div>
        )}
      </section>
    );

    return (
      <article className={`courseFeature courseFeatureDesign${designVariant}`}>
        <section className="courseFeatureHero">
          <div className="courseFeatureHeroCopy">
            <HeadingTag className="courseFeatureTitle">{course.title}</HeadingTag>
            {course.subtitle ? (
              <p className="courseFeatureSubtitle">{course.subtitle}</p>
            ) : null}
            {course.shortDescription ? (
              <p className="courseLead courseFeatureLead">{course.shortDescription}</p>
            ) : null}
          </div>
        </section>

        <div className="courseMetaRow courseFeatureMeta" aria-label="Course details">
          <span className="courseMetaPill">{course.duration}</span>
          <span className="courseMetaPill">{course.format}</span>
          <span className="courseMetaPill">{course.access}</span>
        </div>

        <section className="courseDesignedSection courseExpectSection">
          <p className="courseDesignedEyebrow">You can expect:</p>
          <ul className="courseExpectList">
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {closingCopy.length ? (
            <div className="courseStatementBox">
              {closingCopy.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          ) : null}
        </section>

        {topics.length ? (
          <section className="courseDesignedSection courseCurriculumSection">
            <h3 className="courseDesignedTitle">
              {course.topicsTitle || "Topics Covered"}
            </h3>
            <ul className="courseTopicPillList">
              {topics.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="courseInlineCta courseInlineCtaTop">
          {renderPurchaseBlock("Get Instant Access")}
        </div>

        {previewBlock}

        {curriculum.length ? (
          <section className="courseDesignedSection">
            <h3 className="courseDesignedTitle">
              {course.curriculumTitle || "Course Curriculum"}
            </h3>
            <div className="courseCurriculumList">
              {curriculum.map((item) => (
                <article className="courseCurriculumCard" key={item.title}>
                  <div className="courseCurriculumCopy">
                    <h4 className="courseCurriculumTitle">{item.title}</h4>
                    <p className="courseCurriculumDescription">{item.description}</p>
                  </div>
                  {item.videoUrl && showCurriculumVideos ? (
                    <div className="courseCurriculumVideo">
                      <iframe
                        src={item.videoUrl}
                        className="courseCurriculumFrame"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={item.title}
                      />
                    </div>
                  ) : null}
                  {item.videoUrl && !showCurriculumVideos ? (
                    <a
                      href={embedUrlToWatchUrl(item.videoUrl)}
                      className="courseVideoTextLink"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Start
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <div className="courseInlineCta courseInlineCtaBottom">
          {renderPurchaseBlock("Start Healing Today")}
        </div>

        {course.trustLine ? <p className="courseTrustLine">{course.trustLine}</p> : null}
      </article>
    );
  }

  return (
    <article className={`courseCatalogCard${featured ? " courseCatalogCardFeatured" : ""}`}>
      {course.badge ? <span className="courseKicker">{course.badge}</span> : null}

      <HeadingTag className={featured ? "courseCatalogTitle courseCatalogTitleFeatured" : "courseCatalogTitle"}>
        {course.title}
      </HeadingTag>

      {course.shortDescription ? (
        <p className="courseLead courseCardLead">{course.shortDescription}</p>
      ) : null}

      <section
        className={`coursePreviewBlock${featured ? "" : " coursePreviewBlockCompact"}`}
        aria-label={`${course.title} preview`}
      >
        {hasPreviewEmbed ? (
          <iframe
            src={course.previewEmbedUrl}
            className={`coursePreviewFrame${featured ? "" : " coursePreviewFrameCompact"}`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={`${course.title} preview`}
          />
        ) : hasPreviewImage ? (
          <img
            src={course.previewThumbnail}
            alt={course.previewAlt || `${course.title} preview`}
            className={`coursePreviewImage${featured ? "" : " coursePreviewImageCompact"}`}
          />
        ) : (
          <div className={`coursePreviewPlaceholder${featured ? "" : " coursePreviewPlaceholderCompact"}`}>
            <span className="coursePreviewPlay" aria-hidden="true">
              ▶
            </span>
            <div className="coursePreviewCopy">
              <p className="coursePreviewLabel">{course.previewLabel || "Watch Preview"}</p>
            </div>
          </div>
        )}
      </section>

      <div className="coursePriceRow">
        <span className="coursePriceLabel">Course price</span>
        <strong className="coursePriceValue">{course.price}</strong>
      </div>

      <div className="courseMetaRow" aria-label="Course details">
        <span className="courseMetaPill">{course.duration}</span>
        <span className="courseMetaPill">{course.format}</span>
        <span className="courseMetaPill">{course.access}</span>
      </div>

      <ul className="courseHighlightList">
        {bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {closingCopy.length ? (
        <div className="courseClosingCopy">
          {closingCopy.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      ) : null}

      {topics.length ? (
        <section className="courseTopics" aria-labelledby={`${course.id}-topics`}>
          <h3 id={`${course.id}-topics`} className="courseTopicsTitle">
            {course.topicsTitle || "Topics Covered"}
          </h3>
          <ul className="courseTopicList">
            {topics.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {course.trustLine ? <p className="courseTrustLine">{course.trustLine}</p> : null}

      <div className="courseActionRow">
        {renderAction(primaryAction, "coursePrimaryBtn")}
        {renderAction(secondaryAction, "courseSecondaryBtn")}
      </div>

      {course.reassuranceLine ? <p className="courseReassurance">{course.reassuranceLine}</p> : null}
    </article>
  );
}
