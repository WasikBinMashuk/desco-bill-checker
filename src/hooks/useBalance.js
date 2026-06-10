import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchBalance } from '../services/descoApi';

export function useBalance() {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mountedRef = useRef(true);

  const load = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    setLoading(true);
    setError(null);

    try {
      const data = await fetchBalance();
      if (!mountedRef.current) return;
      setBalanceData(data);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message || 'Failed to fetch balance.');
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load(false);
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  const refresh = useCallback(() => {
    load(true);
  }, [load]);

  return { balanceData, loading, error, isRefreshing, refresh };
}
