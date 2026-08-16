"use client";

interface DigitalRouteSVGProps {
  progress: number; // 0 to 1 overall progress
}

const STATIONS = [
  { name: "Ahmedabad", code: "ADI", cx: 60, cy: 90, threshold: 0.46 },
  { name: "Anand", code: "ANND", cx: 200, cy: 110, threshold: 0.49 },
  { name: "Vadodara", code: "BRC", cx: 340, cy: 140, threshold: 0.52 },
  { name: "Surat", code: "ST", cx: 500, cy: 190, threshold: 0.55 },
  { name: "Mumbai Central", code: "MMCT", cx: 680, cy: 250, threshold: 0.58 },
];

export function DigitalRouteSVG({ progress }: DigitalRouteSVGProps) {
  // Map progress (0.45 -> 0.60) to route draw fraction (0 -> 1)
  const routeProgress = Math.max(0, Math.min(1, (progress - 0.45) / 0.15));

  // Path total length approx 750px
  const pathLength = 750;
  const strokeDashoffset = pathLength * (1 - routeProgress);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 relative">
      <svg
        viewBox="0 0 760 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
      >
        {/* Background Track Line Glow */}
        <path
          d="M 60 90 Q 200 110 340 140 T 500 190 T 680 250"
          stroke="#1E293B"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Glowing Active Route Line */}
        <path
          d="M 60 90 Q 200 110 340 140 T 500 190 T 680 250"
          stroke="url(#routeGlowGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />

        {/* Station Nodes */}
        {STATIONS.map((stn) => {
          const isVisible = progress >= stn.threshold;
          const isCurrent = progress >= stn.threshold && progress < stn.threshold + 0.04;

          return (
            <g
              key={stn.code}
              style={{
                opacity: isVisible ? 1 : 0.15,
                transform: `scale(${isVisible ? 1 : 0.7})`,
                transformOrigin: `${stn.cx}px ${stn.cy}px`,
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              {/* Pulse Ring */}
              {isCurrent && (
                <circle
                  cx={stn.cx}
                  cy={stn.cy}
                  r="16"
                  fill="#38BDF8"
                  fillOpacity="0.25"
                  className="animate-ping"
                />
              )}

              {/* Outer Station Circle */}
              <circle
                cx={stn.cx}
                cy={stn.cy}
                r="9"
                fill={isVisible ? "#0B1220" : "#1E293B"}
                stroke={isVisible ? "#38BDF8" : "#475569"}
                strokeWidth="3"
              />

              {/* Inner Node Dot */}
              <circle
                cx={stn.cx}
                cy={stn.cy}
                r="4"
                fill={isVisible ? "#38BDF8" : "#94A3B8"}
              />

              {/* Station Label */}
              <text
                x={stn.cx}
                y={stn.cy - 18}
                textAnchor="middle"
                fill={isVisible ? "#FFFFFF" : "#64748B"}
                fontSize="12"
                fontWeight="700"
                fontFamily="sans-serif"
              >
                {stn.name}
              </text>
              <text
                x={stn.cx}
                y={stn.cy - 6}
                textAnchor="middle"
                fill="#38BDF8"
                fontSize="9"
                fontWeight="800"
                fontFamily="monospace"
              >
                {stn.code}
              </text>
            </g>
          );
        })}

        <defs>
          <linearGradient id="routeGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
