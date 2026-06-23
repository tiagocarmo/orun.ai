"use client";

interface ActivityEvent {
  id: string;
  type: string;
  leadName: string;
  createdAt: string;
}

const eventIcons: Record<string, string> = {
  created: "🆕",
  qualified: "✅",
  status_changed: "🔄",
  note: "📝",
  enriched: "📊",
  contacted: "📞",
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="bg-surface-card border border-hairline rounded-lg p-6">
      <h3 className="text-sm font-semibold text-ink mb-4">Atividade Recente</h3>
      {events.length === 0 ? (
        <p className="text-sm text-muted py-4">Nenhuma atividade recente.</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-3">
              <span className="text-lg">{eventIcons[event.type] || "📌"}</span>
              <div className="flex-1">
                <p className="text-sm text-ink">
                  <span className="font-medium">{event.leadName}</span>
                  {" — "}
                  <span className="text-muted">{event.type}</span>
                </p>
                <p className="text-xs text-muted-soft">{event.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}