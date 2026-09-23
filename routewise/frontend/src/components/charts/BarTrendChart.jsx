import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label, suffix }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-lg border border-white/10 px-3 py-2 text-xs">
      <p className="text-slate-400">{label}</p>
      <p className="font-mono-tabular font-semibold text-white">
        {payload[0].value} {suffix}
      </p>
    </div>
  );
};

export default function BarTrendChart({ data, dataKey = 'value', suffix = '', color = '#3ddcf7', height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<CustomTooltip suffix={suffix} />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
