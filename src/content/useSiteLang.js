import {
  createElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { siteText } from "./siteText";

const SiteLangContext = createContext(null);

export function SiteLangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  // Detect /vi in HashRouter: location.hash looks like "#/vi" or "#/vi/anything"
  const routeLang = useMemo(() => {
    const hash = window.location.hash || "";
    return hash.startsWith("#/vi") ? "vi" : hash.startsWith("#/en") ? "en" : null;
  }, []);

  // If route says /vi, force lang to vi (same for /en if you want)
  useEffect(() => {
    if (routeLang && routeLang !== lang) setLang(routeLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeLang]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const text = siteText?.[lang] ?? siteText.en;

  const toggleLang = () => {
    const next = lang === "en" ? "vi" : "en";
    setLang(next);

    // Optional: also change route so URL matches language
    // If you're using HashRouter, update hash:
    if (next === "vi") window.location.hash = "#/vi";
    else window.location.hash = "#/";
  };

  const value = useMemo(() => ({ lang, text, toggleLang }), [lang, text]);

  return createElement(SiteLangContext.Provider, { value }, children);
}

export function useSiteLang() {
  const ctx = useContext(SiteLangContext);
  if (!ctx) {
    throw new Error("useSiteLang must be used within <SiteLangProvider>");
  }
  return ctx;
}
