"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { updateLead, deleteLead } from "@/app/actions/leads";
import { parseLeadMetadata, restoreLeadStatus } from "@/lib/leads/metadata";

interface LeadActionsProps {
  leadId: string;
  currentStatus: string;
  currentMetadata?: string | null;
}

export function LeadActions({ leadId, currentStatus, currentMetadata }: LeadActionsProps) {
  const router = useRouter();
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isArchived = currentStatus === "archived";

  async function handleArchive() {
    setLoading(true);
    const nextStatus = isArchived
      ? restoreLeadStatus(parseLeadMetadata(currentMetadata))
      : "archived";
    const result = await updateLead(leadId, { status: nextStatus });
    if (result.success) {
      toast.success(isArchived ? "Lead desarquivado" : "Lead arquivado");
      setArchiveModalOpen(false);
      router.refresh();
    } else {
      toast.error("Erro ao processar");
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    const result = await deleteLead(leadId);
    if (result.success) {
      toast.success("Lead removido");
      setDeleteModalOpen(false);
      router.push("/leads");
    } else {
      toast.error("Erro ao processar");
    }
    setLoading(false);
  }

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
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setDeleteModalOpen(true)}
        disabled={loading}
      >
        Excluir
      </Button>

      <Modal
        isOpen={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
        title={isArchived ? "Desarquivar Lead" : "Arquivar Lead"}
        onConfirm={handleArchive}
        confirmLabel={isArchived ? "Desarquivar" : "Arquivar"}
      >
        <p>
          {isArchived
            ? "Deseja restaurar este lead para ativo?"
            : "Deseja arquivar este lead? Ele não aparecerá na lista principal."}
        </p>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Excluir Lead"
        onConfirm={handleDelete}
        confirmLabel="Excluir"
        variant="destructive"
      >
        <p>
          Tem certeza que deseja remover este lead da visão ativa? O histórico
          será preservado para auditoria.
        </p>
      </Modal>
    </>
  );
}
