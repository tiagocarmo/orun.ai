import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageThread } from "@/components/conversations/message-thread";
import { ConversationActions } from "@/components/conversations/conversation-actions";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

const statusLabel: Record<string, string> = {
  active: "Ativa",
  closed: "Fechada",
  archived: "Arquivada",
};

export default async function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const conversation = await db.conversation.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      lead: { select: { name: true, email: true } },
    },
  });

  if (!conversation) {
    notFound();
  }

  const messages = conversation.messages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
    createdAt: new Date(msg.createdAt).toLocaleString("pt-BR"),
  }));

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">
            {conversation.title ?? `Conversa ${conversation.id.slice(0, 8)}`}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={conversation.status === "active" ? "success" : "neutral"}>
              {statusLabel[conversation.status] || conversation.status}
            </Badge>
            {conversation.lead && (
              <span className="text-sm text-muted">
                {conversation.lead.name} ({conversation.lead.email ?? "sem email"})
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConversationActions conversationId={conversation.id} currentStatus={conversation.status} />
          <Link href="/conversations">
            <Button variant="ghost" size="sm">Voltar</Button>
          </Link>
        </div>
      </div>

      <Card>
        {messages.length === 0 ? (
          <p className="text-sm text-muted py-4">Nenhuma mensagem nesta conversa.</p>
        ) : (
          <MessageThread messages={messages} />
        )}
      </Card>
    </div>
  );
}
