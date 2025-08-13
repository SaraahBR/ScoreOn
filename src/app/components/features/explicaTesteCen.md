## Cenário do Teste

### Features

1. O componente Features exibe uma seção com cards que apresentam os principais requisitos tecnológicos da aplicação. Cada card contém um ícone, um título e uma descrição. O cenário de testes se concentra em garantir que todos os cards sejam renderizados corretamente e que seus conteúdos estejam visíveis para o usuário.

- **Renderização dos Cards:** O teste verifica se todos os títulos e descrições dos cards definidos no array de itens aparecem na tela.
- **Estrutura Visual:** Garante que cada card possui o ícone correspondente, o título e a descrição, mantendo a consistência visual da seção.
- **Acessibilidade:** O teste garante que os elementos importantes (títulos e descrições) estejam acessíveis, por exemplo, usando roles ou aria-labels.
- **Manutenção:** Caso novos requisitos tecnológicos sejam adicionados ao array de itens, o teste deve ser atualizado para garantir que todos os novos cards também sejam exibidos corretamente.

#### Incrementos implementados no teste:
- Verifica se a quantidade de cards renderizados corresponde ao número de itens no array.
- Garante que os ícones estejam presentes nos cards (verificando elementos svg com data-testid).

#### Exemplo de incremento no teste:
```tsx
const cards = screen.getAllByRole('heading', { level: 3 });
expect(cards.length).toBe(3); // ou o número de itens no array
```

#### Observação
Se novos cards forem adicionados ao componente, lembre-se de atualizar o teste para garantir cobertura total.
