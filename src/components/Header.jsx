import ThemeToggle from './ThemeToggle';

export default function Header({ theme, onToggle }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div>
            <h1 className="header-title">DESCO Balance</h1>
            <p className="header-subtitle">Prepaid Meter Monitor</p>
          </div>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </div>
    </header>
  );
}
