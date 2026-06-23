"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Conversation {
  id: string;
  title: string;
  status: string;
  leadName: string;
  messageCount: number;
  lastMessage: string;
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

export function ConversationList({ conversations }: ConversationListProps) {
  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <Link key={conv.id} href={`/conversations/${conv.id}`}>
          <div className="bg-surface-card border border-hairline rounded-lg p-4 hover:bg-surface-strong transition-colors cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-ink truncate">{conv.title}</h3>
                  <Badge variant={statusVariant[conv.status] || "neutral"}>
                    {conv.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted truncate">{conv.lastMessage}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-soft">{conv.messageCount} msgs</p>
                <p className="text-xs text-muted-soft mt-0.5">{conv.updatedAt}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
