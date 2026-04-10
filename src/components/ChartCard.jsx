import React, { memo, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const PIE_COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];

function CardShell({ title, children, footer }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{title}</h2>
        {footer}
      </div>
      <div className="mt-3 h-64">{children}</div>
    </div>
  );
}

const ChartCard = memo(function ChartCard({ title, type, data, loading = false }) {
  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  if (loading) {
    return (
      <CardShell
        title={title}
        footer={<span className="text-xs text-slate-500 dark:text-slate-400">Loading…</span>}
      >
        <div className="flex h-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600 dark:border-slate-800 dark:border-t-slate-200" />
        </div>
      </CardShell>
    );
  }

  if (!safeData.length) {
    return (
      <CardShell title={title} footer={<span className="text-xs text-slate-500">No data</span>}>
        <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
          No data available for the selected filters.
        </div>
      </CardShell>
    );
  }

  return (
    <CardShell title={title}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={safeData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2} dot={false} />
          </LineChart>
        ) : type === 'bar' ? (
          <BarChart data={safeData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#34d399" radius={[10, 10, 0, 0]} />
          </BarChart>
        ) : (
          <PieChart>
            <Tooltip />
            <Pie
              data={safeData}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={92}
              paddingAngle={2}
            >
              {safeData.map((_, idx) => (
                <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </CardShell>
  );
});

export default ChartCard;

