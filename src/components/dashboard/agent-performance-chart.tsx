"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AgentData {
  name: string;
  runs: number;
}

export function AgentPerformanceChart({ data }: { data: AgentData[] }) {
  return (
    <div className="bg-surface-card border border-hairline rounded-lg p-6">
      <h3 className="text-sm font-semibold text-ink mb-4">Desempenho dos Agentes</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="runs" fill="#b8a4ed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}