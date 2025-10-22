'use client';

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

type Task = {
  id: string;
  title: string;
  created_by: string;
  created_by_name: string | null;
  created_by_image: string | null;
  created_at: string;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useUser();

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return alert(error.message);
    setTasks(data ?? []);
  }, []);

  function notify() {
    window.dispatchEvent(new Event("tasks:changed"));
  }

  useEffect(() => {
    load();
    const onChanged = () => load();
    window.addEventListener("tasks:changed", onChanged);
    return () => window.removeEventListener("tasks:changed", onChanged);
  }, [load]);

  async function editTask(t: Task) {
    const next = window.prompt("Edit title:", t.title);
    if (next == null) return;
    const title = next.trim();
    if (!title) return;

    const { error } = await supabase.from("tasks").update({ title }).eq("id", t.id);
    if (error) return alert(error.message);
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, title } : x)));
    notify();
  }

  async function deleteTask(t: Task) {
    if (!window.confirm(`Delete "${t.title}"?`)) return;
    const { error } = await supabase.from("tasks").delete().eq("id", t.id);
    if (error) return alert(error.message);
    setTasks((prev) => prev.filter((x) => x.id !== t.id));
    notify();
  }

  if (tasks.length === 0) {
    return <div className="card text-sm text-slate-500">No ideas yet – start by adding one above.</div>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((t) => (
        <li key={t.id} className="card flex items-center gap-3 p-4">
          {t.created_by_image ? (
            <Image
              src={t.created_by_image}
              alt={t.created_by_name ? `${t.created_by_name}'s avatar` : "Task owner avatar"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-base">
              🙂
            </div>
          )}
          <div className="flex-1">
            <div className="font-medium text-slate-800">{t.title}</div>
            <div className="text-sm text-slate-500">
              added by {t.created_by_name || "Someone"}
            </div>
          </div>
          {user?.id === t.created_by && (
            <>
              <button className="btn btn-secondary" onClick={() => editTask(t)}>
                Edit
              </button>
              <button className="btn btn-secondary" onClick={() => deleteTask(t)}>
                Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
