import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { ConversationList } from "@/components/conversations/conversation-list";

export default async function ConversationsPage() {
  const conversations = await db.conversation.findMany({
    include: {
      lead: { select: { name: true } },
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
    title: conv.title ?? `Conversation ${conv.id.slice(0, 8)}`,
    status: conv.status,
    leadName: conv.lead?.name ?? "Unknown",
    messageCount: conv._count.messages,
    lastMessage: conv.messages[0]?.content ?? "No messages yet.",
    updatedAt: new Date(conv.updatedAt).toLocaleString("pt-BR"),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-ink">Conversations</h1>
        <p className="text-sm text-muted mt-1">View and manage conversations</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No conversations found"
          description="Conversations will appear here once agents start interacting with leads."
        />
      ) : (
        <ConversationList conversations={items} />
      )}
    </div>
  );
}
