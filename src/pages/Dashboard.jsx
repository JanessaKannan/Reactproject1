import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FiDownload, FiRefreshCw } from 'react-icons/fi';
import { FaMoon, FaSun } from 'react-icons/fa';
import ChartCard from '../components/ChartCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import { useAnalytics } from '../hooks/useAnalytics.js';
import { exportDashboardToPDF } from '../utils/exportPDF.js';
import { useTheme } from '../context/ThemeContext.jsx';

function buildTrafficSeries(traffic, dateRange) {
  const points = Array.isArray(traffic) ? traffic : [];
  const totalDays = dateRange === 'last90' ? 90 : dateRange === 'last30' ? 30 : 7;
  const label = (idx) => `Day ${Math.max(1, totalDays - (points.length - 1 - idx))}`;
  return points.map((value, idx) => ({ name: label(idx), value }));
}

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const dashboardRef = useRef(null);

  const [filters, setFilters] = useState({
    dateRange: 'last7',
    category: 'all',
    region: 'all',
    sort: 'highest'
  });

  const { data, loading, error, refetch } = useAnalytics(filters);

  const onFilterChange = useCallback((next) => {
    setFilters(next);
  }, []);

  const trafficData = useMemo(
    () => buildTrafficSeries(data?.traffic, filters.dateRange),
    [data?.traffic, filters.dateRange]
  );

  const salesData = useMemo(() => (Array.isArray(data?.sales) ? data.sales : []), [data?.sales]);

  const usersData = useMemo(() => {
    const rows = Array.isArray(data?.users) ? data.users : [];
    return rows.map((r) => ({ name: r.region, value: r.value }));
  }, [data?.users]);

  const onExport = useCallback(async () => {
    await exportDashboardToPDF(dashboardRef.current, 'analytics-report.pdf');
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6" ref={dashboardRef}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Explore traffic, sales, and users. Filters update charts instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800"
            title="Refetch analytics"
          >
            <FiRefreshCw />
            Refresh
          </button>

          <button
            type="button"
            onClick={onExport}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            title="Export dashboard as PDF"
          >
            <FiDownload />
            Export Report
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      <div className="mt-5">
        <FilterPanel filters={filters} onFilterChange={onFilterChange} />
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <ChartCard title="Traffic Over Time" type="line" data={trafficData} loading={loading} />
        </div>
        <ChartCard title="Sales by Category" type="bar" data={salesData} loading={loading} />
        <ChartCard title="User Distribution" type="pie" data={usersData} loading={loading} />
      </div>
    </div>
  );
}

