# Plano Sequencial de Construcao — Orun.AI

## Contexto Obrigatorio

Este diretorio contem o **plano canonico de construcao sequencial** do projeto.

### Regra de Ordem

A ordem dos planos e obrigatoria. Nao devemos abrir varios pontos em paralelo. O fluxo correto e:

1. ler este arquivo;
2. abrir o plano atual pelo numero;
3. spawnar **um agente para aquele ponto**;
4. executar somente aquele ponto;
5. validar e consolidar o resultado;
6. marcar o ponto como concluido;
7. puxar o proximo plano.

### Onde Encontrar os Planos Individuais

Todos os planos individuais ficam neste diretorio:

`docs/plans/sequential-build/`

Arquivos:

1. `01-stabilize-mvp.md`
2. `02-tests-and-quality.md`
3. `03-data-and-persistence.md`
4. `04-workflow-engine.md`
5. `05-orchestrator-core.md`
6. `06-mcp-and-integrations.md`
7. `07-commercial-agents.md`
8. `08-operations-and-security.md`
9. `09-ux-and-product-polish.md`
10. `10-release-readiness.md`

## Protocolo de Execucao

### Regra Principal

**Spawn one agent per point, executar um e depois puxar o outro, ate concluir.**

### Contrato Operacional

Para cada ponto:

* um agente recebe o arquivo do plano atual;
* esse agente executa apenas o escopo daquele arquivo;
* o resultado volta para consolidacao no repo principal;
* so depois de validado seguimos para o proximo.

### O que Nao Fazer

* nao executar dois pontos ao mesmo tempo;
* nao misturar mudancas de pontos diferentes no mesmo ciclo;
* nao pular ordem sem registrar decisao explicita;
* nao abrir implementacao grande sem criterio de saida e verificacao.

## Ordem Recomendada

### 01. Estabilizar o MVP atual

Corrigir os bugs e divergencias ja existentes no fluxo principal.

### 02. Cobertura de testes e qualidade

Criar a base de testes para parar de quebrar fluxos centrais sem perceber.

### 03. Dados e persistencia

Endurecer schema, migracoes e politicas de armazenamento.

### 04. Workflow Engine

Construir o motor minimo para fluxos pausaveis, retomaveis e auditaveis.

### 05. Orchestrator Core

Criar o cerebro operacional que planeja, delega e consolida.

### 06. MCP e Integracoes

Transformar a camada MCP de stub em contrato executavel.

### 07. Agentes Comerciais

Expandir os agentes de dominio alem de lead intake e qualification.

### 08. Operacao e Seguranca

Adicionar auth, governanca, mascaramento e controles.

### 09. UX e Product Polish

Fechar os gaps de experiencia para uso profissional.

### 10. Release Readiness

Preparar o sistema para entrega sustentavel e execucao recorrente.

## Como Usar Este Pacote

Quando formos executar:

1. abrir `README.md`;
2. pegar o primeiro arquivo nao concluido;
3. passar esse arquivo ao agente executor;
4. esperar a consolidacao e validacao;
5. seguir para o proximo.

## Fonte da Sequencia

Esta ordem foi derivada da auditoria em `docs/codex-report/` e do estado atual do produto: MVP parcial, lacunas de teste, workflow/orchestrator ausentes, MCP incompleto e necessidade de confiabilidade antes de expansao.
