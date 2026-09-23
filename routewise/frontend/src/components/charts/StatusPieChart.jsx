import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  DRAFT: '#64748b',
  OPTIMIZED: '#3ddcf7',
  IN_PROGRESS: '#fbbf24',
  COMPLETED: '#34d399',
  CANCELLED: '#f87171',
};

export default function StatusPieChart({ data, height = 260 }) {
  const chartData = data.map((d) => ({ name: d.label, value: Number(d.value) }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#3ddcf7'} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#111828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
        />
        <Legend
          formatter={(value) => <span className="text-xs text-slate-400">{value}</span>}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
