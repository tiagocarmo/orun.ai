"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { updateLead, deleteLead } from "@/app/actions/leads";

interface LeadActionsProps {
  leadId: string;
  currentStatus: string;
}

export function LeadActions({ leadId, currentStatus }: LeadActionsProps) {
  const router = useRouter();
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleArchive() {
    setLoading(true);
    const result = await updateLead(leadId, { status: "archived" });
    if (result.success) {
      setArchiveModalOpen(false);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    const result = await deleteLead(leadId);
    if (result.success) {
      setDeleteModalOpen(false);
      router.push("/leads");
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
          Tem certeza que deseja excluir este lead? Esta ação não pode ser
          desfeita.
        </p>
      </Modal>
    </>
  );
}
