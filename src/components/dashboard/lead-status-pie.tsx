"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface StatusData {
  name: string;
  value: number;
}

const COLORS = ["#22c55e", "#1a3a3a", "#f59e0b", "#ef4444", "#b8a4ed"];

export function LeadStatusPie({ data }: { data: StatusData[] }) {
  return (
    <div className="bg-surface-card border border-hairline rounded-lg p-6">
      <h3 className="text-sm font-semibold text-ink mb-4">Distribuição de Status</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}