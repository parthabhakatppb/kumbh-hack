"use client";

import React, { useState, useEffect } from "react";
import {
  Radio,
  Send,
  X,
  Megaphone,
  AlertTriangle,
  Package,
  Shield,
  CheckCircle,
  Clock,
} from "lucide-react";

interface Broadcast {
  id: string;
  type: "emergency" | "resource" | "info" | "lockdown";
  message: string;
  target: string;
  time: string;
  status: "sent" | "acknowledged";
}

interface BroadcastPanelProps {
  isOpen: boolean;
  onClose: () => void;
  threatLevel: string;
}

const PRESET_MESSAGES = {
  emergency: [
    "STAMPEDE RISK DETECTED at Ram Ghat — Clear the sector NOW. All ground teams to positions.",
    "Medical emergency reported at Sector 2 (Mahakal). Dispatch MRT-Alpha immediately.",
    "Crowd surge detected. Activate Route Delta diversion. Block eastern entry points.",
    "CRITICAL: Unsafe density at Sangam Ghat. Mobilize crowd control barriers.",
  ],
  resource: [
    "Deploy water distribution unit to Ram Ghat. Estimated 50,000 pilgrims en route.",
    "Request additional lighting at Sector 3. Night operations commencing.",
    "Medical supplies needed at Hub Dewas Transit. Restock kits.",
    "Barrier team required at Indore Highway junction. Divert vehicle flow.",
  ],
  info: [
    "Planned disruption: VIP convoy passing via Route Alpha in 15 mins. Hold sectors.",
    "Bus arrival wave incoming — Dhar Holding Hub at 70% capacity. Prepare overflow.",
    "Prayer timing shift: Expect 30% surge at Mahakal zone in the next 20 minutes.",
    "Shift change reminder: All field supervisors report to Command Zone by 0200.",
  ],
};

const TARGETS = [
  "ALL GROUND UNITS",
  "Alpha Team (Ram Ghat)",
  "Bravo Team (Mahakal)",
  "Charlie Team (Sangam)",
  "Delta Team (Dutt Akhada)",
  "Medical Response Teams",
  "Traffic Control Units",
  "Barrier & Barricade Crew",
  "VIP Security Detail",
];

