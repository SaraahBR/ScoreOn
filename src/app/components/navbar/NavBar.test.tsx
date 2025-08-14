// Mock ProfileMenu para evitar dependência do next-auth
jest.mock("../../login/profilemenu", () => () => <div data-testid="profile-menu-mock" />);
// Mock useMediaQuery para garantir que as bandeiras aparecem na barra principal
jest.mock("@mui/material/useMediaQuery", () => () => false);

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./NavBar";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Mock next/image para ambiente de teste
jest.mock("next/image", () => (props: any) => {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...props} />;
});

describe("Navbar i18n integration", () => {
  beforeAll(async () => {
    await i18n
      .use(initReactI18next)
      .init({
        lng: "pt",
        fallbackLng: "pt",
  supportedLngs: ["pt", "en", "es"],
        ns: ["common"],
        defaultNS: "common",
        resources: {
          pt: {
            common: {
              appName: "ScoreOn",
              navbar: {
                home: "Início",
                about: "Quem Somos"
              }
            }
          },
          en: {
            common: {
              appName: "ScoreOn",
              navbar: {
                home: "Home",
                about: "About"
              }
            }
          },
          es: {
            common: {
              appName: "ScoreOn",
              navbar: {
                home: "Inicio",
                about: "Quiénes Somos"
              }
            }
          }
        },
        react: { useSuspense: false },
      });
  });

  beforeEach(() => {
    i18n.changeLanguage("pt");
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    const theme = createTheme();
    return render(
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
      </ThemeProvider>
    );
  };

  it("altera o idioma ao clicar na bandeira e reflete na interface", async () => {
    renderWithProviders(<Navbar />);


  // Aguarda todos os botões de inglês aparecerem (pode haver mais de um)
  const enBtns = await screen.findAllByLabelText(/Mudar idioma para English \(US\)/i);
  expect(enBtns.length).toBeGreaterThan(0);
  // Simula clique no primeiro botão de inglês
  await userEvent.click(enBtns[0]);

    // Aguarda a mudança de idioma
    expect(i18n.language).toBe("en");
  // Aqui você pode verificar se algum texto da NavBar mudou para inglês
  // Exemplo: se houver um link "Quem Somos" que vira "About"
  const aboutLinks = screen.getAllByText(/About/i);
  expect(aboutLinks.length).toBeGreaterThan(0);
  });
});
