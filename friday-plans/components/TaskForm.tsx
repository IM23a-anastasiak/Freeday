'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

function buildDisplayName(user: any) {
  const firstLast = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  return (
    user?.fullName ||
    (firstLast || undefined) ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    `user_${user?.id?.slice(-6) || "anon"}`
  );
}

export default function TaskForm({ onAdded }: { onAdded?: () => void }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !title.trim()) return;

    const payload = {
      title: title.trim(),
      created_by: user.id,
      created_by_name: buildDisplayName(user),
      created_by_image: user.imageUrl || null,
    };

    setLoading(true);
    const { error } = await supabase.from("tasks").insert(payload);
    setLoading(false);
    if (error) return alert(error.message);

    setTitle("");
    window.dispatchEvent(new Event("tasks:changed"));
    onAdded?.();
  }

  return (
    <form onSubmit={addTask} className="flex gap-2">
      <input
        className="input"
        placeholder="Add a new Friday idea…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn" disabled={loading}>
        {loading ? "Adding…" : "Add"}
      </button>
    </form>
  );
}
