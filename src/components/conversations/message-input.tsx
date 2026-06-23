"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addMessage } from "@/app/actions/conversations";
import { toast } from "sonner";

interface MessageInputProps {
  conversationId: string;
  onMessageSent: () => void;
}

export function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!content.trim()) return;
    setLoading(true);

    const result = await addMessage({
      conversationId,
      role: "assistant",
      content: content.trim(),
    });

    if (result.success) {
      toast.success("Mensagem enviada");
      setContent("");
      onMessageSent();
    } else {
      toast.error("Erro ao enviar mensagem");
    }

    setLoading(false);
  }

  return (
    <div className="flex gap-2 p-4 border-t border-hairline">
      <input
        type="text"
        placeholder="Digite sua mensagem..."
        className="flex-1 px-3 py-2 rounded-md border border-hairline bg-canvas text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={loading}
      />
      <Button onClick={handleSend} loading={loading} disabled={!content.trim()}>
        Enviar
      </Button>
    </div>
  );
}
