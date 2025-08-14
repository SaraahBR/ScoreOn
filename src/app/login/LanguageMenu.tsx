"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const flags: Record<"pt" | "en" | "es", string> = {
  pt: "🇧🇷",
  en: "🇺🇸",
  es: "🇪🇸",
};

export default function LanguageMenu() {
  const { i18n } = useTranslation();

  const active = (i18n.resolvedLanguage || i18n.language || "pt").split("-")[0] as
    | "pt"
    | "en"
    | "es";

  useEffect(() => {
    document.documentElement.setAttribute("lang", active === "pt" ? "pt-BR" : active);
  }, [active]);

  const change = async (code: "pt" | "en" | "es") => {
    if (code === active) return;
    await i18n.changeLanguage(code);
    try {
      localStorage.setItem("i18nextLng", code);
      document.cookie = `i18next=${code};path=/;max-age=31536000`;
    } catch {}
    document.documentElement.setAttribute("lang", code === "pt" ? "pt-BR" : code);
  };

  const btnBase =
    "inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2";

  return (
    <div className="flex items-center gap-2">
      {(["pt", "en", "es"] as const).map((code) => (
        <button
          key={code}
          aria-label={`Mudar idioma para ${code.toUpperCase()}`}
          onClick={() => change(code)}
          className={btnBase}
          style={{ opacity: active === code ? 1 : 0.5 }}
          title={code.toUpperCase()}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{flags[code]}</span>
        </button>
      ))}
    </div>
  );
}
