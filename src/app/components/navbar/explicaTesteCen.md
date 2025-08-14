# Cenário de Teste: Troca de Idioma na NavBar (foco: botão 'Quem Somos')

## Objetivo
Garantir que a NavBar permite ao usuário alternar entre os idiomas suportados (português, inglês e espanhol), refletindo corretamente as traduções na interface, especificamente no botão "Quem Somos" (que vira "About" ou "Quiénes Somos").

## Contexto
- O sistema utiliza i18next para internacionalização.
- Os botões de idioma são exibidos na NavBar, cada um com um `aria-label` específico.
- As traduções estão disponíveis em memória no teste, para pt, en e es.
- O componente `ProfileMenu` é mockado para isolar o teste de autenticação.

## Pré-condições
- O i18n está inicializado com os idiomas e traduções mínimas necessárias.
- O componente NavBar está renderizado dentro de um ThemeProvider do MUI e I18nextProvider.

## Passos do Cenário
1. Renderizar a NavBar com o idioma padrão (português).
2. Verificar se o botão de idioma inglês está presente (aria-label: "Mudar idioma para English (US)").
3. Clicar no botão de idioma inglês.
4. Verificar se o idioma atual do i18n mudou para "en".
5. Verificar se o texto "About" aparece na interface (indicando que a tradução foi aplicada no botão "Quem Somos").
6. (Opcional) Repetir o processo para o idioma espanhol, verificando o texto "Quiénes Somos".

## Resultados Esperados
- Após clicar no botão de idioma, a interface deve refletir a tradução correspondente ao idioma selecionado, especificamente no botão "Quem Somos".
- O idioma atual do i18n deve ser atualizado corretamente.
- O texto do botão "Quem Somos" deve ser exibido no idioma escolhido ("About" ou "Quiénes Somos").

## Observações
- O teste utiliza queries acessíveis (aria-label, getAllByText) para garantir robustez.
- O ambiente de teste é isolado de dependências externas (traduções em memória, ProfileMenu mockado).
- O teste cobre apenas o fluxo de troca de idioma no botão "Quem Somos" da NavBar. Para testar outras páginas ou textos, é necessário criar cenários adicionais.
