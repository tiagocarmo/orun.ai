"use client";

import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

interface MessageThreadProps {
  messages: Message[];
}

const roleConfig: Record<string, { label: string; variant: "info" | "success" | "neutral" }> = {
  user: { label: "Usuário", variant: "info" },
  assistant: { label: "Agente", variant: "success" },
  system: { label: "Sistema", variant: "neutral" },
};

export function MessageThread({ messages }: MessageThreadProps) {
  return (
    <div className="space-y-4">
      {messages.map((msg) => {
        const config = roleConfig[msg.role] || roleConfig.system;
        return (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={config.variant}>{config.label}</Badge>
              <span className="text-xs text-muted-soft">{msg.createdAt}</span>
            </div>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-brand-teal text-on-primary"
                  : msg.role === "system"
                  ? "bg-surface-strong text-muted"
                  : "bg-surface-card text-ink border border-hairline"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
