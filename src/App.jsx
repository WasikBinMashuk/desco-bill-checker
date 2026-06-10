import { useState, useEffect } from 'react';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import { useBalance } from './hooks/useBalance';
import './App.css';

function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('desco-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('desco-theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggle };
}

export default function App() {
  const { theme, toggle } = useTheme();
  const { balanceData, loading, error, isRefreshing, refresh } = useBalance();

  return (
    <div className="app">
      <Header theme={theme} onToggle={toggle} />

      <main className="main">
        <BalanceCard
          balanceData={balanceData}
          loading={loading}
          error={error}
          isRefreshing={isRefreshing}
          onRefresh={refresh}
        />
      </main>

      <footer className="footer">
        <p>Data source: DESCO Prepaid Meter API</p>
        <p className="footer-note">Manual refresh only &mdash; meter <strong>661120018636</strong></p>
      </footer>
    </div>
  );
}
