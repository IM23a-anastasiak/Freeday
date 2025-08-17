import { UserButton } from "@clerk/nextjs";
import SpinWheel from "@/components/Wheel";

export default function WheelPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Random Picker</h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <SpinWheel />
    </main>
  );
}
