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
        <p className="font-mono text-xs font-bold tracking-[0.4em] text-red uppercase">
          Meet the vendor
        </p>
        <h1 className="mt-2 max-w-4xl font-display text-5xl leading-[0.95] tracking-wide uppercase sm:text-7xl">
          Big agency expertise. <span className="text-red">None of the bloat.</span>
        </h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-5 text-lg leading-relaxed text-ink/75">
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
            <p>Based in Seattle’s Ballard neighborhood, working with brands everywhere.</p>
          </div>

          {/* Vendor badge */}
          <div
            className="hard-shadow h-fit border-2 border-ink bg-white p-6"
            style={{ '--notch': 'var(--color-paper)' }}
          >
            <p className="font-mono text-[0.65rem] font-bold tracking-[0.3em] text-ink/50 uppercase">
              Vendor of the month — every month
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="grid size-16 place-items-center border-2 border-ink bg-amber font-display text-2xl">
                AF
              </span>
              <div>
                <p className="font-display text-2xl tracking-wide uppercase">Aaron Feiger</p>
                <p className="font-mono text-xs text-ink/60 uppercase">
                  Owner & Creative Director
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/70">
              Aaron leads every engagement, pairing big-brand creative direction with the speed
              and scrappiness challenger brands need.
            </p>
            <div className="ticket-tear mt-5 pt-4">
              <a
                href="mailto:aaron@foodcourtcreative.com"
                className="font-mono text-xs font-bold tracking-widest text-red uppercase hover:underline"
              >
                aaron@foodcourtcreative.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services board */}
      <section className="border-y-4 border-red bg-board py-14 text-paper sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="neon-amber flicker font-display text-5xl tracking-wide uppercase">
            What we do
          </h2>
          <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <li
                key={s}
                className="flex items-baseline gap-3 font-mono text-sm font-bold tracking-wide uppercase"
              >
                <span className="text-amber">{String(i + 1).padStart(2, '0')}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <h2 className="font-display text-5xl tracking-wide uppercase">Find us</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            ['Visit', '5325 Ballard Ave NW #214\nSeattle, WA', null],
            ['Call', '415.706.8281', 'tel:+14157068281'],
            ['Email', 'contact@foodcourtcreative.com', 'mailto:contact@foodcourtcreative.com'],
          ].map(([label, value, href]) => (
            <div key={label} className="border-2 border-ink bg-white p-5">
              <p className="font-mono text-[0.65rem] font-bold tracking-[0.3em] text-red uppercase">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="mt-2 block font-mono text-sm font-bold break-all hover:text-red"
                >
                  {value}
                </a>
              ) : (
                <p className="mt-2 font-mono text-sm font-bold whitespace-pre-line">{value}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
