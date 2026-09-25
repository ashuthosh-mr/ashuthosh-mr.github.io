/**
 * Line-art florals for the invitation at /date.
 *
 * Hand-drawn paths rather than an icon package: these are decorative,
 * single-use and want a lighter stroke than any icon set ships with. Each is
 * aria-hidden - they carry no meaning a screen reader needs.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** A spiral bloom, the way a rose is drawn in one stroke. */
function Bloom({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        {...stroke}
        d="M0 0 m -1.4 0 a 1.4 1.4 0 1 1 2.8 0 a 2.9 2.9 0 1 1 -5.8 0 a 4.4 4.4 0 1 1 8.8 0 a 6.1 6.1 0 1 1 -12.2 0"
      />
    </g>
  );
}

function Leaf({
  x,
  y,
  rotate = 0,
  scale = 1,
}: {
  x: number;
  y: number;
  rotate?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        {...stroke}
        d="M0 0 C 5.5 -4.2, 12.5 -3.4, 15.5 1.6 C 11 6.6, 3.8 5.8, 0 0 Z"
      />
      <path
        {...stroke}
        d="M0.8 0.6 C 5.4 1.1, 10.4 1.5, 14.6 1.5"
        strokeWidth={0.7}
      />
    </g>
  );
}

/** A curving sprig, used bleeding off the corners of the page. */
export function Sprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 170"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        {...stroke}
        d="M95 4 C 82 32, 70 62, 62 96 C 57 120, 55 146, 56 166"
      />
      <path {...stroke} d="M74 54 C 62 46, 50 50, 45 60" strokeWidth={0.9} />
      <path {...stroke} d="M66 82 C 78 76, 90 80, 95 90" strokeWidth={0.9} />
      <path
        {...stroke}
        d="M59 118 C 47 112, 35 117, 31 127"
        strokeWidth={0.9}
      />
      <Leaf x={45} y={60} rotate={196} scale={1.05} />
      <Leaf x={95} y={90} rotate={-16} scale={1.05} />
      <Leaf x={31} y={127} rotate={202} scale={0.95} />
      <Bloom x={95} y={4} scale={1.25} />
      <Bloom x={57} y={165} scale={0.85} />
    </svg>
  );
}

/** Small centred flourish used as a section divider. */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 26"
      width="160"
      height="26"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path {...stroke} d="M4 13 C 30 13, 46 13, 58 13" strokeWidth={0.8} />
      <path
        {...stroke}
        d="M156 13 C 130 13, 114 13, 102 13"
        strokeWidth={0.8}
      />
      <Leaf x={58} y={13} rotate={-24} scale={0.62} />
      <Leaf x={102} y={13} rotate={204} scale={0.62} />
      <Bloom x={80} y={13} scale={0.92} />
    </svg>
  );
}

/** A single petal, falling once when the invitation unlocks. */
export function Petal({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden
      focusable="false"
    >
      <path
        d="M8 0.8 C 12.4 3.4, 14.6 7.4, 12.6 11.4 C 11.1 14.4, 8.6 15.4, 8 15.4 C 7.4 15.4, 4.9 14.4, 3.4 11.4 C 1.4 7.4, 3.6 3.4, 8 0.8 Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}
