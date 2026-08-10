import type { SVGProps } from "react";

const EmbeddedSystems = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 64 64" fill="none">
    <rect x="4" y="4" width="56" height="56" rx="12" fill="#111827" />
    <rect
      x="20"
      y="20"
      width="24"
      height="24"
      rx="3"
      stroke="#34D399"
      strokeWidth="2.5"
    />
    <circle cx="32" cy="32" r="5.5" stroke="#34D399" strokeWidth="2.5" />
    <path
      d="M32 14v6M32 44v6M14 32h6M44 32h6M21.5 21.5l-4.2-4.2M42.5 42.5l4.2 4.2M42.5 21.5l4.2-4.2M21.5 42.5l-4.2 4.2"
      stroke="#6EE7B7"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export { EmbeddedSystems };
