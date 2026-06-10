export default function LoadingSpinner({ size = 48 }) {
  return (
    <div className="spinner-wrapper" aria-label="Loading" role="status">
      <svg
        className="spinner"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="100 28"
        />
      </svg>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
