function IllustrationShell({ children, title = '' }) {
  return (
    <svg
      className="blush-illustration"
      viewBox="0 0 360 260"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="16"
        y="16"
        width="328"
        height="228"
        rx="40"
        fill="#fbf7f0"
        stroke="#171717"
        strokeOpacity="0.05"
      />
      <ellipse cx="264" cy="84" rx="50" ry="42" fill="#dfe7ff" />
      <ellipse cx="98" cy="194" rx="76" ry="34" fill="#f6dcc9" />
      <circle cx="292" cy="184" r="16" fill="#a9f04a" opacity="0.94" />
      <path
        d="M56 64c18-15 40-14 56 2"
        fill="none"
        stroke="#2657ff"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.72"
      />
      <g opacity="0.46" fill="#2657ff">
        <circle cx="58" cy="108" r="2.5" />
        <circle cx="72" cy="108" r="2.5" />
        <circle cx="86" cy="108" r="2.5" />
        <circle cx="58" cy="122" r="2.5" />
        <circle cx="72" cy="122" r="2.5" />
        <circle cx="86" cy="122" r="2.5" />
      </g>
      <path
        d="M76 214c24 10 52 14 84 14h64c30 0 56-4 78-12"
        fill="none"
        stroke="#171717"
        strokeOpacity="0.08"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {children}
    </svg>
  );
}

function SoftCard({
  x,
  y,
  width,
  height,
  radius = 24,
  fill = '#fff',
  strokeOpacity = '.12',
  children,
}) {
  return (
    <g>
      <rect
        x={x + 4}
        y={y + 6}
        width={width}
        height={height}
        rx={radius}
        fill="#171717"
        opacity="0.05"
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        fill={fill}
        stroke="#171717"
        strokeOpacity={strokeOpacity}
      />
      {children}
    </g>
  );
}

function Ground({ x = 102, y = 202, width = 156, fill = '#fff' }) {
  return (
    <>
      <rect x={x} y={y} width={width} height="10" rx="5" fill={fill} />
      <rect
        x={x + 18}
        y={y + 12}
        width={width - 36}
        height="6"
        rx="3"
        fill="#171717"
        opacity="0.08"
      />
    </>
  );
}

function BadgeCheck({ cx, cy, r = 24, fill = '#2657ff' }) {
  return (
    <>
      <circle cx={cx} cy={cy + 4} r={r} fill="#171717" opacity="0.08" />
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <path
        d={`M${cx - 11} ${cy}l7 7 15-19`}
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

export function DocumentFlowIllustration() {
  return (
    <IllustrationShell title="Документы для категорирования и паспорта безопасности">
      <rect x="100" y="188" width="76" height="18" rx="9" fill="#f6dcc9" />
      <SoftCard x="88" y="72" width="106" height="128" radius="20">
        <path
          d="M116 107h50M116 130h38M116 153h48"
          stroke="#171717"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.68"
        />
        <rect x="116" y="86" width="40" height="10" rx="5" fill="#dfe7ff" />
      </SoftCard>
      <SoftCard x="154" y="86" width="112" height="134" radius="20">
        <path
          d="M182 119h55M182 143h43M182 167h56"
          stroke="#171717"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.62"
        />
        <rect x="182" y="98" width="52" height="11" rx="5.5" fill="#a9f04a" opacity="0.9" />
        <rect x="182" y="188" width="62" height="10" rx="5" fill="#dfe7ff" />
      </SoftCard>
      <BadgeCheck cx="274" cy="176" />
      <Ground x="132" y="222" width="118" />
    </IllustrationShell>
  );
}
