# DESIGN.md — Orun.AI

## Origem da Identidade

A identidade visual do Orun.AI deriva do chat original consolidado nos documentos base.

O nome **Orun.AI** foi escolhido por sua associação simbólica com Orun/Orunmilá/Ifá: sabedoria, visão, leitura de caminhos e orientação. A marca usa essa inspiração de forma respeitosa e metafórica, sem representar culto religioso, promessa espiritual ou adivinhação literal.

O conceito institucional selecionado foi:

> Visão além do tempo. Inteligência além do óbvio.

A direção visual escolhida no chat foi a primeira opção de logo: **visão cósmica**, com um olho abstrato, atmosfera de céu profundo e detalhes dourados. Ela comunica inteligência, profundidade, confiança e leitura estratégica.

---

## Personalidade Visual

Orun.AI deve parecer:

* sábio, mas não místico demais;
* sofisticado, mas funcional;
* tecnológico, mas humano;
* confiável, auditável e estratégico;
* brasileiro em origem, global em ambição.

Evitar:

* estética esotérica literal;
* excesso de símbolos religiosos;
* promessas de clarividência;
* visual genérico de SaaS azul;
* gradientes roxos/azuis dominantes sem identidade própria;
* landing pages que pareçam apenas marketing quando o contexto pedir uma ferramenta real.

---

## Paleta Principal

| Token | Hex | Uso |
|---|---:|---|
| `orun-night` | `#0C0F1C` | Fundo institucional escuro, hero, sidebar premium |
| `orun-gold` | `#C7A347` | Marca, detalhes nobres, estados de destaque |
| `orun-gold-soft` | `#D4AF37` | Hover, ilustrações, brilhos discretos |
| `orun-white` | `#F5F5F5` | Texto em fundo escuro |
| `orun-ink` | `#111827` | Texto em fundo claro |
| `orun-slate` | `#3A4055` | Texto secundário escuro |
| `orun-mist` | `#EEF1F6` | Superfície clara |
| `orun-line` | `#D8DCE7` | Bordas e divisores |
| `orun-success` | `#22C55E` | Sucesso |
| `orun-warning` | `#F59E0B` | Atenção |
| `orun-error` | `#EF4444` | Erro |

### Proporção Recomendada

* Produto operacional: predominância clara, com `orun-night` em navegação e `orun-gold` como acento.
* Institucional/hero: `orun-night` predominante, `orun-gold` para marca e CTAs, `orun-white` para leitura.

---

## Tipografia

### Marca e Títulos Institucionais

Preferência:

* `Cormorant Garamond`
* `Playfair Display`
* `EB Garamond`

Uso:

* logotipo;
* títulos institucionais;
* frases de impacto;
* materiais comerciais.

Configuração:

* peso 600-700;
* tracking leve, entre `0.02em` e `0.06em`, apenas em marca/títulos curtos;
* evitar texto longo em fonte serifada ornamental.

### Produto e Interface

Preferência:

* `Inter`
* `Open Sans`
* system sans-serif como fallback.

Uso:

* dashboard;
* formulários;
* tabelas;
* logs;
* navegação;
* componentes operacionais.

---

## Componentes e UI

### Botões

* Primário institucional: fundo `orun-gold`, texto `orun-night`.
* Primário de produto: fundo `orun-night`, texto branco.
* Secundário: fundo claro, borda `orun-line`, texto `orun-ink`.
* Ações destrutivas: usar vermelho apenas quando a ação for realmente irreversível.

### Cards

* Raio máximo recomendado: `8px`.
* Usar cards para itens repetidos, métricas, modais e ferramentas.
* Evitar cards dentro de cards.
* Seções de página devem ser layouts ou bandas, não pilhas de cartões decorativos.

### Dashboard

Dashboards devem priorizar leitura rápida:

* métricas densas e escaneáveis;
* gráficos simples;
* activity feed auditável;
* filtros claros;
* links para detalhes.

Evitar estética de landing page dentro do dashboard.

### Workflows

Representações visuais de workflow devem mostrar:

* trigger;
* agentes envolvidos;
* integrações MCP;
* pontos de pausa/handoff;
* estados de execução;
* logs e resultado final.

---

## Símbolos e Iconografia

Símbolos permitidos:

* olho abstrato;
* círculo/caminhos;
* céu estrelado minimalista;
* linhas orbitais;
* nós conectados;
* referência sutil a tabuleiro/caminhos, sem copiar símbolos sagrados.

Preferir ícones de biblioteca para interface operacional. Símbolos próprios devem ficar restritos a marca, hero, empty states especiais e materiais institucionais.

---

## Tom de Voz

Orun.AI fala como uma plataforma confiável de decisão e automação:

* claro;
* estratégico;
* preciso;
* respeitoso;
* sem exageros mágicos;
* sem prometer autonomia absoluta.

Exemplos:

* "Automatize a operação comercial com agentes auditáveis."
* "Cada decisão com contexto, histórico e possibilidade de revisão humana."
* "Agentes especializados para qualificar leads, preparar reuniões e manter o pipeline em movimento."

Evitar:

* "prever o futuro com certeza";
* "substituir sua equipe";
* "agentes totalmente autônomos";
* linguagem religiosa aplicada ao produto.

---

## Aplicação em Produto

O produto deve transmitir força operacional. Para páginas internas:

* usar layout denso e organizado;
* reduzir ornamentos;
* destacar status, próximos passos e ações;
* registrar contexto e decisões;
* manter idioma principal em português brasileiro.

Para páginas públicas:

* hero com a marca como primeiro sinal;
* fundo visual real ou gerado, não apenas gradiente abstrato;
* texto institucional curto;
* CTA direto para demonstração ou acesso.

---

## Critérios de Qualidade Visual

Toda nova tela deve:

* ter hierarquia clara;
* funcionar em mobile e desktop;
* não depender só de cor para comunicar estado;
* não cortar texto;
* não sobrepor elementos;
* evitar paleta de uma nota só;
* respeitar contraste;
* deixar evidente o estado da entidade: lead, agente, workflow ou run.
