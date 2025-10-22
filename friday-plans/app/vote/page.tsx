import Link from "next/link";
import AuthUserButton from "@/components/AuthUserButton";
import VoteList from "@/components/VoteList";
import { currentFridayKey } from "@/lib/week";

export const dynamic = "force-dynamic";

export default function VotePage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 text-sm text-slate-600">
        <h1 className="text-2xl font-semibold">Authentication not configured</h1>
        <p>Voting requires Clerk. Add your Clerk keys and redeploy.</p>
      </main>
    );
  }

  const week = currentFridayKey();
  return (
    <main className="mx-auto max-w-4xl space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Vote for {week}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Cast one vote per person – switching your vote automatically updates the leaderboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link className="btn btn-secondary" href="/dashboard">
            Back to dashboard
          </Link>
          <AuthUserButton afterSignOutUrl="/" />
        </div>
      </header>
      <div className="card">
        <VoteList />
      </div>
    </main>
  );
}
