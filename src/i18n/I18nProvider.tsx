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
    let mounted = true;

    const ensure = async () => {
      const target = initialLanguage.split("-")[0];

      if (!i18n.isInitialized) {
        await new Promise<void>((resolve) => {
          i18n.on("initialized", () => resolve());
        });
      }
      if (i18n.language !== target) {
        await i18n.changeLanguage(target);
      }
      if (mounted) setReady(true);
    };

    ensure();
    return () => {
      mounted = false;
    };
  }, [initialLanguage]);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
