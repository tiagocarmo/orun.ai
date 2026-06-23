"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
  date: string;
  count: number;
}

export function LeadsOverTimeChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="bg-surface-card border border-hairline rounded-lg p-6">
      <h3 className="text-sm font-semibold text-ink mb-4">Leads por Período</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#1a3a3a" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}