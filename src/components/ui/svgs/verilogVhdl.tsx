import type { SVGProps } from "react";

const VerilogVhdl = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 64 64" fill="none">
    <rect x="4" y="4" width="56" height="56" rx="12" fill="#0F172A" />
    <rect
      x="18"
      y="18"
      width="28"
      height="28"
      rx="4"
      stroke="#22D3EE"
      strokeWidth="2.5"
    />
    <path
      d="M24 30.5 28.5 35 36 27.5M24 39h16"
      stroke="#22D3EE"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 24h6M12 32h6M12 40h6M46 24h6M46 32h6M46 40h6"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export { VerilogVhdl };
