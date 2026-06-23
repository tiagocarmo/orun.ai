"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ConversationActions } from "./conversation-actions";

interface Conversation {
  id: string;
  title: string;
  status: string;
  leadName: string;
  leadEmail: string | null;
  leadCompany: string | null;
  messageCount: number;
  lastMessage: string;
  lastMessageAt: string | null;
  updatedAt: string;
}

interface ConversationListProps {
  conversations: Conversation[];
}

const statusVariant: Record<string, "success" | "warning" | "neutral" | "info"> = {
  active: "success",
  closed: "neutral",
  archived: "neutral",
};

const statusLabel: Record<string, string> = {
  active: "Ativa",
  closed: "Fechada",
  archived: "Arquivada",
};

export function ConversationList({ conversations }: ConversationListProps) {
  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <div key={conv.id} className="bg-surface-card border border-hairline rounded-lg p-4">
          <Link href={`/conversations/${conv.id}`} className="block hover:bg-surface-strong transition-colors rounded-md -m-2 p-2">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-ink truncate">{conv.title}</h3>
                  <Badge variant={statusVariant[conv.status] || "neutral"}>
                    {statusLabel[conv.status] || conv.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-soft mb-1">
                  Lead: {conv.leadName}
                  {conv.leadEmail ? ` · ${conv.leadEmail}` : ""}
                  {conv.leadCompany ? ` · ${conv.leadCompany}` : ""}
                </p>
                <p className="text-sm text-muted truncate">{conv.lastMessage}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-soft">{conv.messageCount} mensagens</p>
                {conv.lastMessageAt && (
                  <p className="text-xs text-muted-soft mt-0.5">Ultima: {conv.lastMessageAt}</p>
                )}
                <p className="text-xs text-muted-soft mt-0.5">{conv.updatedAt}</p>
              </div>
            </div>
          </Link>
          <div className="flex justify-end mt-2 pt-2 border-t border-hairline">
            <ConversationActions conversationId={conv.id} currentStatus={conv.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
