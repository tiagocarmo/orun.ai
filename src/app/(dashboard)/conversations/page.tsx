import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { ConversationList } from "@/components/conversations/conversation-list";

export default async function ConversationsPage() {
  const conversations = await db.conversation.findMany({
    where: { status: { not: "archived" } },
    include: {
      lead: { select: { name: true, email: true, company: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const items = conversations.map((conv) => ({
    id: conv.id,
    title: conv.title ?? `Conversa ${conv.id.slice(0, 8)}`,
    status: conv.status,
    leadName: conv.lead?.name ?? "Desconhecido",
    leadEmail: conv.lead?.email ?? null,
    leadCompany: conv.lead?.company ?? null,
    messageCount: conv._count.messages,
    lastMessage: conv.messages[0]?.content ?? "Nenhuma mensagem ainda.",
    lastMessageAt: conv.messages[0]?.createdAt
      ? new Date(conv.messages[0].createdAt).toLocaleString("pt-BR")
      : null,
    updatedAt: new Date(conv.updatedAt).toLocaleString("pt-BR"),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">Conversas</h1>
        <p className="text-sm text-muted mt-1">Visualize e gerencie conversas</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Nenhuma conversa encontrada"
          description="Conversas aparecerão aqui quando os agentes começarem a interagir com leads."
        />
      ) : (
        <ConversationList conversations={items} />
      )}
    </div>
  );
}
