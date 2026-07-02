const services = [
  'Brand Strategy',
  'Brand Guidelines',
  'Packaging Design',
  'Persona Development',
  'Messaging Framework',
  'Product Launch Campaigns',
  'Content Production',
  'Social & Influencer',
  'Paid Media',
  'CTV & Video',
  'Shopify Design & Development',
  'AI-Powered Production',
]

export default function About() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <h1 className="max-w-4xl font-display text-5xl leading-[1.05] font-black sm:text-6xl">
          Big agency expertise. <span className="text-tomato italic">None of the bloat.</span>
        </h1>
        <div className="mt-8 grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>
              Food Court Creative combines equal parts creativity, strategy and production to
              develop delicious experiences that connect brands to humans.
            </p>
            <p>
              We work with mission-driven CPG and food & beverage brands — the challengers who
              need to put out more content and do more marketing with smaller budgets than the
              big national players. We operate as an extension of your in-house team, bringing
              in specialized talent exactly when and where you need it.
            </p>
            <p>
              Based in Seattle’s Ballard neighborhood, working with brands everywhere.
            </p>
          </div>
          <div className="rounded-2xl border border-ink/10 bg-white p-6">
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-full bg-teal font-display text-2xl font-black text-cream">
                AF
              </span>
              <div>
                <p className="font-display text-xl font-bold">Aaron Feiger</p>
                <p className="text-sm text-ink-soft">Owner & Creative Director</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Aaron leads every engagement, pairing big-brand creative direction with the speed
              and scrappiness challenger brands need.
            </p>
            <a
              href="mailto:aaron@foodcourtcreative.com"
              className="mt-4 inline-block text-sm font-bold text-tomato hover:underline"
            >
              aaron@foodcourtcreative.com
            </a>
          </div>
        </div>
      </section>

      <section className="bg-cream-dark py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-4xl font-black">What we do</h2>
          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s} className="flex items-center gap-3 text-lg font-semibold">
                <span className="text-tomato">✦</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <h2 className="font-display text-4xl font-black">Find us</h2>
        <div className="mt-6 grid gap-6 text-lg sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">Visit</p>
            <p className="mt-2 font-semibold">
              5325 Ballard Ave NW #214
              <br />
              Seattle, WA
            </p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">Call</p>
            <a href="tel:+14157068281" className="mt-2 block font-semibold hover:text-tomato">
              415.706.8281
            </a>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">Email</p>
            <a
              href="mailto:contact@foodcourtcreative.com"
              className="mt-2 block font-semibold hover:text-tomato"
            >
              contact@foodcourtcreative.com
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
