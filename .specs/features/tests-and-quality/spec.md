# Tests and Quality

## Contexto

O ponto canonico `docs/plans/sequential-build/02-tests-and-quality.md` vem logo apos a estabilizacao inicial do MVP. Agora precisamos transformar os bugs corrigidos e os fluxos centrais atuais em protecao automatica e padroes minimos de qualidade.

## Complexidade

Medium.

Justificativa:
- cobre varios modulos, mas todos dentro da mesma frente de testes e tooling;
- nao exige nova arquitetura de produto;
- o escopo e claro: testes centrais, mocks reutilizaveis e revisao da estrategia de qualidade.

## Objetivo

Criar a primeira camada real de testes e padroes de qualidade para impedir regressao dos fluxos centrais do MVP atual.

## Requisitos

- TQ-01: criar testes unitarios reais para `LeadIntakeAgent`.
- TQ-02: criar testes unitarios reais para `QualificationAgent`.
- TQ-03: criar testes para `runAgent`.
- TQ-04: criar testes para o webhook de leads.
- TQ-05: criar testes para actions centrais de leads.
- TQ-06: formalizar um padrao reutilizavel de mocks para DB e dependencias externas.
- TQ-07: revisar e documentar a estrategia atual de lint e typecheck no contexto do projeto.

## Verificacao

- `npm test` deve executar testes reais e deixar de falhar por ausencia de arquivos.
- Os fluxos centrais do MVP devem ter cobertura minima automatizada.
- O padrao de mocks e setup precisa ficar documentado.
- Rodar `npm test`, `npm run build`, `npm run lint` e `npm run typecheck` antes de concluir.
