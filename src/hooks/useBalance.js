import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchBalance } from '../services/descoApi';

const REFRESH_INTERVAL = 5 * 60; // seconds

export function useBalance() {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const countdownRef = useRef(REFRESH_INTERVAL);
  const timerRef = useRef(null);
  const mountedRef = useRef(true);

  const load = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    setLoading(true);
    setError(null);

    try {
      const data = await fetchBalance();
      if (!mountedRef.current) return;
      setBalanceData(data);
      // Reset countdown after every successful fetch
      countdownRef.current = REFRESH_INTERVAL;
      setCountdown(REFRESH_INTERVAL);
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

  // Tick the countdown every second and auto-refresh when it hits zero
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      countdownRef.current -= 1;
      setCountdown(countdownRef.current);

      if (countdownRef.current <= 0) {
        countdownRef.current = REFRESH_INTERVAL;
        load(false);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [load]);

  // Initial load
  useEffect(() => {
    mountedRef.current = true;
    load(false);
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  const refresh = useCallback(() => {
    countdownRef.current = REFRESH_INTERVAL;
    setCountdown(REFRESH_INTERVAL);
    load(true);
  }, [load]);

  return { balanceData, loading, error, countdown, isRefreshing, refresh };
}
