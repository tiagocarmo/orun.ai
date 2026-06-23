"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { updateConversation } from "@/app/actions/conversations";

interface ConversationActionsProps {
  conversationId: string;
  currentStatus: string;
}

export function ConversationActions({ conversationId, currentStatus }: ConversationActionsProps) {
  const router = useRouter();
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleArchive() {
    setLoading(true);
    const newStatus = currentStatus === "archived" ? "active" : "archived";
    const result = await updateConversation(conversationId, { status: newStatus });
    if (result.success) {
      toast.success(newStatus === "archived" ? "Conversa arquivada" : "Conversa desarquivada");
      setArchiveModalOpen(false);
      router.refresh();
    } else {
      toast.error("Erro ao processar");
    }
    setLoading(false);
  }

  const isArchived = currentStatus === "archived";

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setArchiveModalOpen(true)}
        disabled={loading}
      >
        {isArchived ? "Desarquivar" : "Arquivar"}
      </Button>

      <Modal
        isOpen={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
        title={isArchived ? "Desarquivar Conversa" : "Arquivar Conversa"}
        onConfirm={handleArchive}
        confirmLabel={isArchived ? "Desarquivar" : "Arquivar"}
      >
        <p>
          {isArchived
            ? "Deseja restaurar esta conversa para ativo?"
            : "Deseja arquivar esta conversa? Ela não aparecerá na lista principal."}
        </p>
      </Modal>
    </>
  );
}
