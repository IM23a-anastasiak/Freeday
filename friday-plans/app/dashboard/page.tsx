import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AuthUserButton from "@/components/AuthUserButton";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 text-sm text-slate-600">
        <h1 className="text-2xl font-semibold">Authentication not configured</h1>
        <p>
          To use the dashboard you need to supply Clerk keys. Set <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and
          <code> CLERK_SECRET_KEY</code> in your environment and redeploy.
        </p>
      </main>
    );
  }

  const user = await currentUser();
  if (!user) {
    // Not signed in → send to sign-in (middleware also protects routes)
    redirect("/sign-in");
  }

  return (
    <main className="mx-auto max-w-4xl space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Friday plans hub</h1>
          <p className="mt-1 text-sm text-slate-600">
            Hello, {user.firstName || "friend"} 👋 – capture ideas, vote together and spin the wheel when it’s time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link className="btn btn-secondary" href="/vote">
            Weekly vote
          </Link>
          <Link className="btn btn-secondary" href="/wheel">
            Spin the wheel
          </Link>
          <AuthUserButton appearance={{ elements: { userButtonAvatarBox: "ring-2 ring-white" } }} afterSignOutUrl="/" />
        </div>
      </header>

      <section className="card space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Add a new idea</h2>
          <p className="text-sm text-slate-600">
            Keep titles punchy – for example “Bowling + ramen” or “Remote brunch”. You can edit or remove them later.
          </p>
        </div>
        <TaskForm />
        <TaskList />
      </section>
    </main>
  );
}
