import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-error/15 text-error",
  info: "bg-brand-lavender/15 text-brand-lavender",
  neutral: "bg-surface-strong text-muted",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function LeadStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    new: "info",
    qualified: "success",
    nurturing: "warning",
    disqualified: "error",
    converted: "success",
  };
  return <Badge variant={map[status] || "neutral"}>{status}</Badge>;
}

export function RunStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    pending: "warning",
    running: "info",
    completed: "success",
    failed: "error",
  };
  return <Badge variant={map[status] || "neutral"}>{status}</Badge>;
}

export function AgentStatusBadge({ isActive }: { isActive: boolean }) {
  return <Badge variant={isActive ? "success" : "neutral"}>{isActive ? "active" : "inactive"}</Badge>;
}