export default function BroadcastPanel({ isOpen, onClose, threatLevel }: BroadcastPanelProps) {
  const [tab, setTab] = useState<"compose" | "emergency" | "resource">("compose");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState(TARGETS[0]);
  const [priority, setPriority] = useState<"normal" | "urgent" | "critical">("normal");
  const [log, setLog] = useState<Broadcast[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Auto-populate message on critical threat
  useEffect(() => {
    if (threatLevel === "CRITICAL" && tab === "compose" && message === "") {
      setMessage(PRESET_MESSAGES.emergency[0]);
      setPriority("critical");
    }
  }, [threatLevel]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate broadcast latency

    const newBroadcast: Broadcast = {
      id: Date.now().toString(),
      type: priority === "critical" ? "emergency" : tab === "resource" ? "resource" : "info",
      message,
      target,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      status: "sent",
    };
    setLog((prev) => [newBroadcast, ...prev.slice(0, 9)]);

    // Simulate acknowledgement after 3s
    setTimeout(() => {
      setLog((prev) =>
        prev.map((b) => (b.id === newBroadcast.id ? { ...b, status: "acknowledged" } : b))
      );
    }, 3000);

    setIsSending(false);
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 2000);
  };

  const handlePreset = (msg: string, type: "emergency" | "resource") => {
    setMessage(msg);
    setPriority(type === "emergency" ? "critical" : "urgent");
    setTab("compose");
  };

  if (!isOpen) return null;

  const typeColors = {
    emergency: "border-rose-500/40 bg-rose-500/5",
    resource: "border-sky-500/40 bg-sky-500/5",
    info: "border-slate-600/40 bg-slate-800/40",
    lockdown: "border-purple-500/40 bg-purple-500/5",
  };
  const typeIcons = {
    emergency: <AlertTriangle className="h-3 w-3 text-rose-400" />,
    resource: <Package className="h-3 w-3 text-sky-400" />,
    info: <Megaphone className="h-3 w-3 text-slate-400" />,
    lockdown: <Shield className="h-3 w-3 text-purple-400" />,
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/60 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Megaphone className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm font-mono tracking-wider text-slate-100">FIELD BROADCAST SYSTEM</h2>
              <p className="text-[10px] text-slate-500 font-mono">Secured comm channel — All ground units reachable</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <Radio className="h-3 w-3 animate-pulse" />
              LIVE
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Compose */}
          <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto border-r border-slate-800">
            {/* Tabs */}
            <div className="flex gap-1 bg-slate-950/50 p-1 rounded-lg">
              {(["compose", "emergency", "resource"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-1.5 text-[10px] font-mono font-bold rounded-md transition-all ${
                    tab === t
                      ? t === "emergency"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : t === "resource"
                        ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-600 hover:text-slate-400"
                  }`}
                >
                  {t === "compose" ? "COMPOSE" : t === "emergency" ? "🚨 EMERGENCY" : "📦 RESOURCE"}
                </button>
              ))}
            </div>

            {tab === "compose" ? (
              <>
                {/* Target Selector */}
                <div>
                  <label className="text-[10px] font-mono text-slate-500 font-bold tracking-wider mb-1.5 block">BROADCAST TARGET</label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                  >
                    {TARGETS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-[10px] font-mono text-slate-500 font-bold tracking-wider mb-1.5 block">PRIORITY LEVEL</label>
                  <div className="flex gap-2">
                    {(["normal", "urgent", "critical"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-1.5 text-[10px] font-mono font-bold rounded-lg border transition-all ${
                          priority === p
                            ? p === "critical"
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                              : p === "urgent"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-slate-900 text-slate-600 border-slate-800 hover:border-slate-600"
                        }`}
                      >
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="flex-1">
                  <label className="text-[10px] font-mono text-slate-500 font-bold tracking-wider mb-1.5 block">MESSAGE</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your broadcast message here..."
                    rows={5}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-300 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 resize-none placeholder-slate-700"
                  />
                  <p className="text-[10px] text-slate-700 mt-1 font-mono">{message.length}/500 chars</p>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || isSending}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all font-mono tracking-wider border ${
                    sent
                      ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/40"
                      : priority === "critical"
                      ? "bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-900/30 disabled:opacity-50"
                      : priority === "urgent"
                      ? "bg-amber-600 hover:bg-amber-500 text-white border-amber-500 disabled:opacity-50"
                      : "bg-emerald-600/80 hover:bg-emerald-500 text-white border-emerald-500/60 disabled:opacity-50"
                  }`}
                >
                  {sent ? (
                    <><CheckCircle className="h-4 w-4" /> BROADCAST SENT</>
                  ) : isSending ? (
                    <><Radio className="h-4 w-4 animate-pulse" /> TRANSMITTING...</>
                  ) : (
                    <><Send className="h-4 w-4" /> BROADCAST TO {target.split("(")[0].trim()}</>
                  )}
                </button>
              </>
            ) : (
              /* Presets */
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 font-mono font-bold tracking-wider">
                  {tab === "emergency" ? "SELECT EMERGENCY BROADCAST PRESET" : "SELECT RESOURCE BROADCAST PRESET"}
                </p>
                {(tab === "emergency" ? PRESET_MESSAGES.emergency : PRESET_MESSAGES.resource).map((msg, i) => (
                  <button
                    key={i}
                    onClick={() => handlePreset(msg, tab as "emergency" | "resource")}
                    className={`w-full text-left p-3 rounded-lg border text-[11px] font-mono transition-all ${
                      tab === "emergency"
                        ? "border-rose-500/20 bg-rose-500/5 text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/10"
                        : "border-sky-500/20 bg-sky-500/5 text-sky-300 hover:border-sky-500/40 hover:bg-sky-500/10"
                    }`}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Broadcast Log */}
          <div className="w-64 p-4 flex flex-col gap-3 overflow-y-auto">
            <h3 className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">BROADCAST LOG</h3>
            {log.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-[10px] text-slate-700 font-mono text-center">
                No broadcasts sent yet
              </div>
            ) : (
              log.map((b) => (
                <div key={b.id} className={`rounded-lg border p-2.5 ${typeColors[b.type]}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {typeIcons[b.type]}
                      <span className="text-[9px] font-mono font-bold text-slate-400">{b.target.split("(")[0].trim()}</span>
                    </div>
                    {b.status === "acknowledged" ? (
                      <div className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle className="h-2.5 w-2.5" />
                        <span className="text-[8px] font-mono">ACK</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Clock className="h-2.5 w-2.5" />
                        <span className="text-[8px] font-mono">SENT</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono leading-relaxed line-clamp-3">{b.message}</p>
                  <p className="text-[8px] text-slate-700 font-mono mt-1.5">{b.time}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
