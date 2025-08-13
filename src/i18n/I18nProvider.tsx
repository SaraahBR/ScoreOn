"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "./index";
import { useEffect, useState } from "react";

export default function I18nProvider({
  children,
  initialLanguage = "pt",
}: {
  children: React.ReactNode;
  initialLanguage?: string;
}) {
  const [ready, setReady] = useState(i18n.isInitialized);

  useEffect(() => {
    const init = async () => {
      if (i18n.language !== initialLanguage) {
        await i18n.changeLanguage(initialLanguage);
      }
      setReady(true);
    };
    init();
  }, [initialLanguage]);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
