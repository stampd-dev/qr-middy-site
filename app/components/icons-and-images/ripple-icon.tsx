export function RippleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block mr-2"
    >
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}
