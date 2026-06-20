import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, CreditCard, PackageSearch } from 'lucide-react';

export const DemoHome = () => (
  <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
    <section className="flex flex-col justify-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Spring edit</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-zinc-950 sm:text-5xl">
        Everyday gear for focused workdays
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
        Durable bags, desk tools, and travel essentials selected for teams that move between home,
        office, and everywhere in between.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          to="/demo/products"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Shop Products
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          to="/demo/pricing"
          className="inline-flex h-11 items-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
        >
          Team Pricing
        </Link>
      </div>
    </section>

    <section className="grid gap-4 sm:grid-cols-2">
      {[
        {
          icon: PackageSearch,
          title: 'Field Kit',
          text: 'Organizer, cable wrap, notebook, and weatherproof pouch.',
        },
        {
          icon: CreditCard,
          title: 'Desk Set',
          text: 'Mat, stand, tray, and a weekly restock of writing tools.',
        },
        {
          icon: CheckCircle2,
          title: 'Travel Pack',
          text: 'Carry-on system with modular cubes and document sleeve.',
        },
        {
          icon: ArrowRight,
          title: 'Team Bundle',
          text: 'Curated onboarding kits shipped to distributed teams.',
        },
      ].map((item) => (
        <article key={item.title} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <item.icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
          <h2 className="mt-4 text-base font-semibold text-zinc-950">{item.title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
          <button
            type="button"
            className="mt-4 inline-flex h-9 items-center rounded-md bg-emerald-600 px-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Add
          </button>
        </article>
      ))}
    </section>
  </div>
);
