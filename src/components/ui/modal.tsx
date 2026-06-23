"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  variant?: "default" | "destructive";
}

const buttonVariantMap = {
  default: "primary" as const,
  destructive: "destructive" as const,
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmLabel = "Confirmar",
  variant = "default",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="bg-canvas rounded-lg border border-hairline shadow-lg w-full max-w-md mx-4 p-6 space-y-4">
        <h2 className="text-lg font-display font-semibold text-ink">{title}</h2>
        <div className="text-sm text-body">{children}</div>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          {onConfirm && (
            <Button variant={buttonVariantMap[variant]} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
