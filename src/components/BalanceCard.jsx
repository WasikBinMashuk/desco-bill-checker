import LoadingSpinner from './LoadingSpinner';

const METER_NO = '661120018636';

function getBalanceStatus(balance) {
  if (balance === null || balance === undefined) return { label: 'Unknown', level: 'unknown' };
  if (balance > 1000) return { label: 'Good', level: 'good' };
  if (balance >= 300) return { label: 'Moderate', level: 'moderate' };
  return { label: 'Low — Recharge Soon!', level: 'low' };
}

function formatTime(date) {
  if (!date) return '—';
  return date.toLocaleString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function BalanceCard({
  balanceData,
  loading,
  error,
  isRefreshing,
  onRefresh,
}) {
  const status = balanceData ? getBalanceStatus(balanceData.balance) : null;
  const isDisabled = loading || isRefreshing;

  return (
    <div className="card-container">
      <div className={`card ${isRefreshing ? 'card--refreshing' : ''}`}>

        {/* Meter info row */}
        <div className="card-meter-row">
          <span className="meter-label">Meter No.</span>
          <span className="meter-value">{METER_NO}</span>
        </div>

        {/* Main balance area */}
        <div className="balance-area">
          {loading && !balanceData ? (
            <div className="balance-loading">
              <LoadingSpinner size={52} />
              <p className="balance-loading-text">Fetching balance…</p>
            </div>
          ) : error && !balanceData ? (
            <div className="balance-error">
              <div className="error-icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p className="error-message">{error}</p>
              <button className="btn btn--primary" onClick={onRefresh} disabled={isDisabled}>
                Retry
              </button>
            </div>
          ) : balanceData ? (
            <>
              <div className={`balance-display balance-display--${status.level}`}>
                <span className="balance-currency">BDT</span>
                <span className="balance-amount">
                  {balanceData.balance.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className={`status-badge status-badge--${status.level}`}>
                <span className="status-dot" aria-hidden="true" />
                {status.label}
              </div>

              {status.level === 'low' && (
                <div className="alert-banner alert-banner--low">
                  ⚡ Your balance is critically low. Please recharge immediately to avoid power disconnection.
                </div>
              )}
              {status.level === 'moderate' && (
                <div className="alert-banner alert-banner--moderate">
                  💡 Balance is getting low. Consider recharging soon.
                </div>
              )}

              {balanceData.customerName && (
                <p className="customer-name">{balanceData.customerName}</p>
              )}

              <div className="consumption-pill" aria-label={`Current month consumption: ${balanceData.currentMonthConsumption} kWh`}>
                <div className="consumption-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div className="consumption-info">
                  <span className="consumption-label">Current month consumption</span>
                  <span className="consumption-value">
                    {Number.isFinite(balanceData.currentMonthConsumption)
                      ? balanceData.currentMonthConsumption.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : '—'}
                    <span className="consumption-unit"> kWh</span>
                  </span>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer row */}
        {balanceData && (
          <div className="card-footer">
            <div className="footer-timestamps">
              <span className="timestamp-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Last updated: {formatTime(balanceData.readingTime)}
              </span>
            </div>

            <button
              className={`btn btn--primary btn--refresh ${isRefreshing ? 'btn--spinning' : ''}`}
              onClick={onRefresh}
              disabled={isDisabled}
              aria-label="Refresh balance"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon" aria-hidden="true">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              {isRefreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        )}

        {/* Show refresh button even during error with data */}
        {error && balanceData && (
          <div className="card-footer">
            <p className="inline-error">{error}</p>
            <button className="btn btn--primary btn--refresh" onClick={onRefresh} disabled={isDisabled}>
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
