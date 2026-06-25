# Plano: Correção das Instruções de Delegação de Agentes

## Problema

O agente IA (MiMoCode) continua errando na chamada do `actor` tool, passando `operation` como string em vez de objeto, mesmo com instruções corretas nos arquivos.

## Causa Raiz

1. As instruções existentes são corretas mas não são suficientemente "in-your-face"
2. O formato de chamada da tool no system prompt pode causar confusão
3. Falta um "quick reference" que seja o primeiro thing que o agente veja

## Solução

Atualizar 3 arquivos para tornar as instruções mais impossíveis de errar:

### 1. AGENTS.md
- Adicionar seção "ANTI-PATTERN" no topo da seção de delegação
- Exemplos com código JSON real, não só pseudo-código
- Adicionar "BLOQUEIO: Se receber erro, NÃO tentar de novo sem reler o schema"

### 2. CLAUDE.md
- Adicionar seção "DELEGAÇÃO: ERRO CONHECIDO" com o padrão exato
- Tornar o checklist mais visual

### 3. agent-delegation SKILL.md
- Adicionar "QUICK REFERENCE" no topo
- Exemplos com formatação de código mais clara
- Adicionar "STOP: Se收到 erro, volte aqui"

## Arquivos a Modificar

1. `AGENTS.md` — Seção "Contrato de Invocação de Agentes"
2. `CLAUDE.md` — Seção "Guardrails Para Chamada de Agentes"
3. `.agents/skills/agent-delegation/SKILL.md` — Topo do arquivo

## Verificação

- Ler os 3 arquivos após edição
- Verificar que os exemplos estão corretos
- Confirmar que o formato é consistente entre os arquivos
