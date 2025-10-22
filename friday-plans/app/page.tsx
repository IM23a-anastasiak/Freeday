import Link from "next/link";

const features = [
  {
    title: "Collect ideas effortlessly",
    description:
      "Everyone in the team can drop Friday plans in seconds – with automatic name and avatar attribution.",
    icon: "📝",
  },
  {
    title: "Vote each week",
    description:
      "Bring democracy to the end of the week. Votes reset every Friday so you always choose something fresh.",
    icon: "🗳️",
  },
  {
    title: "Spin for a winner",
    description:
      "Run the animated wheel during stand-up and let suspense decide the plan – weighted by the most votes.",
    icon: "🎡",
  },
];

const steps = [
  "Invite your teammates to sign in with Clerk",
  "Create and refine the backlog of Friday hangout ideas",
  "Open the vote or wheel view during your retro",
];

export default function Home() {
  return (
    <main className="mx-auto flex flex-col gap-16">
      <section className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-slate-900/10 backdrop-blur">
            <span className="text-lg">✨</span> Make Fridays intentional
          </span>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Plan Fridays together without a spreadsheet
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Freeday keeps your social ideas organised, lets everyone vote on what sounds fun and finishes with a dramatic wheel
            spin. Perfect for hybrid teams that still want shared memories.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link className="btn" href="/sign-up">
              Create a team account
            </Link>
            <Link className="btn btn-secondary" href="/sign-in">
              I already have an account
            </Link>
            <Link className="btn btn-secondary" href="/dashboard">
              Skip to the dashboard
            </Link>
          </div>
        </div>

        <div className="card space-y-6">
          <div className="rounded-2xl bg-slate-900 text-white p-6 shadow-inner">
            <div className="text-sm uppercase tracking-[0.25em] text-white/70">This week</div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Board games & pizza</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm">5 votes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Try the new ramen spot</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm">3 votes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Team hike at sunrise</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm">2 votes</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-800/70 px-4 py-3 text-sm">
              <span>Spin to reveal the winner…</span>
              <span className="font-semibold">🎉 Board games & pizza</span>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            No production data is shown here – this is a preview of what the live dashboard looks like once your team joins.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">Everything you need for Friday rituals</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card h-full space-y-4">
              <div className="text-4xl">{feature.icon}</div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="text-2xl font-semibold">Getting started is simple</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step} className="rounded-2xl border border-dashed border-slate-300/70 bg-white/70 p-5 text-slate-600">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Step {index + 1}</div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{step}</p>
            </li>
          ))}
        </ol>
        <p className="text-sm text-slate-500">
          Have feedback or ideas? Drop them in the dashboard once you are signed in – the product team sees every suggestion.
        </p>
      </section>
    </main>
  );
}
