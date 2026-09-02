function IllustrationShell({ children, title = '' }) {
  return (
    <svg
      className="blush-illustration"
      viewBox="0 0 360 260"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="16" y="16" width="328" height="228" rx="40" fill="#fbf7f0" stroke="#171717" strokeOpacity="0.05" />
      <ellipse cx="264" cy="84" rx="50" ry="42" fill="#dfe7ff" />
      <ellipse cx="98" cy="194" rx="76" ry="34" fill="#f6dcc9" />
      <circle cx="292" cy="184" r="16" fill="#a9f04a" opacity="0.94" />
      <path d="M56 64c18-15 40-14 56 2" fill="none" stroke="#2657ff" strokeWidth="4" strokeLinecap="round" opacity="0.72" />
      <g opacity="0.46" fill="#2657ff">
        <circle cx="58" cy="108" r="2.5" />
        <circle cx="72" cy="108" r="2.5" />
        <circle cx="86" cy="108" r="2.5" />
        <circle cx="58" cy="122" r="2.5" />
        <circle cx="72" cy="122" r="2.5" />
        <circle cx="86" cy="122" r="2.5" />
      </g>
      <path d="M76 214c24 10 52 14 84 14h64c30 0 56-4 78-12" fill="none" stroke="#171717" strokeOpacity="0.08" strokeWidth="3" strokeLinecap="round" />
      {children}
    </svg>
  );
}

function Window({ x, y, accent = false }) {
  return (
    <rect
      x={x}
      y={y}
      width="18"
      height="18"
      rx="5"
      fill={accent ? '#a9f04a' : '#dfe7ff'}
      stroke="#171717"
      strokeOpacity=".05"
    />
  );
}

function SoftCard({ x, y, width, height, radius = 24, fill = '#fff', strokeOpacity = '.12', children }) {
  return (
    <g>
      <rect x={x + 4} y={y + 6} width={width} height={height} rx={radius} fill="#171717" opacity="0.05" />
      <rect x={x} y={y} width={width} height={height} rx={radius} fill={fill} stroke="#171717" strokeOpacity={strokeOpacity} />
      {children}
    </g>
  );
}

function Ground({ x = 102, y = 202, width = 156, fill = '#fff' }) {
  return (
    <>
      <rect x={x} y={y} width={width} height="10" rx="5" fill={fill} />
      <rect x={x + 18} y={y + 12} width={width - 36} height="6" rx="3" fill="#171717" opacity="0.08" />
    </>
  );
}

