import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getIntakeSuccessRedirectPath,
  resolveIntakeSuccessMode,
} from "../config/intakeSuccessFlow";
import { resolveIntakeValidationStyle } from "../config/intakeValidationStyle";

const requiredFieldKeys = [
  "main_support_area",
  "challenge_duration",
  "impact_level",
  "physical_health",
  "sleep_habits",
  "eating_habits",
  "alcohol_frequency",
  "recreational_drug_use",
  "availability",
  "best_phone_number",
];

function getFieldKeyFromInputName(inputName) {
  if (!inputName) {
    return "";
  }
  return inputName.endsWith("[]") ? inputName.slice(0, -2) : inputName;
}

function normalizeFieldValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(", ");
  }

  return String(value || "").trim();
}

export default function PreliminaryQuestionnaireForm({ contact, validationStyleVariant }) {
  const questionnaire = contact.questionnaire;
  const qFields = questionnaire.fields;
  const qOptions = questionnaire.options;
  const qMessages = questionnaire.messages;
  const navigate = useNavigate();
  const location = useLocation();
  const [submitState, setSubmitState] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const successMode = resolveIntakeSuccessMode(location.search);
  const validationStyle = resolveIntakeValidationStyle({
    preset: validationStyleVariant,
    search: location.search,
  });

  const requiredFieldMessage =
    qMessages.requiredField || "Please complete this required field.";
  const requiredConfirmationMessage =
    qMessages.requiredConfirmation || qMessages.requiredField || requiredFieldMessage;
  const requiredAriaLabel = questionnaire.requiredAriaLabel || "required";
  const reassuranceLine =
    questionnaire.supportiveStart ||
    "Take your time. There are no right or wrong answers.";
  const requiredLegend =
    questionnaire.requiredLegend || "Fields marked with * are required.";

  const hasFieldError = (fieldKey) => Boolean(errors[fieldKey]);
  const getFieldErrorId = (fieldKey) => `error-${fieldKey}`;
  const getFieldsetClassName = (fieldKey) =>
    hasFieldError(fieldKey) ? "qFieldset qFieldsetInvalid" : "qFieldset";
  const getInputErrorProps = (fieldKey) =>
    hasFieldError(fieldKey)
      ? {
          "aria-invalid": "true",
          "aria-describedby": getFieldErrorId(fieldKey),
        }
      : {};

  const renderFieldError = (fieldKey) => {
    if (!hasFieldError(fieldKey)) {
      return null;
    }

    return (
      <p id={getFieldErrorId(fieldKey)} className="qFieldError" role="alert">
        {errors[fieldKey]}
      </p>
    );
  };

  const renderRequiredIndicator = () => (
    <>
      <span className="qRequiredMark" aria-hidden="true">
        *
      </span>
      <span className="qSrOnly">{requiredAriaLabel}</span>
    </>
  );

  const clearFieldError = (fieldKey) => {
    setErrors((currentErrors) => {
      if (!currentErrors[fieldKey]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldKey];
      return nextErrors;
    });
  };

  const handleFormFieldChange = (event) => {
    const fieldKey = getFieldKeyFromInputName(event.target?.name || "");
    if (!fieldKey) {
      return;
    }
    clearFieldError(fieldKey);
  };

  const validateRequiredFields = (fields) => {
    const nextErrors = {};

    for (const fieldKey of requiredFieldKeys) {
      if (!normalizeFieldValue(fields[fieldKey]).length) {
        nextErrors[fieldKey] = requiredFieldMessage;
      }
    }

    if (!normalizeFieldValue(fields.intake_completed).length) {
      nextErrors.intake_completed = requiredConfirmationMessage;
    }

    return nextErrors;
  };

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

      const key = getFieldKeyFromInputName(rawKey);
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

    setSubmitError("");
    const formData = new FormData(form);
    const payload = {
      honeypot: (formData.get("website") || "").toString(),
      fields: normalizeFormData(formData),
    };

    const validationErrors = validateRequiredFields(payload.fields);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setSubmitState("idle");
      return;
    }

    setErrors({});
    setSubmitState("sending");

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact-intake`, {
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
      const successRedirectPath = getIntakeSuccessRedirectPath(successMode);
      if (successRedirectPath) {
        navigate(successRedirectPath);
        return;
      }
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
      className={`contactForm validationStyle validationStyle--${validationStyle}`}
      onSubmit={handleSubmit}
      onChange={handleFormFieldChange}
      noValidate
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
        <p className="qCalmNote">{reassuranceLine}</p>
        <p className="qRequiredLegend">{requiredLegend}</p>

        <div className="qLayout">
          <section className="qSection" id="q-concerns">
            <h3 className="qSectionTitle">{qFields.primaryConcernsTitle}</h3>
            <fieldset className={getFieldsetClassName("main_support_area")}>
              <legend className="qLabel">
                {qFields.mainAreaLabel} {renderRequiredIndicator()}
              </legend>
              <div className="qOptions qOptions--choices">
                {qOptions.supportAreas.map((item) => (
                  <label key={item} className="qOption qOption--choice">
                    <input
                      type="radio"
                      name="main_support_area"
                      value={item}
                      {...getInputErrorProps("main_support_area")}
                    />
                    <span className="qOptionText">{item}</span>
                  </label>
                ))}
              </div>
              {renderFieldError("main_support_area")}
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

            <fieldset className={getFieldsetClassName("challenge_duration")}>
              <legend className="qLabel">
                {qFields.durationLabel} {renderRequiredIndicator()}
              </legend>
              <div className="qOptions">
                {qOptions.durationOptions.map((item) => (
                  <label key={item} className="qOption">
                    <input
                      type="radio"
                      name="challenge_duration"
                      value={item}
                      {...getInputErrorProps("challenge_duration")}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {renderFieldError("challenge_duration")}
            </fieldset>

            <fieldset className={getFieldsetClassName("impact_level")}>
              <legend className="qLabel">
                {qFields.impactLabel} {renderRequiredIndicator()}
              </legend>
              <div className="qOptions">
                {qOptions.impactOptions.map((item) => (
                  <label key={item} className="qOption">
                    <input
                      type="radio"
                      name="impact_level"
                      value={item}
                      {...getInputErrorProps("impact_level")}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {renderFieldError("impact_level")}
            </fieldset>
          </section>

          <section className="qSection" id="q-health">
            <h3 className="qSectionTitle">{qFields.healthHabitsTitle}</h3>
            <p className="qSectionHint">
              {qFields.healthHabitsHint || "Please answer based on your current experience."}
            </p>
            <fieldset className={getFieldsetClassName("physical_health")}>
              <legend className="qLabel">
                {qFields.physicalHealthLabel} {renderRequiredIndicator()}
              </legend>
              <div className="qOptions qOptionsInline">
                {qOptions.healthRatings.map((item) => (
                  <label key={`physical-${item}`} className="qOption">
                    <input
                      type="radio"
                      name="physical_health"
                      value={item}
                      {...getInputErrorProps("physical_health")}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {renderFieldError("physical_health")}
            </fieldset>

            <fieldset className={getFieldsetClassName("sleep_habits")}>
              <legend className="qLabel">
                {qFields.sleepHabitsLabel} {renderRequiredIndicator()}
              </legend>
              <div className="qOptions qOptionsInline">
                {qOptions.healthRatings.map((item) => (
                  <label key={`sleep-${item}`} className="qOption">
                    <input
                      type="radio"
                      name="sleep_habits"
                      value={item}
                      {...getInputErrorProps("sleep_habits")}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {renderFieldError("sleep_habits")}
            </fieldset>

            <fieldset className={getFieldsetClassName("eating_habits")}>
              <legend className="qLabel">
                {qFields.eatingHabitsLabel} {renderRequiredIndicator()}
              </legend>
              <div className="qOptions qOptionsInline">
                {qOptions.healthRatings.map((item) => (
                  <label key={`eating-${item}`} className="qOption">
                    <input
                      type="radio"
                      name="eating_habits"
                      value={item}
                      {...getInputErrorProps("eating_habits")}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {renderFieldError("eating_habits")}
            </fieldset>

            <fieldset className={getFieldsetClassName("alcohol_frequency")}>
              <legend className="qLabel">
                {qFields.alcoholLabel} {renderRequiredIndicator()}
              </legend>
              <div className="qOptions qOptionsInline">
                {qOptions.frequencyOptions.map((item) => (
                  <label key={`alcohol-${item}`} className="qOption">
                    <input
                      type="radio"
                      name="alcohol_frequency"
                      value={item}
                      {...getInputErrorProps("alcohol_frequency")}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {renderFieldError("alcohol_frequency")}
            </fieldset>

            <fieldset className={getFieldsetClassName("recreational_drug_use")}>
              <legend className="qLabel">
                {qFields.drugUseLabel} {renderRequiredIndicator()}
              </legend>
              <div className="qOptions qOptionsInline">
                {qOptions.frequencyOptions.map((item) => (
                  <label key={`drugs-${item}`} className="qOption">
                    <input
                      type="radio"
                      name="recreational_drug_use"
                      value={item}
                      {...getInputErrorProps("recreational_drug_use")}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {renderFieldError("recreational_drug_use")}
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
            <p className="qSectionHint">
              {qFields.careHistoryHint ||
                "This information helps us better understand your needs."}
            </p>
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

            <fieldset className={getFieldsetClassName("availability")}>
              <legend className="qLabel">
                {qFields.availabilityLabel} {renderRequiredIndicator()}
              </legend>
              <div className="qOptions">
                {qOptions.availabilityOptions.map((item) => (
                  <label key={`availability-${item}`} className="qOption">
                    <input
                      type="radio"
                      name="availability"
                      value={item}
                      {...getInputErrorProps("availability")}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {renderFieldError("availability")}
            </fieldset>

            <label className="qLabel" htmlFor="best_phone_number">
              {qFields.bestPhoneLabel} {renderRequiredIndicator()}
            </label>
            <input
              id="best_phone_number"
              type="tel"
              name="best_phone_number"
              className={hasFieldError("best_phone_number") ? "qInputInvalid" : undefined}
              {...getInputErrorProps("best_phone_number")}
            />
            {renderFieldError("best_phone_number")}

            <label
              className={hasFieldError("intake_completed") ? "qConfirm qConfirmInvalid" : "qConfirm"}
            >
              <input type="checkbox" name="intake_completed" {...getInputErrorProps("intake_completed")} />
              <span>{qFields.confirmationLabel}</span>
            </label>
            {renderFieldError("intake_completed")}
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

      {submitState === "error" && submitError && (
        <p className="contactFormStatus contactFormStatusError" role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}
