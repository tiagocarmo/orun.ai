"use client";

import { useRouter } from "next/navigation";
import { MessageInput } from "@/components/conversations/message-input";

interface ConversationClientProps {
  conversationId: string;
}

export function ConversationClient({ conversationId }: ConversationClientProps) {
  const router = useRouter();

  return (
    <MessageInput
      conversationId={conversationId}
      onMessageSent={() => router.refresh()}
    />
  );
}
