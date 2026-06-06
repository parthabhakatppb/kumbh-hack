"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";

interface HistoryTick {
  tick: number;
  timestamp: string;
  sectors: Record<string, { density: number; status: string }>;
  hubs: Record<string, { occupancy: number; status: string }>;
}

interface MetricsPanelProps {
  telemetryData: {
    sectors: Record<
      string,
      { name: string; current_density: number; status: string }
    >;
    hubs: Record<
      string,
      {
        name: string;
        capacity: number;
        current_occupancy: number;
        transit_status: string;
      }
    >;
  } | null;
  history: HistoryTick[];
}

// Custom tooltip styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[10px] text-slate-400 font-mono mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-[11px] font-mono font-semibold" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
          {entry.name.includes("Density") ? "%" : ""}
        </p>
      ))}
    </div>
  );
};

export default function MetricsPanel({ telemetryData, history }: MetricsPanelProps) {
  if (!telemetryData) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-600 font-mono tracking-wider">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-slate-700 animate-pulse" />
          Awaiting telemetry stream...
        </div>
      </div>
    );
  }

  // Build time-series data from history
  const timeSeriesData = useMemo(() => {
    if (!history || history.length === 0) return [];
    return history.map((tick) => ({
      time: tick.timestamp,
      "Ram Ghat": tick.sectors?.sec_1?.density ?? 0,
      "Mahakal": tick.sectors?.sec_2?.density ?? 0,
      "Sangam": tick.sectors?.sec_3?.density ?? 0,
      "Dutt Akhada": tick.sectors?.sec_4?.density ?? 0,
    }));
  }, [history]);

  // Current hub data for bar chart
  const hubData = useMemo(() => {
    return Object.entries(telemetryData.hubs).map(([id, h]) => {
      const loadPercent = h.capacity > 0 ? (h.current_occupancy / h.capacity) * 100 : 0;
      return {
        name: h.name.split(" ")[0],
        Load: Math.round(loadPercent),
        Capacity: 100,
        occupancy: h.current_occupancy,
        capacity: h.capacity,
        status: h.transit_status,
      };
    });
  }, [telemetryData.hubs]);

  const getBarColor = (loadPercent: number) => {
    if (loadPercent >= 85) return "#f43f5e";
    if (loadPercent >= 70) return "#f59e0b";
    if (loadPercent >= 50) return "#38bdf8";
    return "#10b981";
  };

  return (
    <div className="w-full h-full grid grid-cols-2 gap-4">
      {/* ===== LEFT: Time-Series Density Chart ===== */}
      <div className="flex flex-col h-full">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1.5 flex items-center gap-2 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          SECTOR DENSITY — TEMPORAL STREAM
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="grad-rose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-amber" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-emerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#334155"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#334155"
                fontSize={9}
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={85}
                stroke="#f43f5e"
                strokeDasharray="3 3"
                strokeOpacity={0.4}
                label={{ value: "CRITICAL", position: "right", fill: "#f43f5e", fontSize: 8 }}
              />
              <ReferenceLine
                y={75}
                stroke="#f59e0b"
                strokeDasharray="3 3"
                strokeOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="Ram Ghat"
                stroke="#f43f5e"
                strokeWidth={1.5}
                fill="url(#grad-rose)"
                dot={false}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="Mahakal"
                stroke="#f59e0b"
                strokeWidth={1.5}
                fill="url(#grad-amber)"
                dot={false}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="Sangam"
                stroke="#10b981"
                strokeWidth={1.5}
                fill="url(#grad-emerald)"
                dot={false}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="Dutt Akhada"
                stroke="#38bdf8"
                strokeWidth={1.5}
                fill="url(#grad-sky)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== RIGHT: Hub Load Distribution ===== */}
      <div className="flex flex-col h-full">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1.5 flex items-center gap-2 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
          HUB LOAD DISTRIBUTION — % CAPACITY
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hubData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 6" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#334155"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#334155"
                fontSize={9}
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={85}
                stroke="#f43f5e"
                strokeDasharray="3 3"
                strokeOpacity={0.3}
              />
              <Bar dataKey="Load" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {hubData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.Load)} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}