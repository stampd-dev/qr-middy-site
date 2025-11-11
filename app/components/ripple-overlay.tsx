"use client";

import React, { useEffect, useState } from "react";

export interface Ripple {
  name: string;
  location: string;
}

// Design baseline aspect ratio
const BASE_WIDTH = 800;
const BASE_HEIGHT = 450;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// Hook: track window size so we can size the SVG to the screen
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

// Layout tuned for up to ~10 ripples:
// - Outer ring near the edge
// - Optional inner ring slightly closer to center
function computeRipplePositions(
  count: number,
  svgWidth: number,
  svgHeight: number
) {
  if (count <= 0) return [];

  // Predefined layout for up to 10 ripples.
  // fx, fy are fractions of width/height (0..1), biased toward edges.
  const baseLayout: { fx: number; fy: number }[] = [
    { fx: 0.15, fy: 0.18 }, // upper-left
    { fx: 0.5, fy: 0.14 }, // top-center
    { fx: 0.85, fy: 0.18 }, // upper-right

    { fx: 0.92, fy: 0.38 }, // mid-right upper
    { fx: 0.92, fy: 0.62 }, // mid-right lower

    { fx: 0.85, fy: 0.82 }, // lower-right
    { fx: 0.5, fy: 0.88 }, // bottom-center
    { fx: 0.15, fy: 0.82 }, // lower-left

    { fx: 0.08, fy: 0.62 }, // mid-left lower
    { fx: 0.08, fy: 0.38 }, // mid-left upper
  ];

  const usedCount = Math.min(count, baseLayout.length);
  const positions: { x: number; y: number }[] = [];

  // First fill using the fixed layout, scaled by svgWidth/svgHeight
  for (let i = 0; i < usedCount; i++) {
    const { fx, fy } = baseLayout[i];
    positions.push({
      x: fx * svgWidth,
      y: fy * svgHeight,
    });
  }

  // If count > layout length, cycle through the base positions
  if (count > usedCount) {
    for (let i = usedCount; i < count; i++) {
      const { fx, fy } = baseLayout[i % baseLayout.length];
      positions.push({
        x: fx * svgWidth,
        y: fy * svgHeight,
      });
    }
  }

  return positions;
}

export function RippleOverlay({ ripples }: { ripples: Ripple[] }) {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const svgWidth = windowWidth - 50;
  const svgHeight = windowHeight - 50;

  // Scale droplet size based on width, but don't mess with radius anymore
  const rawFactor = svgWidth / BASE_WIDTH;
  const dropletScale = clamp(rawFactor, 0.9, 1.4);

  const positions = computeRipplePositions(
    ripples.length || 0,
    svgWidth,
    svgHeight
  );

  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* CSS for ripple animation: expand & fade from droplet center */}
      <defs>
        <style>
          {`
            @keyframes rippleRing {
              0% {
                transform: scale(0.5);
                opacity: 0.7;
              }
              70% {
                transform: scale(1.4);
                opacity: 0;
              }
              100% {
                transform: scale(1.4);
                opacity: 0;
              }
            }
            .ripple-ring {
              transform-box: fill-box;
              transform-origin: center;
              animation: rippleRing 2.4s ease-out infinite;
            }
            .ripple-ring--delay {
              transform-box: fill-box;
              transform-origin: center;
              animation: rippleRing 2.4s ease-out infinite;
              animation-delay: 1.2s;
            }
          `}
        </style>
      </defs>

      {/* Center origin marker */}
      <g className="animate-pulse">
        <circle
          cx={centerX}
          cy={centerY}
          r={5}
          fill="#fbbf24"
          stroke="white"
          strokeWidth={1.4}
        />
      </g>

      {ripples.map((ripple, index) => {
        const pos = positions[index] || { x: centerX, y: centerY };
        const { x, y } = pos;

        return (
          <g key={`${ripple.name}-${index}`}>
            {/* Droplet + animated rings + labels */}
            <g transform={`translate(${x}, ${y})`}>
              {/* Animated ripple rings expanding from droplet center */}
              <g transform={`scale(${dropletScale})`}>
                <circle
                  cx={0}
                  cy={0}
                  r={16}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={1}
                  className="ripple-ring"
                />
                <circle
                  cx={0}
                  cy={0}
                  r={16}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={0.9}
                  className="ripple-ring ripple-ring--delay"
                />

                {/* Droplet */}
                <path
                  d="M0 -14 C 5 -8 8 -2 8 3 C 8 9 4 13 0 13 C -4 13 -8 9 -8 3 C -8 -2 -5 -8 0 -14 Z"
                  fill="#38bdf8"
                  stroke="white"
                  strokeWidth={1}
                />
                <circle cx={-3} cy={-7} r={2.5} fill="white" opacity={0.5} />

                {/* Labels – name on top, location underneath */}
                <text
                  x={0}
                  y={-26}
                  textAnchor="middle"
                  fill="#e5e7eb"
                  fontSize={10}
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                >
                  {ripple.name}
                </text>
                <text
                  x={0}
                  y={-14}
                  textAnchor="middle"
                  fill="#cbd5f5"
                  fontSize={8}
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                >
                  {ripple.location}
                </text>
              </g>
            </g>
          </g>
        );
      })}

      {ripples.length === 0 && (
        <text
          x={centerX}
          y={svgHeight * 0.85}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={11}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        >
          Ripples will appear as scans come in.
        </text>
      )}
    </svg>
  );
}
