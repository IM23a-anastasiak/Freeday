import { UserButton } from "@clerk/nextjs";
import VoteList from "@/components/VoteList";
import { currentFridayKey } from "@/lib/week";

export default function VotePage() {
  const week = currentFridayKey();
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vote for {week}</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <div className="card">
        <VoteList />
      </div>
    </main>
  );
}
