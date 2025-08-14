import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";

import NoSSR from "./NoSSR";                       
import ClientProviders from "./ClientProviders";   
import Navbar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";

export const metadata: Metadata = {
  title: "ScoreOn",
  description: "Sistema de Controle de Notas de Alunos",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("i18next")?.value ?? "pt";
  const lng = raw.split("-")[0];

  return (
    <html lang={lng} suppressHydrationWarning>
      <body style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
        <NoSSR>
          <ClientProviders initialLanguage={lng}>
            <Navbar />
            <main id="site-main" style={{ flex: 1 }}>{children}</main>
            <Footer />
          </ClientProviders>
        </NoSSR>
      </body>
    </html>
  );
}