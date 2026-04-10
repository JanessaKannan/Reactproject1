import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAnalytics } from '../services/api.js';

const EMPTY = { traffic: [], sales: [], users: [] };

export function useAnalytics(filters) {
  const stableFilters = useMemo(
    () => ({
      dateRange: filters?.dateRange ?? 'last7',
      category: filters?.category ?? 'all',
      region: filters?.region ?? 'all',
      sort: filters?.sort ?? 'highest'
    }),
    [filters?.category, filters?.dateRange, filters?.region, filters?.sort]
  );

  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnalytics(stableFilters);
      setData(res ?? EMPTY);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch analytics.');
      setData(EMPTY);
    } finally {
      setLoading(false);
    }
  }, [stableFilters]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
}

