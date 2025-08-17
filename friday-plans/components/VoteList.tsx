'use client';

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { currentFridayKey } from "@/lib/week";

type Task = { id: string; title: string; created_by: string; created_by_name: string | null; created_by_image: string | null; created_at: string };
type VoteRow = { id: string; task_id: string; user_id: string; week: string; created_at: string };

export default function VoteList() {
  const week = currentFridayKey();
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [votes, setVotes] = useState<VoteRow[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    const [tRes, vRes] = await Promise.all([
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      supabase.from("votes").select("*").eq("week", week)
    ]);

    if (tRes.error) alert(tRes.error.message);
    if (vRes.error) alert(vRes.error.message);

    setTasks(tRes.data ?? []);
    setVotes(vRes.data ?? []);
  }

  useEffect(() => {
    load();
    const onChanged = () => load();
    window.addEventListener("votes:changed", onChanged);
    return () => window.removeEventListener("votes:changed", onChanged);
  }, [week]);

  const tally = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of votes) map[v.task_id] = (map[v.task_id] ?? 0) + 1;
    return map;
  }, [votes]);

  const myVoteTaskId = useMemo(() => {
    if (!user) return null;
    const v = votes.find((x) => x.user_id === user.id);
    return v?.task_id ?? null;
  }, [votes, user]);

  async function vote(taskId: string) {
    if (!user) return alert("Please sign in first.");
    setLoading(true);

    // Remove my previous vote for this week, then insert new one
    const del = await supabase.from("votes").delete().eq("user_id", user.id).eq("week", week);
    if (del.error) {
      setLoading(false);
      return alert(del.error.message);
    }

    const ins = await supabase.from("votes").insert({ task_id: taskId, user_id: user.id, week });
    setLoading(false);
    if (ins.error) return alert(ins.error.message);

    // Tell listeners to reload
    window.dispatchEvent(new Event("votes:changed"));
  }

  return (
    <div className="space-y-3">
      {tasks.length === 0 && <div className="opacity-70">No ideas yet — add one first.</div>}
      {tasks.map((t) => {
        const count = tally[t.id] || 0;
        const mine = myVoteTaskId === t.id;
        return (
          <div key={t.id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm opacity-70">Votes: {count}</div>
            </div>
            <button className="btn" disabled={loading || mine} onClick={() => vote(t.id)}>
              {mine ? "Your vote" : "Vote"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
