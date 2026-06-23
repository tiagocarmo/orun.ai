import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageThread } from "@/components/conversations/message-thread";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

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
            {conversation.title ?? `Conversation ${conversation.id.slice(0, 8)}`}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={conversation.status === "active" ? "success" : "neutral"}>
              {conversation.status}
            </Badge>
            {conversation.lead && (
              <span className="text-sm text-muted">
                {conversation.lead.name} ({conversation.lead.email ?? "no email"})
              </span>
            )}
          </div>
        </div>
        <Link href="/conversations">
          <Button variant="ghost" size="sm">Back</Button>
        </Link>
      </div>

      <Card>
        {messages.length === 0 ? (
          <p className="text-sm text-muted py-4">No messages in this conversation.</p>
        ) : (
          <MessageThread messages={messages} />
        )}
      </Card>
    </div>
  );
}
