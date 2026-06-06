"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  X,
  Shield,
  CheckCircle,
  Loader2,
  Radio,
  Users,
  Navigation,
  Lock,
  Zap,
  Volume2,
} from "lucide-react";

interface AntiStampedeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const LOCKDOWN_ACTIONS = [
  {
    icon: <Lock className="h-4 w-4 text-rose-400" />,
    title: "Entry Lockdown",
    desc: "Seal all inbound access points to Ram Ghat, Mahakal & Sangam sectors. Zero new pilgrim entry.",
    bg: "bg-rose-500/5 border-rose-500/20",
  },
  {
    icon: <Navigation className="h-4 w-4 text-amber-400" />,
    title: "Emergency Diversion",
    desc: "Activate Route Epsilon & Zeta diversions. Redirect all pedestrian traffic to Dhar Holding Hub.",
    bg: "bg-amber-500/5 border-amber-500/20",
  },
  {
    icon: <Users className="h-4 w-4 text-sky-400" />,
    title: "Crowd Thinning Protocol",
    desc: "Deploy barrier teams to create movement corridors. Enforce 1-way flow across all 4 sectors.",
    bg: "bg-sky-500/5 border-sky-500/20",
  },
  {
    icon: <Radio className="h-4 w-4 text-purple-400" />,
    title: "Ground Alert Broadcast",
    desc: "Auto-broadcast CRITICAL alert to all field units. MRT teams placed on standby.",
    bg: "bg-purple-500/5 border-purple-500/20",
  },
  {
    icon: <Volume2 className="h-4 w-4 text-emerald-400" />,
    title: "PA System Announcement",
    desc: "Trigger public address system across all zones: calm evacuation instructions in 5 languages.",
    bg: "bg-emerald-500/5 border-emerald-500/20",
  },
  {
    icon: <Zap className="h-4 w-4 text-yellow-400" />,
    title: "Hub Flush Command",
    desc: "Force-clear transit hub queues. Priority boarding to outbound buses. Density drop target: 40%.",
    bg: "bg-yellow-500/5 border-yellow-500/20",
  },
];

export default function AntiStampedeModal({ isOpen, onClose, onConfirm }: AntiStampedeModalProps) {
  const [phase, setPhase] = useState<"confirm" | "executing" | "done">("confirm");
  const [executedActions, setExecutedActions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(5);

  const handleExecute = async () => {
    setPhase("executing");
    // Animate each action one by one
    for (let i = 0; i < LOCKDOWN_ACTIONS.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setExecutedActions((prev) => [...prev, i]);
    }
    // Call actual backend override
    await onConfirm();
    setPhase("done");
    // Start countdown to auto-close
    let t = 5;
    const countdown = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(countdown);
        onClose();
        setPhase("confirm");
        setExecutedActions([]);
        setTimeLeft(5);
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop with red tint for critical emphasis */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
      {phase === "executing" && (
        <div className="absolute inset-0 bg-rose-950/10 animate-pulse pointer-events-none" />
      )}

      {/* Modal */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-rose-500/40 bg-slate-900 shadow-2xl shadow-rose-900/30 overflow-hidden">
        {/* Danger header */}
        <div className={`px-5 py-4 border-b border-rose-500/30 ${phase === "executing" ? "bg-rose-950/40" : "bg-rose-500/5"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                <Shield className="h-5 w-5 text-rose-400" />
              </div>
              <div>
                <h2 className="font-bold text-base font-mono tracking-wider text-rose-300">
                  ANTI-STAMPEDE LOCKDOWN
                </h2>
                <p className="text-[10px] text-rose-600 font-mono">
                  {phase === "confirm" && "⚠ This will immediately override all sector operations"}
                  {phase === "executing" && "🔴 EXECUTING LOCKDOWN PROTOCOL — DO NOT INTERRUPT"}
                  {phase === "done" && "✓ LOCKDOWN COMPLETE — System stabilized"}
                </p>
              </div>
            </div>
            {phase !== "executing" && (
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="p-5">
          {phase === "confirm" && (
            <>
              <p className="text-sm text-slate-400 mb-4 font-mono leading-relaxed">
                Executing this command will immediately deploy{" "}
                <span className="text-rose-400 font-bold">6 simultaneous emergency protocols</span>{" "}
                across all micro-sectors and transit hubs. This action is intended for{" "}
                <span className="text-amber-400">imminent stampede prevention</span>.
              </p>
              <div className="space-y-2 mb-5">
                {LOCKDOWN_ACTIONS.map((action, i) => (
                  <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg border ${action.bg}`}>
                    <div className="mt-0.5">{action.icon}</div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-300 font-mono">{action.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 leading-relaxed">{action.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 text-sm font-mono font-bold transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleExecute}
                  className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/40 border border-rose-500"
                >
                  <Shield className="h-4 w-4" />
                  EXECUTE LOCKDOWN
                </button>
              </div>
            </>
          )}

          {phase === "executing" && (
            <div className="space-y-2">
              {LOCKDOWN_ACTIONS.map((action, i) => {
                const done = executedActions.includes(i);
                const active = executedActions.length === i;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-500 ${
                      done
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : active
                        ? "border-rose-500/40 bg-rose-500/10 animate-pulse"
                        : "border-slate-800 bg-slate-900/50 opacity-40"
                    }`}
                  >
                    <div>
                      {done ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : active ? (
                        <Loader2 className="h-4 w-4 text-rose-400 animate-spin" />
                      ) : (
                        action.icon
                      )}
                    </div>
                    <p className={`text-[11px] font-bold font-mono ${done ? "text-emerald-400" : active ? "text-rose-300" : "text-slate-600"}`}>
                      {done ? `✓ ${action.title} — ACTIVE` : active ? `DEPLOYING: ${action.title}...` : action.title}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {phase === "done" && (
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold font-mono text-emerald-400 mb-2">LOCKDOWN EXECUTED</h3>
              <p className="text-sm text-slate-400 font-mono">
                All 6 protocols are active. Crowd density is being reduced.<br />
                Ground teams have been notified.
              </p>
              <p className="text-xs text-slate-600 font-mono mt-4">Auto-closing in {timeLeft}s...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
