const SUPPORTED_INTAKE_VALIDATION_STYLES = ["v1", "v2", "v3", "v4", "v5"];
const DEFAULT_INTAKE_VALIDATION_STYLE = "v1";

function normalizeStyle(style) {
  return String(style || "")
    .trim()
    .toLowerCase();
}

function isSupportedStyle(style) {
  return SUPPORTED_INTAKE_VALIDATION_STYLES.includes(style);
}

export function resolveIntakeValidationStyle({ preset, search = "" } = {}) {
  const normalizedPreset = normalizeStyle(preset);
  if (isSupportedStyle(normalizedPreset)) {
    return normalizedPreset;
  }

  const styleFromQuery = normalizeStyle(new URLSearchParams(search).get("validationStyle"));
  if (isSupportedStyle(styleFromQuery)) {
    return styleFromQuery;
  }

  const styleFromEnv = normalizeStyle(import.meta.env.VITE_INTAKE_VALIDATION_STYLE);
  if (isSupportedStyle(styleFromEnv)) {
    return styleFromEnv;
  }

  return DEFAULT_INTAKE_VALIDATION_STYLE;
}
