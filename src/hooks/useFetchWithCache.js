import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to fetch data with in-memory caching, 8s timeout, and AbortController
 * Prevents infinite spinner / loading loops
 */
export function useFetchWithCache(activeMenu) {
  const [data, setData] = useState(null);
  const [cacheData, setCacheData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWithCache = useCallback(async (menu) => {
    if (!menu) return;

    if (cacheData[menu]) {
      setData(cacheData[menu]);
      return;
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`/api/${menu}`, { signal: controller.signal, cache: 'no-store' });
      if (!res.ok) throw new Error('فشل التحميل');
      const json = await res.json();
      setCacheData(prev => ({ ...prev, [menu]: json }));
      setData(json);
    } catch (e) {
      if (e.name === 'AbortError') {
        alert('الكونيكسيون تقيلة - عاود كليكي');
        setError('مهلة الاتصال انتهت');
      } else {
        setError(e.message);
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, [cacheData]);

  useEffect(() => {
    if (activeMenu) {
      fetchWithCache(activeMenu);
    }
  }, [activeMenu, fetchWithCache]);

  return { data, setData, loading, error, cacheData, fetchWithCache };
}

export default useFetchWithCache;
