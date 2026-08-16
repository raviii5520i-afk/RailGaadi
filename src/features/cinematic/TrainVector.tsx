"use client";

interface TrainVectorProps {
  className?: string;
  style?: React.CSSProperties;
}

export function TrainVector({ className, style }: TrainVectorProps) {
  return (
    <div
      className={className}
      style={{
        width: 320,
        height: 80,
        position: "relative",
        filter: "drop-shadow(0 12px 24px rgba(11, 18, 32, 0.4))",
        ...style,
      }}
    >
      <svg
        viewBox="0 0 400 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Headlight Cone Glow */}
        <path
          d="M380 50L480 20L480 80Z"
          fill="url(#headlightGlow)"
          opacity="0.6"
        />

        {/* Streamlined Main Body */}
        <path
          d="M10 30C10 25 15 20 22 20H340C365 20 388 35 395 50C388 65 365 80 340 80H22C15 80 10 75 10 70V30Z"
          fill="#0B1220"
          stroke="#1E293B"
          strokeWidth="2"
        />

        {/* Train Roof Shell */}
        <path
          d="M15 20H335C355 20 375 30 385 40H15V20Z"
          fill="#1E293B"
        />

        {/* Blue Signature Railway Stripe */}
        <path
          d="M10 52H395C392 56 385 62 375 66H10V52Z"
          fill="#2563EB"
        />

        {/* Cyan Accent Trim */}
        <rect x="10" y="48" width="382" height="3" fill="#38BDF8" />

        {/* Panoramic Windows */}
        <g fill="#38BDF8" fillOpacity="0.85">
          <rect x="40" y="30" width="30" height="14" rx="2" />
          <rect x="80" y="30" width="30" height="14" rx="2" />
          <rect x="120" y="30" width="30" height="14" rx="2" />
          <rect x="160" y="30" width="30" height="14" rx="2" />
          <rect x="200" y="30" width="30" height="14" rx="2" />
          <rect x="240" y="30" width="30" height="14" rx="2" />
          <rect x="280" y="30" width="30" height="14" rx="2" />
          {/* Driver Cockpit Windshield */}
          <path d="M330 30H350C362 30 372 37 377 44H330V30Z" />
        </g>

        {/* Headlight Lamp */}
        <circle cx="390" cy="50" r="4" fill="#FFFFFF" />
        <circle cx="390" cy="50" r="7" fill="#38BDF8" fillOpacity="0.5" />

        {/* Wheel Bogies */}
        <g fill="#475569" stroke="#0F172A" strokeWidth="2">
          <circle cx="50" cy="84" r="8" />
          <circle cx="75" cy="84" r="8" />
          <circle cx="160" cy="84" r="8" />
          <circle cx="185" cy="84" r="8" />
          <circle cx="270" cy="84" r="8" />
          <circle cx="295" cy="84" r="8" />
          <circle cx="350" cy="84" r="8" />
        </g>

        {/* Under-chassis Base Bar */}
        <rect x="30" y="80" width="330" height="4" fill="#334155" />

        {/* Gradients */}
        <defs>
          <linearGradient
            id="headlightGlow"
            x1="380"
            y1="50"
            x2="480"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="1" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
