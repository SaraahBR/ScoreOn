import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "./ClientProviders";
import Navbar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";

export const metadata: Metadata = {
  title: "ScoreOn",
  description: "Sistema de Controle de Notas de Alunos",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientProviders>
          <Navbar />
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}