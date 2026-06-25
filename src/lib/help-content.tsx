import React from "react";

interface HelpContent {
  title: string;
  content: React.ReactNode;
}

export const helpContentByRoute: Record<string, HelpContent> = {
  "/": {
    title: "Painel",
    content: (
      <div className="space-y-3">
        <h3 className="font-medium text-ink">O que é</h3>
        <p className="text-muted">Visão geral do sistema com métricas principais de leads, agentes e execuções.</p>
        <h3 className="font-medium text-ink">Como usar</h3>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Os cards mostram totais de leads, qualificações e execuções</li>
          <li>Gráficos mostram evolução de leads ao longo do tempo</li>
          <li>O gráfico de performance mostra execuções por agente</li>
          <li>A feed de atividade lista eventos recentes do sistema</li>
        </ul>
      </div>
    ),
  },
  "/agents": {
    title: "Agentes",
    content: (
      <div className="space-y-3">
        <h3 className="font-medium text-ink">O que é</h3>
        <p className="text-muted">Lista e gerencia todos os agentes de IA cadastrados no sistema.</p>
        <h3 className="font-medium text-ink">Como usar</h3>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Use os filtros para ver todos, apenas ativos ou inativos</li>
          <li>Clique em um agente para ver seus detalhes e versões</li>
          <li>Clique em &quot;Criar Agente&quot; para adicionar um novo agente</li>
          <li>O badge indica se o agente está ativo ou inativo</li>
        </ul>
      </div>
    ),
  },
  "/agents/new": {
    title: "Novo Agente",
    content: (
      <div className="space-y-3">
        <h3 className="font-medium text-ink">O que é</h3>
        <p className="text-muted">Formulário para criar um novo agente de IA com suas configurações.</p>
        <h3 className="font-medium text-ink">Como usar</h3>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Preencha o nome, descrição e modelo do agente</li>
          <li>Defina o system prompt que orienta o comportamento do agente</li>
          <li>Configure as ferramentas (MCP tools) que o agente pode utilizar</li>
          <li>Salve para criar o agente ou cancele para voltar</li>
        </ul>
      </div>
    ),
  },
  "/leads": {
    title: "Leads",
    content: (
      <div className="space-y-3">
        <h3 className="font-medium text-ink">O que é</h3>
        <p className="text-muted">Lista e gerencia todos os leads captados pelo sistema.</p>
        <h3 className="font-medium text-ink">Como usar</h3>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Filtre leads por status: todos, qualificados, pendentes, etc.</li>
          <li>Clique em um lead para ver detalhes, histórico e ações</li>
          <li>Clique em &quot;Novo Lead&quot; para cadastrar manualmente</li>
          <li>O status indica o estágio atual do lead no funil</li>
        </ul>
      </div>
    ),
  },
  "/leads/new": {
    title: "Novo Lead",
    content: (
      <div className="space-y-3">
        <h3 className="font-medium text-ink">O que é</h3>
        <p className="text-muted">Formulário para cadastrar um novo lead manualmente.</p>
        <h3 className="font-medium text-ink">Como usar</h3>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Preencha os dados de contato: nome, email, telefone</li>
          <li>Adicione informações da empresa quando disponível</li>
          <li>Selecione a origem do lead (webhook, formulário, manual)</li>
          <li>Salve para criar o lead no sistema</li>
        </ul>
      </div>
    ),
  },
  "/conversations": {
    title: "Conversas",
    content: (
      <div className="space-y-3">
        <h3 className="font-medium text-ink">O que é</h3>
        <p className="text-muted">Visualiza e gerencia todas as conversas com leads e clientes.</p>
        <h3 className="font-medium text-ink">Como usar</h3>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Selecione uma conversa na lista para ver o histórico completo</li>
          <li>As conversas mostram mensagens trocadas com o lead</li>
          <li>Filtre por status: abertas, arquivadas, etc.</li>
          <li>O badge indica novas mensagens não lidas</li>
        </ul>
      </div>
    ),
  },
  "/runs": {
    title: "Executar Agente",
    content: (
      <div className="space-y-3">
        <h3 className="font-medium text-ink">O que é</h3>
        <p className="text-muted">Execute um agente de IA manualmente com parâmetros específicos.</p>
        <h3 className="font-medium text-ink">Como usar</h3>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Selecione o agente que deseja executar</li>
          <li>Forneça o lead ou contexto para a execução</li>
          <li>Configure parâmetros adicionais se necessário</li>
          <li>Clique em &quot;Executar&quot; para iniciar a tarefa do agente</li>
        </ul>
      </div>
    ),
  },
  "/runs/history": {
    title: "Histórico de Execuções",
    content: (
      <div className="space-y-3">
        <h3 className="font-medium text-ink">O que é</h3>
        <p className="text-muted">Histórico de todas as execuções de agentes realizadas no sistema.</p>
        <h3 className="font-medium text-ink">Como usar</h3>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Visualize execuções passadas com status e resultados</li>
          <li>Filtre por agente, status ou período</li>
          <li>Clique em uma execução para ver logs detalhados</li>
          <li>Identifique falhas e gargalos nas execuções</li>
        </ul>
      </div>
    ),
  },
  "/settings": {
    title: "Configurações",
    content: (
      <div className="space-y-3">
        <h3 className="font-medium text-ink">O que é</h3>
        <p className="text-muted">Configurações gerais da plataforma Orun.AI.</p>
        <h3 className="font-medium text-ink">Como usar</h3>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Acesse subcategorias: Perfil e Integrações</li>
          <li>Configure preferências da conta</li>
          <li>Gerencie chaves de API e tokens de acesso</li>
          <li>As alterações são salvas automaticamente</li>
        </ul>
      </div>
    ),
  },
  "/settings/profile": {
    title: "Perfil",
    content: (
      <div className="space-y-3">
        <h3 className="font-medium text-ink">O que é</h3>
        <p className="text-muted">Gerencie as informações do seu perfil de usuário.</p>
        <h3 className="font-medium text-ink">Como usar</h3>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Atualize nome, email e informações pessoais</li>
          <li>Altere sua senha de acesso</li>
          <li>Configure preferências de notificação</li>
          <li>Salve as alterações para aplicar</li>
        </ul>
      </div>
    ),
  },
  "/settings/integrations": {
    title: "Integrações",
    content: (
      <div className="space-y-3">
        <h3 className="font-medium text-ink">O que é</h3>
        <p className="text-muted">Gerencie integrações com serviços externos via MCP.</p>
        <h3 className="font-medium text-ink">Como usar</h3>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Configure conexões com WhatsApp, Google Calendar, etc.</li>
          <li>Adicione chaves de API para cada integração</li>
          <li>Teste a conexão antes de ativar</li>
          <li>Desative integrações sem remover a configuração</li>
        </ul>
      </div>
    ),
  },
};

export function getHelpForRoute(pathname: string): HelpContent | null {
  if (helpContentByRoute[pathname]) {
    return helpContentByRoute[pathname];
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 2) {
    const dynamicKey = `/${segments[0]}/[id]`;
    if (helpContentByRoute[dynamicKey]) {
      return helpContentByRoute[dynamicKey];
    }
  }

  return null;
}
