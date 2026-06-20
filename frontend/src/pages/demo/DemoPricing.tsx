import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$49',
    features: ['10 onboarding kits', 'Quarterly restocks', 'Standard shipping'],
  },
  {
    name: 'Growth',
    price: '$149',
    features: ['50 onboarding kits', 'Monthly restocks', 'Address collection'],
  },
  {
    name: 'Scale',
    price: '$399',
    features: ['Unlimited kits', 'Dedicated sourcing', 'Global fulfillment'],
  },
];

export const DemoPricing = () => (
  <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Team plans</p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Pricing</h1>
      <p className="mt-3 text-base leading-7 text-zinc-600">
        Flexible plans for distributed teams that need reliable employee gear and replenishment.
      </p>
    </div>

    <div className="mt-8 grid gap-4 lg:grid-cols-3">
      {plans.map((plan) => (
        <article key={plan.name} className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">{plan.name}</h2>
          <p className="mt-4 text-3xl font-semibold text-zinc-950">
            {plan.price}
            <span className="text-sm font-medium text-zinc-500"> /mo</span>
          </p>
          <ul className="mt-6 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-zinc-700">
                <Check className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-7 inline-flex h-10 w-full items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Select
          </button>
        </article>
      ))}
    </div>

    <Link
      to="/demo/products"
      className="mt-8 inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
    >
      Browse Products
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  </div>
);
