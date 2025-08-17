import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    // Not signed in → send to sign-in (middleware also protects routes)
    redirect("/sign-in");
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Friday Plans</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <p className="opacity-80">
        Hello, {user.firstName || "friend"} 👋 — you’re signed in!
      </p>

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold mb-3">Add a new idea</h2>
        <TaskForm />
        <TaskList />
      </div>
      
    </main>
  );
}
