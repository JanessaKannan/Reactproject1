import React, { memo, useCallback, useMemo } from 'react';

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <select
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const FilterPanel = memo(function FilterPanel({ filters, onFilterChange }) {
  const dateRangeOptions = useMemo(
    () => [
      { label: 'Last 7 days', value: 'last7' },
      { label: 'Last 30 days', value: 'last30' },
      { label: 'Last 90 days', value: 'last90' }
    ],
    []
  );

  const categoryOptions = useMemo(
    () => [
      { label: 'All', value: 'all' },
      { label: 'Electronics', value: 'Electronics' },
      { label: 'Clothing', value: 'Clothing' },
      { label: 'Books', value: 'Books' }
    ],
    []
  );

  const regionOptions = useMemo(
    () => [
      { label: 'All', value: 'all' },
      { label: 'Asia', value: 'Asia' },
      { label: 'Europe', value: 'Europe' },
      { label: 'America', value: 'America' }
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { label: 'Highest Sales', value: 'highest' },
      { label: 'Lowest Sales', value: 'lowest' }
    ],
    []
  );

  const update = useCallback(
    (patch) => {
      const next = { ...filters, ...patch };
      onFilterChange(next);
    },
    [filters, onFilterChange]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Date Range"
          value={filters.dateRange}
          onChange={(v) => update({ dateRange: v })}
          options={dateRangeOptions}
        />
        <Select
          label="Category"
          value={filters.category}
          onChange={(v) => update({ category: v })}
          options={categoryOptions}
        />
        <Select
          label="Region"
          value={filters.region}
          onChange={(v) => update({ region: v })}
          options={regionOptions}
        />
        <Select
          label="Sort"
          value={filters.sort}
          onChange={(v) => update({ sort: v })}
          options={sortOptions}
        />
      </div>
    </div>
  );
});

export default FilterPanel;

