import React from "react";

interface SparklineChartProps {
  data: number[];
  isPositive?: boolean;
  width?: number;
  height?: number;
}

export function SparklineChart({ data = [], isPositive = true, width = 100, height = 30 }: SparklineChartProps) {
  if (!data || data.length < 2) return null;

  // downsample to max 40 points
  const samples = data.length > 40 ? data.filter((_, i) => i % Math.ceil(data.length / 40) === 0).slice(-40) : data;
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const range = max - min || 1;

  const path = samples
    .map((v, i) => {
      const x = (i / (samples.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const strokeClass = isPositive ? "stroke-chart-up" : "stroke-chart-down";
  const gradientId = `spark-${Math.round(min * 1000)}-${Math.round(max * 1000)}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopOpacity="0.22" />
          <stop offset="100%" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={path} fill="none" strokeWidth={1.6} className={strokeClass} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill={`url(#${gradientId})`} opacity={0.6} className={strokeClass} />
    </svg>
  );
}
