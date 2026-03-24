export const INTAKE_SUCCESS_MODES = Object.freeze(["v4"]);

const DEFAULT_MODE = "v4";

const SUCCESS_REDIRECT_BY_MODE = Object.freeze({
  v4: "/form-success-v4",
});

function normalizeMode(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isSupportedMode(mode) {
  return INTAKE_SUCCESS_MODES.includes(mode);
}

export function resolveIntakeSuccessMode(search = "") {
  const modeFromQuery = normalizeMode(new URLSearchParams(search).get("successMode"));
  if (isSupportedMode(modeFromQuery)) {
    return modeFromQuery;
  }

  const modeFromEnv = normalizeMode(import.meta.env.VITE_INTAKE_SUCCESS_MODE);
  if (isSupportedMode(modeFromEnv)) {
    return modeFromEnv;
  }

  return DEFAULT_MODE;
}

export function getIntakeSuccessRedirectPath(mode) {
  const normalizedMode = normalizeMode(mode);
  return SUCCESS_REDIRECT_BY_MODE[normalizedMode] || null;
}
