import { useState } from "react";

export default function PreliminaryQuestionnaireForm({ text, contact }) {
  const questionnaire = contact.questionnaire;
  const qFields = questionnaire.fields;
  const qOptions = questionnaire.options;
  const qMessages = questionnaire.messages;
  const [submitState, setSubmitState] = useState("idle");
  const [submitError, setSubmitError] = useState("");

  const handleSecondaryAreaChange = (event) => {
    if (!event.target.checked) {
      return;
    }

    const form = event.target.form;
    if (!form) {
      return;
    }

    const checkedCount = form.querySelectorAll(
      'input[name="secondary_support_areas[]"]:checked',
    ).length;

    if (checkedCount > 3) {
      event.target.checked = false;
      window.alert(questionnaire.alerts.secondaryAreaLimit);
    }
  };

  const normalizeFormData = (formData) => {
    const fields = {};

    for (const [rawKey, rawValue] of formData.entries()) {
      if (rawKey === "website") {
        continue;
      }

      const key = rawKey.endsWith("[]") ? rawKey.slice(0, -2) : rawKey;
      const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;

      if (!value) {
        continue;
      }

      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        if (Array.isArray(fields[key])) {
          fields[key].push(value);
        } else {
          fields[key] = [fields[key], value];
        }
      } else {
        fields[key] = value;
      }
    }

    return fields;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSubmitState("sending");
    setSubmitError("");

    try {
      const formData = new FormData(form);
      const payload = {
        honeypot: (formData.get("website") || "").toString(),
        fields: normalizeFormData(formData),
      };

      const response = await fetch("http://localhost:8787/api/contact-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      let result = {};

      if (contentType.includes("application/json")) {
        result = await response.json().catch(() => ({}));
      } else {
        const textResult = await response.text().catch(() => "");
        if (textResult) {
          result = { error: textResult.slice(0, 240) };
        }
      }

      if (!response.ok) {
        let fallbackMessage = qMessages.error;
        if (response.status === 429) {
          fallbackMessage = qMessages.rateLimited || qMessages.error;
        } else if (response.status >= 500) {
          fallbackMessage = qMessages.serverError || qMessages.error;
        }

        throw new Error(result.error || fallbackMessage);
      }

      form.reset();
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      if (error?.name === "TypeError" && String(error?.message || "").includes("fetch")) {
        setSubmitError(qMessages.networkError || qMessages.error);
        return;
      }
      setSubmitError(error?.message || qMessages.error);
    }
  };

  const isSending = submitState === "sending";

  return (
    <form
      className="contactForm"
      onSubmit={handleSubmit}
    >
      <div className="honeypotField" aria-hidden="true">
        <label htmlFor="website">{qFields.honeypotLabel}</label>
        <input
          id="website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <section className="questionnaire">
        <h2 className="qTitle">{questionnaire.title}</h2>
        <p className="qText">{questionnaire.intro}</p>

        <div className="qLayout">
          <section className="qSection" id="q-concerns">
            <h3 className="qSectionTitle">{qFields.primaryConcernsTitle}</h3>
            <fieldset className="qFieldset">
              <legend className="qLabel">
                {qFields.mainAreaLabel} <span>{text.common.required}</span>
              </legend>
              <div className="qOptions qOptions--choices">
                {qOptions.supportAreas.map((item) => (
                  <label key={item} className="qOption qOption--choice">
                    <input type="radio" name="main_support_area" value={item} required />
                    <span className="qOptionText">{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="qFieldset">
              <legend className="qLabel">{qFields.secondaryAreaLabel}</legend>
              <p className="qHint">{qFields.secondaryAreaHint}</p>
              <div className="qOptions qOptions--choices">
                {qOptions.supportAreas.map((item) => (
                  <label key={`secondary-${item}`} className="qOption qOption--choice">
                    <input
                      type="checkbox"
                      name="secondary_support_areas[]"
                      value={item}
                      onChange={handleSecondaryAreaChange}
                    />
                    <span className="qOptionText">{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="qFieldset">
              <legend className="qLabel">
                {qFields.durationLabel} <span>{text.common.required}</span>
              </legend>
              <div className="qOptions">
                {qOptions.durationOptions.map((item) => (
                  <label key={item} className="qOption">
                    <input type="radio" name="challenge_duration" value={item} required />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="qFieldset">
              <legend className="qLabel">
                {qFields.impactLabel} <span>{text.common.required}</span>
              </legend>
              <div className="qOptions">
                {qOptions.impactOptions.map((item) => (
                  <label key={item} className="qOption">
                    <input type="radio" name="impact_level" value={item} required />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          <section className="qSection" id="q-health">
            <h3 className="qSectionTitle">{qFields.healthHabitsTitle}</h3>
            <fieldset className="qFieldset">
              <legend className="qLabel">
                {qFields.physicalHealthLabel} <span>{text.common.required}</span>
              </legend>
              <div className="qOptions qOptionsInline">
                {qOptions.healthRatings.map((item) => (
                  <label key={`physical-${item}`} className="qOption">
                    <input type="radio" name="physical_health" value={item} required />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="qFieldset">
              <legend className="qLabel">
                {qFields.sleepHabitsLabel} <span>{text.common.required}</span>
              </legend>
              <div className="qOptions qOptionsInline">
                {qOptions.healthRatings.map((item) => (
                  <label key={`sleep-${item}`} className="qOption">
                    <input type="radio" name="sleep_habits" value={item} required />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="qFieldset">
              <legend className="qLabel">
                {qFields.eatingHabitsLabel} <span>{text.common.required}</span>
              </legend>
              <div className="qOptions qOptionsInline">
                {qOptions.healthRatings.map((item) => (
                  <label key={`eating-${item}`} className="qOption">
                    <input type="radio" name="eating_habits" value={item} required />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="qFieldset">
              <legend className="qLabel">
                {qFields.alcoholLabel} <span>{text.common.required}</span>
              </legend>
              <div className="qOptions qOptionsInline">
                {qOptions.frequencyOptions.map((item) => (
                  <label key={`alcohol-${item}`} className="qOption">
                    <input type="radio" name="alcohol_frequency" value={item} required />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="qFieldset">
              <legend className="qLabel">
                {qFields.drugUseLabel} <span>{text.common.required}</span>
              </legend>
              <div className="qOptions qOptionsInline">
                {qOptions.frequencyOptions.map((item) => (
                  <label key={`drugs-${item}`} className="qOption">
                    <input type="radio" name="recreational_drug_use" value={item} required />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="qLabel">{qFields.copingLabel}</label>
            <textarea
              rows="5"
              className="qTextarea"
              name="coping_strategies"
              placeholder={qFields.answerPlaceholder}
            />
          </section>

          <section className="qSection" id="q-history">
            <h3 className="qSectionTitle">{qFields.careHistoryTitle}</h3>
            <fieldset className="qFieldset">
              <legend className="qLabel">{qFields.priorServicesLabel}</legend>
              <p className="qHint">{qFields.selectAllHint}</p>
              <div className="qOptions">
                {qOptions.priorServices.map((item) => (
                  <label key={`services-${item}`} className="qOption">
                    <input type="checkbox" name="previous_services[]" value={item} />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="qLabel">{qFields.priorServicesFeedbackLabel}</label>
            <textarea
              rows="5"
              className="qTextarea"
              name="previous_services_feedback"
              placeholder={qFields.answerPlaceholder}
            />

            <fieldset className="qFieldset">
              <legend className="qLabel">{qFields.expectationsLabel}</legend>
              <div className="qOptions">
                {qOptions.expectationOptions.map((item) => (
                  <label key={`expect-${item}`} className="qOption">
                    <input type="checkbox" name="counseling_expectations[]" value={item} />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          <section className="qSection" id="q-logistics">
            <h3 className="qSectionTitle">{qFields.sessionLogisticsTitle}</h3>
            <fieldset className="qFieldset">
              <legend className="qLabel">{qFields.sessionSettingsLabel}</legend>
              <div className="qOptions qOptionsInline">
                {qOptions.sessionSettings.map((item) => (
                  <label key={`setting-${item}`} className="qOption">
                    <input type="checkbox" name="session_settings[]" value={item} />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="qFieldset">
              <legend className="qLabel">
                {qFields.availabilityLabel} <span>{text.common.required}</span>
              </legend>
              <div className="qOptions">
                {qOptions.availabilityOptions.map((item) => (
                  <label key={`availability-${item}`} className="qOption">
                    <input type="radio" name="availability" value={item} required />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="qLabel">
              {qFields.bestPhoneLabel} <span>{text.common.required}</span>
            </label>
            <input type="tel" name="best_phone_number" required />

            <label className="qConfirm">
              <input type="checkbox" name="intake_completed" required />
              <span>{qFields.confirmationLabel}</span>
            </label>
          </section>
        </div>
      </section>

      <button type="submit" className="contactSubmit" disabled={isSending}>
        {isSending ? qMessages.sending : contact.submitIntake}
      </button>

      {submitState === "success" && (
        <p className="contactFormStatus" role="status" aria-live="polite">
          {qMessages.success}
        </p>
      )}

      {submitState === "error" && (
        <p className="contactFormStatus contactFormStatusError" role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}
