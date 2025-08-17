'use client';

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { currentFridayKey } from "@/lib/week";

type Task = { id: string; title: string };
type Vote = { task_id: string; week: string };

function degToRad(deg: number) { return (deg * Math.PI) / 180; }
function polar(cx:number, cy:number, r:number, aDeg:number) {
  const a = degToRad(aDeg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function arcPath(cx:number, cy:number, r:number, startDeg:number, endDeg:number) {
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, endDeg);
  const sweep = 1;
  const largeArc = ((endDeg - startDeg + 360) % 360) > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${e.x} ${e.y} Z`;
}

const PALETTE = ["#6EE7B7","#60A5FA","#FDE68A","#FCA5A5","#C4B5FD","#93C5FD","#FDBA74","#A7F3D0","#F9A8D4","#FCD34D"];

export default function SpinWheel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [mode, setMode] = useState<"all"|"top">("all");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0); // degrees applied to the wheel group
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  const week = currentFridayKey();

  async function load() {
    const [tRes, vRes] = await Promise.all([
      supabase.from("tasks").select("id,title").order("created_at", { ascending: false }),
      supabase.from("votes").select("task_id,week").eq("week", week),
    ]);
    if (!tRes.error) setTasks(tRes.data ?? []);
    if (!vRes.error) setVotes(vRes.data ?? []);
  }

  useEffect(() => {
    load();
    const onTasks = () => load();
    const onVotes = () => load();
    window.addEventListener("tasks:changed", onTasks);
    window.addEventListener("votes:changed", onVotes);
    return () => {
      window.removeEventListener("tasks:changed", onTasks);
      window.removeEventListener("votes:changed", onVotes);
    };
  }, [week]);

  const entries = useMemo(() => {
    if (!tasks.length) return [] as { option: string; taskId: string }[];
    if (mode === "all") return tasks.map(t => ({ option: t.title, taskId: t.id }));
    const counts: Record<string, number> = {};
    for (const v of votes) counts[v.task_id] = (counts[v.task_id] ?? 0) + 1;
    const weighted: { option: string; taskId: string }[] = [];
    for (const t of tasks) {
      const c = counts[t.id] || 0;
      if (c > 0) for (let i = 0; i < c; i++) weighted.push({ option: t.title, taskId: t.id });
    }
    return weighted.length ? weighted : tasks.map(t => ({ option: t.title, taskId: t.id }));
  }, [tasks, votes, mode]);

  // reset winner when entries change
  useEffect(() => { setWinnerIndex(null); }, [entries.length, mode]);

  function spin() {
    if (!entries.length || spinning) return;

    const n = entries.length;
    const slice = 360 / n;

    // pick a random winner index
    const idx = Math.floor(Math.random() * n);
    setWinnerIndex(idx);

    // bring chosen slice center to top (-90°)
    const center = idx * slice - 90 + slice / 2;

    // current rotation modulo 360 [0,360)
    const current = ((rotation % 360) + 360) % 360;
    const target = 270; // -90° mod 360
    const baseDelta = (target - (center + current)) % 360;
    const normalizedDelta = (baseDelta + 360) % 360;

    const final = rotation + 6 * 360 + normalizedDelta;
    setSpinning(true);
    setRotation(final);
    window.setTimeout(() => setSpinning(false), 1800);
  }

  // SVG geometry
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 160;
  const n = entries.length;
  const sliceAngle = n ? 360 / n : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm opacity-80">Spin from:</label>
        <select className="input" value={mode} onChange={e => setMode(e.target.value as "all"|"top")}>
          <option value="all">All tasks</option>
          <option value="top">Top-voted (weighted)</option>
        </select>
        <button className="btn" onClick={load}>Reload</button>
      </div>

      {!n ? (
        <div className="card">No tasks yet — add some first.</div>
      ) : (
        <div className="card flex flex-col items-center gap-4">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <defs>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* WHEEL GROUP (only this rotates) */}
              <g
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 1.8s cubic-bezier(0.19, 1, 0.22, 1)",
                }}
                filter="url(#shadow)"
              >
                {entries.map((e, i) => {
                  const start = i * sliceAngle - 90; // start at top
                  const end = start + sliceAngle;
                  const mid = start + sliceAngle / 2;
                  const path = arcPath(cx, cy, radius, start, end);
                  const labelPos = polar(cx, cy, radius * 0.62, mid);
                  const color = PALETTE[i % PALETTE.length];

                  return (
                    <g key={i}>
                      <path d={path} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        fontSize="12"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${mid + 90}, ${labelPos.x}, ${labelPos.y})`}
                        style={{ fill: "#111827" }}
                      >
                        {e.option.length > 22 ? e.option.slice(0, 22) + "…" : e.option}
                      </text>
                    </g>
                  );
                })}

                {/* Center cap (also clickable button via onClick on a transparent circle) */}
                <circle cx={cx} cy={cy} r={42} fill="#ffffff" stroke="rgba(0,0,0,0.15)" />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#374151"
                  style={{ pointerEvents: "none" }}
                >
                  {spinning ? "…" : "Click me"}
                </text>
                {/* Invisible hit area to capture clicks on the center cap */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={42}
                  fill="transparent"
                  style={{ cursor: spinning ? "default" : "pointer" }}
                  onClick={() => { if (!spinning) spin(); }}
                />
              </g>

              {/* FIXED POINTER (does NOT rotate) */}
              <polygon
                points={`${cx-12},${cy-radius-2} ${cx+12},${cy-radius-2} ${cx},${cy-radius-22}`}
                fill="#ef4444"             // red-500
                stroke="rgba(0,0,0,0.35)"  // outline for dark mode
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Winner */}
          {winnerIndex != null && !spinning && entries[winnerIndex] && (
            <div className="text-center">
              🎉 Winner: <strong>{entries[winnerIndex].option}</strong>
            </div>
          )}

          {/* Legend */}
          <div className="w-full max-w-md">
            <h3 className="text-sm font-medium mb-2">Legend</h3>
            <ul className="space-y-2">
              {entries.map((e, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                  <span className="text-sm">{e.option}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
