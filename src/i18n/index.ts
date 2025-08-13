import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

export const defaultNS = "common";

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "pt",
      supportedLngs: ["pt", "en", "es"],
      ns: [defaultNS],
      defaultNS,
      backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
      detection: { order: ["cookie", "htmlTag"], caches: ["cookie"] },
      interpolation: { escapeValue: false },
      returnNull: false,
      load: "currentOnly",
      react: { useSuspense: false },
    });
}

export default i18n;