function BadgeCheck({ cx, cy, r = 24, fill = '#2657ff' }) {
  return (
    <>
      <circle cx={cx} cy={cy + 4} r={r} fill="#171717" opacity="0.08" />
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <path d={`M${cx - 11} ${cy}l7 7 15-19`} fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

export function DocumentFlowIllustration() {
  return (
    <IllustrationShell title="Документы для категорирования и паспорта безопасности">
      <rect x="100" y="188" width="76" height="18" rx="9" fill="#f6dcc9" />
      <SoftCard x="88" y="72" width="106" height="128" radius="20">
        <path d="M116 107h50M116 130h38M116 153h48" stroke="#171717" strokeWidth="6" strokeLinecap="round" opacity="0.68" />
        <rect x="116" y="86" width="40" height="10" rx="5" fill="#dfe7ff" />
      </SoftCard>
      <SoftCard x="154" y="86" width="112" height="134" radius="20">
        <path d="M182 119h55M182 143h43M182 167h56" stroke="#171717" strokeWidth="6" strokeLinecap="round" opacity="0.62" />
        <rect x="182" y="98" width="52" height="11" rx="5.5" fill="#a9f04a" opacity="0.9" />
        <rect x="182" y="188" width="62" height="10" rx="5" fill="#dfe7ff" />
      </SoftCard>
      <BadgeCheck cx="274" cy="176" />
      <Ground x="132" y="222" width="118" />
    </IllustrationShell>
  );
}

export function ShieldBuildingIllustration() {
  return (
    <IllustrationShell title="Здание, защищённое паспортом безопасности">
      <SoftCard x="74" y="84" width="146" height="116" radius="26">
        <path d="M92 88l55-32 55 32" fill="#dfe7ff" stroke="#171717" strokeOpacity="0.07" />
        <Window x="98" y="112" />
        <Window x="130" y="112" accent />
        <Window x="162" y="112" />
        <Window x="98" y="144" />
        <Window x="130" y="144" />
        <Window x="162" y="144" />
        <rect x="127" y="150" width="40" height="50" rx="10" fill="#171717" opacity="0.82" />
      </SoftCard>
      <g>
        <path d="M232 98c19 0 34 14 34 33v19c0 29-22 48-49 58-27-10-49-29-49-58v-19c0-19 15-33 34-33h30Z" fill="#fff" stroke="#2657ff" strokeWidth="5" />
        <path d="M205 154l11 11 21-27" fill="none" stroke="#2657ff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="250" cy="108" r="9" fill="#a9f04a" />
      </g>
      <Ground x="118" y="220" width="132" />
    </IllustrationShell>
  );
}

function HotelIllustration() {
  return (
    <>
      <SoftCard x="84" y="78" width="176" height="126" radius="28">
        <rect x="106" y="96" width="60" height="24" rx="10" fill="#2657ff" />
        <text x="136" y="112" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">ОТЕЛЬ</text>
        <Window x="190" y="97" />
        <Window x="222" y="97" />
        <Window x="190" y="130" accent />
        <Window x="222" y="130" />
        <rect x="107" y="143" width="58" height="34" rx="10" fill="#f6dcc9" />
        <rect x="117" y="153" width="38" height="10" rx="5" fill="#171717" opacity="0.7" />
        <rect x="127" y="135" width="18" height="16" rx="7" fill="#fff" stroke="#171717" strokeOpacity="0.1" />
        <rect x="198" y="160" width="32" height="44" rx="9" fill="#171717" opacity="0.82" />
      </SoftCard>
      <circle cx="250" cy="88" r="11" fill="#a9f04a" />
      <Ground x="114" y="220" width="118" />
    </>
  );
}

function EducationIllustration() {
  return (
    <>
      <SoftCard x="86" y="78" width="188" height="126" radius="28">
        <path d="M104 116l76-42 76 42" fill="#dfe7ff" stroke="#171717" strokeOpacity="0.07" />
        <path d="M104 118h152" stroke="#2657ff" strokeWidth="7" strokeLinecap="round" />
        <Window x="118" y="130" />
        <Window x="154" y="130" accent />
        <Window x="190" y="130" />
        <Window x="226" y="130" />
        <rect x="164" y="164" width="32" height="40" rx="9" fill="#171717" opacity="0.82" />
      </SoftCard>
      <circle cx="180" cy="92" r="16" fill="#f6dcc9" />
      <path d="M173 92h14M180 85v14" stroke="#2657ff" strokeWidth="4" strokeLinecap="round" />
      <Ground x="120" y="220" width="120" />
    </>
  );
}

function CultureIllustration() {
  return (
    <>
      <SoftCard x="80" y="84" width="200" height="120" radius="30">
        <path d="M102 84h156v40c-16 0-29-10-35-24-7 15-21 24-43 24s-36-9-43-24c-6 14-19 24-35 24V84Z" fill="#f6dcc9" />
        <path d="M180 124v66" stroke="#171717" strokeWidth="5" opacity="0.18" />
        <path d="M116 156c16-18 39-18 55 0-15 20-39 20-55 0Z" fill="#dfe7ff" />
        <path d="M189 156c16-18 39-18 55 0-15 20-39 20-55 0Z" fill="#fff" stroke="#2657ff" strokeWidth="4" />
        <circle cx="137" cy="153" r="3" fill="#171717" />
        <circle cx="153" cy="153" r="3" fill="#171717" />
        <circle cx="210" cy="153" r="3" fill="#171717" />
        <circle cx="226" cy="153" r="3" fill="#171717" />
      </SoftCard>
      <Ground x="120" y="220" width="122" />
    </>
  );
}

function TradeIllustration() {
  return (
    <>
      <SoftCard x="82" y="84" width="194" height="120" radius="28">
        <path d="M98 84h162l-10 34H108L98 84Z" fill="#dfe7ff" />
        <path d="M122 84v34M156 84v34M190 84v34M224 84v34" stroke="#2657ff" strokeWidth="4" opacity="0.7" />
        <rect x="118" y="142" width="58" height="36" rx="10" fill="#f6dcc9" />
        <rect x="193" y="136" width="48" height="68" rx="10" fill="#171717" opacity="0.82" />
        <path d="M124 186h92" stroke="#171717" strokeWidth="5" strokeLinecap="round" opacity="0.16" />
      </SoftCard>
      <circle cx="244" cy="94" r="10" fill="#a9f04a" />
      <Ground x="122" y="220" width="114" />
    </>
  );
}

function SportIllustration() {
  return (
    <>
      <path d="M76 164c0-49 46-84 104-84s104 35 104 84" fill="#fff" stroke="#171717" strokeOpacity="0.12" />
      <path d="M100 164c0-34 36-58 80-58s80 24 80 58" fill="#dfe7ff" />
      <SoftCard x="84" y="164" width="192" height="40" radius="18" strokeOpacity=".1">
        <circle cx="180" cy="144" r="31" fill="#fff" stroke="#2657ff" strokeWidth="5" />
        <path d="M180 113v62M149 144h62" stroke="#2657ff" strokeWidth="3" opacity="0.52" />
        <path d="M160 123c12 10 28 10 40 0M160 165c12-10 28-10 40 0" fill="none" stroke="#2657ff" strokeWidth="3" />
      </SoftCard>
      <Ground x="126" y="220" width="108" />
    </>
  );
}

function HealthIllustration() {
  return (
    <>
      <SoftCard x="84" y="78" width="188" height="128" radius="28">
        <rect x="114" y="98" width="128" height="34" rx="12" fill="#dfe7ff" />
        <path d="M178 106v18M169 115h18" stroke="#2657ff" strokeWidth="7" strokeLinecap="round" />
        <Window x="118" y="148" />
        <Window x="148" y="148" />
        <Window x="208" y="148" accent />
        <rect x="175" y="150" width="30" height="56" rx="8" fill="#171717" opacity="0.82" />
      </SoftCard>
      <circle cx="258" cy="92" r="16" fill="#a9f04a" />
      <Ground x="122" y="220" width="116" />
    </>
  );
}

function CrowdIllustration() {
  return (
    <>
      <SoftCard x="78" y="80" width="204" height="122" radius="28">
        <path d="M102 105h156" stroke="#2657ff" strokeWidth="7" strokeLinecap="round" />
        <circle cx="128" cy="136" r="15" fill="#dfe7ff" />
        <circle cx="180" cy="126" r="18" fill="#f6dcc9" />
        <circle cx="232" cy="136" r="15" fill="#dfe7ff" />
        <path d="M104 186c0-24 11-38 24-38s24 14 24 38M151 186c0-30 13-46 29-46s29 16 29 46M208 186c0-24 11-38 24-38s24 14 24 38" fill="none" stroke="#171717" strokeWidth="5" strokeLinecap="round" opacity="0.72" />
      </SoftCard>
      <rect x="114" y="194" width="132" height="9" rx="4.5" fill="#a9f04a" />
      <Ground x="124" y="220" width="112" />
    </>
  );
}

function SocialIllustration() {
  return (
    <>
      <SoftCard x="86" y="84" width="188" height="118" radius="30">
        <circle cx="136" cy="126" r="18" fill="#dfe7ff" />
        <circle cx="224" cy="126" r="18" fill="#f6dcc9" />
        <path d="M112 184c0-31 12-47 26-47s26 16 26 47M200 184c0-31 12-47 26-47s26 16 26 47" fill="none" stroke="#171717" strokeWidth="5" strokeLinecap="round" opacity="0.72" />
        <path d="M180 136c12-13 33-4 33 13 0 17-18 30-33 42-15-12-33-25-33-42 0-17 21-26 33-13Z" fill="#a9f04a" stroke="#171717" strokeOpacity="0.05" />
      </SoftCard>
      <Ground x="126" y="220" width="108" />
    </>
  );
}

function TypeGlyph({ variant }) {
  switch (variant) {
    case 'hotel': return <HotelIllustration />;
    case 'education': return <EducationIllustration />;
    case 'culture': return <CultureIllustration />;
    case 'trade': return <TradeIllustration />;
    case 'sport': return <SportIllustration />;
    case 'health': return <HealthIllustration />;
    case 'crowd': return <CrowdIllustration />;
    case 'social': return <SocialIllustration />;
    default: return <ShieldBuildingIllustration />;
  }
}

export function ObjectTypeIllustration({ variant, title }) {
  return (
    <IllustrationShell title={title}>
      <TypeGlyph variant={variant} />
    </IllustrationShell>
  );
}
