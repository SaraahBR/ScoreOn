"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import { SessionProvider } from "next-auth/react";
import I18nProvider from "../i18n/I18nProvider";

export default function ClientProviders({
  children,
  initialLanguage = "pt",
}: {
  children: ReactNode;
  initialLanguage?: string;
}) {
  return (
    <SessionProvider>
      <I18nProvider initialLanguage={initialLanguage}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </I18nProvider>
    </SessionProvider>
  );
}
