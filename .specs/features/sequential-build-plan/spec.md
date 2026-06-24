# Spec — Plano Sequencial de Construcao

## Contexto

O usuario pediu um plano sequencial canonico para a construcao do projeto, com:

- contexto obrigatorio sobre a ordem do plano;
- local unico para encontrar os planos individuais;
- um arquivo `.md` para cada plano;
- execucao operacional baseada em um agente por ponto;
- processamento estritamente sequencial: concluir um ponto, depois puxar o seguinte.

## Objetivo

Criar documentacao operacional para execucao futura do projeto por etapas, sem implementar as features agora.

## Requisitos

### PLAN-001 — Indice Mestre

Criar um documento mestre que explique:

- a ordem obrigatoria;
- o local dos planos individuais;
- como executar o processo sequencialmente;
- a regra de um agente por ponto.

### PLAN-002 — Um Arquivo por Ponto

Cada ponto do plano deve ter seu proprio arquivo `.md`.

### PLAN-003 — Sequencia Obrigatoria

O pacote deve deixar claro que nao se deve abrir multiplos pontos ao mesmo tempo. A execucao e:

1. spawn um agente para o ponto atual;
2. executar;
3. validar;
4. consolidar;
5. seguir para o proximo ponto.

### PLAN-004 — Aderencia ao Estado Atual

Os pontos do plano devem refletir a realidade atual do projeto: MVP parcial, lacunas de testes, workflow engine ausente, orchestrator ausente, MCP parcial e integracoes ainda nao implementadas.

## Criterios de Aceite

- Existe um diretorio unico com o plano mestre e os planos individuais.
- Cada plano possui objetivo, escopo, entradas, saidas e criterio de conclusao.
- A ordem de execucao esta explicita.
