export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to Friday Plans</h1>
      <p>
        <a className="underline" href="/sign-in">Sign in</a> or go to your{" "}
        <a className="underline" href="/dashboard">Dashboard</a>.
      </p>
    </main>
  );
}
