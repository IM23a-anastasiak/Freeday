import Link from "next/link";
import AuthUserButton from "@/components/AuthUserButton";
import SpinWheel from "@/components/Wheel";

export const dynamic = "force-dynamic";

export default function WheelPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 text-sm text-slate-600">
        <h1 className="text-2xl font-semibold">Authentication not configured</h1>
        <p>The wheel pulls task and vote data for signed-in users. Add Clerk keys to enable it.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl space-y-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Random picker</h1>
          <p className="mt-2 text-sm text-slate-600">
            Spin the wheel to pick a plan. Use the weighted mode after a voting session or spin from all ideas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link className="btn btn-secondary" href="/dashboard">
            Back to dashboard
          </Link>
          <AuthUserButton afterSignOutUrl="/" />
        </div>
      </header>

      <SpinWheel />
    </main>
  );
}
