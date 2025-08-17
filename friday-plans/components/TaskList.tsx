'use client';

import { useEffect, useState } from "react";
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

  async function load() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return alert(error.message);
    setTasks(data ?? []);
  }

  function notify() {
    window.dispatchEvent(new Event("tasks:changed"));
  }

  useEffect(() => {
    load();
    const onChanged = () => load();
    window.addEventListener("tasks:changed", onChanged);
    return () => window.removeEventListener("tasks:changed", onChanged);
  }, []);

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

  return (
    <ul className="divide-y divide-neutral-200/60 dark:divide-neutral-800">
      {tasks.map((t) => (
        <li key={t.id} className="py-3 flex items-center gap-3">
          {t.created_by_image ? (
            <img
              src={t.created_by_image}
              alt=""
              className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700"
            />
          ) : (
            <div className="h-8 w-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-xs">
              🙂
            </div>
          )}
          <div className="flex-1">
            <div className="font-medium">{t.title}</div>
            <div className="text-sm opacity-70">
              added by {t.created_by_name || "Someone"}
            </div>
          </div>
          {user?.id === t.created_by && (
            <>
              <button className="btn" onClick={() => editTask(t)}>Edit</button>
              <button className="btn" onClick={() => deleteTask(t)}>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
