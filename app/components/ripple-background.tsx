"use client";

import React from "react";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 450;

export function WaterBackground() {
  return (
    <div className="w-full h-full rounded-3xl overflow-hidden bg-slate-950">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Overall water gradient */}
          <linearGradient
            id="waterGradient"
            x1="0"
            y1="0"
            x2="0"
            y2={SVG_HEIGHT}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#020617" />
            <stop offset="35%" stopColor="#0b2146" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Soft glow behind the center drop */}
          <radialGradient
            id="centerGlow"
            cx="50%"
            cy="45%"
            r="45%"
            fx="50%"
            fy="40%"
          >
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#0b2146" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Water background */}
        <rect
          x={0}
          y={0}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          fill="url(#waterGradient)"
        />

        {/* Center glow to make the middle feel like a focal point */}
        <ellipse
          cx={SVG_WIDTH / 2}
          cy={SVG_HEIGHT * 0.45}
          rx={SVG_WIDTH * 0.35}
          ry={SVG_HEIGHT * 0.4}
          fill="url(#centerGlow)"
        />

        {/* Subtle surface waves */}
        <path
          d={`
            M0 ${SVG_HEIGHT * 0.32}
            C ${SVG_WIDTH * 0.2} ${SVG_HEIGHT * 0.27},
              ${SVG_WIDTH * 0.4} ${SVG_HEIGHT * 0.37},
              ${SVG_WIDTH * 0.6} ${SVG_HEIGHT * 0.3}
            C ${SVG_WIDTH * 0.8} ${SVG_HEIGHT * 0.23},
              ${SVG_WIDTH * 0.9} ${SVG_HEIGHT * 0.28},
              ${SVG_WIDTH} ${SVG_HEIGHT * 0.26}
          `}
          stroke="#38bdf8"
          strokeOpacity={0.18}
          strokeWidth={1.6}
          fill="none"
        />
        <path
          d={`
            M0 ${SVG_HEIGHT * 0.48}
            C ${SVG_WIDTH * 0.15} ${SVG_HEIGHT * 0.43},
              ${SVG_WIDTH * 0.45} ${SVG_HEIGHT * 0.53},
              ${SVG_WIDTH * 0.7} ${SVG_HEIGHT * 0.46}
            C ${SVG_WIDTH * 0.9} ${SVG_HEIGHT * 0.4},
              ${SVG_WIDTH * 0.95} ${SVG_HEIGHT * 0.44},
              ${SVG_WIDTH} ${SVG_HEIGHT * 0.42}
          `}
          stroke="#0ea5e9"
          strokeOpacity={0.18}
          strokeWidth={1.3}
          fill="none"
        />
        <path
          d={`
            M0 ${SVG_HEIGHT * 0.64}
            C ${SVG_WIDTH * 0.18} ${SVG_HEIGHT * 0.6},
              ${SVG_WIDTH * 0.5} ${SVG_HEIGHT * 0.7},
              ${SVG_WIDTH * 0.78} ${SVG_HEIGHT * 0.62}
            C ${SVG_WIDTH * 0.92} ${SVG_HEIGHT * 0.57},
              ${SVG_WIDTH * 0.97} ${SVG_HEIGHT * 0.6},
              ${SVG_WIDTH} ${SVG_HEIGHT * 0.58}
          `}
          stroke="#38bdf8"
          strokeOpacity={0.12}
          strokeWidth={1.1}
          fill="none"
        />

        {/* Single center drop */}
        <g
          transform={`translate(${SVG_WIDTH / 2}, ${SVG_HEIGHT * 0.42})`}
          className="animate-pulse"
        >
          {/* ripple rings (subtle; overlay will add the “real” ones) */}
          <circle
            cx={0}
            cy={16}
            r={26}
            fill="none"
            stroke="#38bdf8"
            strokeWidth={1.1}
            opacity={0.4}
          />
          <circle
            cx={0}
            cy={16}
            r={38}
            fill="none"
            stroke="#38bdf8"
            strokeWidth={0.9}
            opacity={0.2}
          />

          {/* droplet shape */}
          <path
            d="M0 -28 C 9 -17 15 -5 15 4 C 15 15 8 23 0 23 C -8 23 -15 15 -15 4 C -15 -5 -9 -17 0 -28 Z"
            fill="#38bdf8"
            stroke="white"
            strokeWidth={1.4}
          />

          {/* small highlight */}
          <circle cx={-4} cy={-14} r={4} fill="white" opacity={0.45} />
        </g>
      </svg>
    </div>
  );
}
