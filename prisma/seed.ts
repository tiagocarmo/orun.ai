import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.scheduledTask.deleteMany();
  await prisma.documentChunk.deleteMany();
  await prisma.document.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.workflowRun.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.leadEvent.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.agentLog.deleteMany();
  await prisma.agentRun.deleteMany();
  await prisma.agentVersion.deleteMany();
  await prisma.agent.deleteMany();

  // Create agents
  const leadIntakeAgent = await prisma.agent.create({
    data: {
      name: "Lead Intake Agent",
      slug: "lead-intake",
      description: "Recebe e valida novos leads de formulários, webhooks e canais externos",
      prompt: `Você é um agente especializado em receber leads.
Analise os dados recebidos e crie um novo lead no sistema.
Valide dados mínimos (nome obrigatório, email ou telefone).
Verifique duplicidade por email ou telefone.
Registre o evento de criação.
Retorne o lead criado com a próxima ação sugerida.`,
      model: "gpt-4o",
    },
  });

  const qualificationAgent = await prisma.agent.create({
    data: {
      name: "Qualification Agent",
      slug: "qualification",
      description: "Qualifica leads com base em critérios comerciais e perfil do cliente",
      prompt: `Você é um agente de qualificação de leads.
Analise os dados do lead e o histórico de conversas.
Calcule um score de qualificação de 0 a 100.
Classifique o lead como: qualified, nurturing ou disqualified.
Explique o motivo da classificação.
Sugira a próxima ação.`,
      model: "gpt-4o",
    },
  });

  // Create agent versions
  await prisma.agentVersion.createMany({
    data: [
      { agentId: leadIntakeAgent.id, version: 1, prompt: leadIntakeAgent.prompt, model: leadIntakeAgent.model },
      { agentId: qualificationAgent.id, version: 1, prompt: qualificationAgent.prompt, model: qualificationAgent.model },
    ],
  });

  // Create leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        name: "João Silva",
        email: "joao@empresa.com.br",
        phone: "+5511999887766",
        company: "Tech Solutions Ltda",
        source: "website",
        externalId: "website:joao-silva",
        message: "Interessado em automação comercial",
        status: "new",
        metadata: JSON.stringify({ campaign: "homepage-demo" }),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Maria Santos",
        email: "maria@startup.com",
        phone: "+5511888776655",
        company: "Startup Inovação",
        source: "linkedin",
        message: "Preciso de qualificação de leads",
        status: "qualified",
        qualificationScore: 85,
        qualificationReason: "Empresa com 50+ funcionários, alto volume de leads",
        metadata: JSON.stringify({ campaign: "linkedin-outreach" }),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Pedro Costa",
        email: "pedro@comercio.com",
        company: "Comércio Express",
        source: "referral",
        status: "nurturing",
        qualificationScore: 45,
        qualificationReason: "Empresa pequena, volume baixo de leads",
        metadata: JSON.stringify({ referredBy: "parceiro-comercial" }),
      },
    }),
  ]);

  // Create lead events
  await prisma.leadEvent.createMany({
    data: [
      { leadId: leads[0].id, type: "created", data: JSON.stringify({ source: "website", externalId: "website:joao-silva" }) },
      { leadId: leads[1].id, type: "created", data: JSON.stringify({ source: "linkedin" }) },
      { leadId: leads[1].id, type: "qualified", data: JSON.stringify({ score: 85, reason: "Alto volume" }) },
      { leadId: leads[2].id, type: "created", data: JSON.stringify({ source: "referral" }) },
    ],
  });

  // Create conversations
  const conversation = await prisma.conversation.create({
    data: {
      leadId: leads[0].id,
      title: "Conversa inicial - João Silva",
    },
  });

  await prisma.message.createMany({
    data: [
      { conversationId: conversation.id, role: "user", content: "Olá, gostaria de saber mais sobre a plataforma" },
      { conversationId: conversation.id, role: "assistant", content: "Olá João! Claro, posso ajudá-lo. Nossa plataforma automatiza processos comerciais com agentes de IA." },
      { conversationId: conversation.id, role: "user", content: "Como funciona a qualificação de leads?" },
    ],
  });

  // Create workflows
  await prisma.workflow.create({
    data: {
      name: "Captura de Lead",
      slug: "lead-capture",
      description: "Workflow para receber e processar novos leads",
      steps: JSON.stringify([
        { type: "receive_lead", agent: "lead-intake" },
        { type: "validate", agent: "lead-intake" },
        { type: "deduplicate", agent: "lead-intake" },
        { type: "create_record", agent: "lead-intake" },
        { type: "trigger_qualification", agent: "qualification" },
      ]),
    },
  });

  // Create default settings
  const defaultSettings = [
    { key: "platform.name", value: "Orun.AI", type: "text", group: "general", label: "Nome da Plataforma", helpText: "Nome exibido na interface" },
    { key: "platform.language", value: "pt-BR", type: "text", group: "general", label: "Idioma Padrão", helpText: "Idioma da interface" },
    { key: "platform.timezone", value: "America/Sao_Paulo", type: "text", group: "general", label: "Timezone", helpText: "Fuso horário padrão" },
    { key: "platform.app_url", value: "http://localhost:3000", type: "text", group: "general", label: "URL da Plataforma", helpText: "URL de exibição (não afeta a rota real)" },
    { key: "agents.default_model", value: "gpt-4o", type: "text", group: "agents", label: "Modelo Padrão", helpText: "Modelo LLM para novos agentes" },
    { key: "agents.default_temperature", value: "0.7", type: "number", group: "agents", label: "Temperatura Padrão", helpText: "Criatividade do modelo (0.0 a 2.0)" },
    { key: "agents.default_max_tokens", value: "4096", type: "number", group: "agents", label: "Max Tokens Padrão", helpText: "Limite de tokens na resposta" },
    { key: "leads.qualification_threshold", value: "70", type: "number", group: "leads", label: "Threshold de Qualificação", helpText: "Score mínimo para marcar lead como qualificado" },
    { key: "leads.auto_qualify", value: "false", type: "boolean", group: "leads", label: "Auto-Qualificação", helpText: "Habilitar qualificação automática de leads" },
    { key: "leads.max_per_page", value: "20", type: "number", group: "leads", label: "Leads por Página", helpText: "Quantidade máxima de leads exibidos por página" },
    { key: "profile.name", value: "", type: "text", group: "profile", label: "Nome", helpText: "Seu nome de exibição" },
    { key: "profile.email", value: "", type: "text", group: "profile", label: "Email", helpText: "Seu email de contato" },
    { key: "profile.role", value: "admin", type: "text", group: "profile", label: "Papel", helpText: "Seu papel na plataforma (admin/viewer)" },
    { key: "profile.email_notifications", value: "true", type: "boolean", group: "profile", label: "Notificações por Email", helpText: "Receber notificações importantes por email" },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
