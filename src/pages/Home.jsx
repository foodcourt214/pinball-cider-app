import { Link } from 'react-router-dom'
import caseStudies from '../data/caseStudies.js'
import WorkCard from '../components/WorkCard.jsx'
import Marquee from '../components/Marquee.jsx'

const menu = [
  {
    name: 'Brand Strategy & Identity',
    desc: 'Positioning, personas, messaging, voice & tone, guidelines.',
  },
  {
    name: 'Packaging Design',
    desc: 'Shelf-ready systems that make people reach for yours first.',
  },
  {
    name: 'Launch Campaigns',
    desc: 'Full-funnel launches, from :30 spots to TikTok to UGC.',
  },
  {
    name: 'Content & Social',
    desc: 'Scroll-stopping production, influencer programs, paid social.',
  },
  {
    name: 'Web & Ecommerce',
    desc: 'Shopify storefronts and marketplaces that move product.',
  },
  {
    name: 'AI-Powered Production',
    desc: 'Big-budget worlds at challenger-brand speed.',
  },
]

export default function Home() {
  const featured = caseStudies.filter((cs) => cs.featured)

  return (
    <>
      {/* Menu-board hero */}
      <section className="bg-board text-paper">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-16 sm:pt-24 sm:pb-24">
          <p className="font-mono text-xs font-bold tracking-[0.45em] text-amber uppercase">
            ★ Now serving: food & beverage brands ★
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl leading-[0.95] tracking-wide uppercase sm:text-8xl">
            <span className="neon-amber flicker">Delicious</span> experiences that connect
            brands to humans.
          </h1>
          <p className="mt-8 max-w-2xl font-mono text-sm leading-relaxed text-paper/70 sm:text-base">
            Equal parts creativity, strategy and production. All the expertise of a big agency
            — none of the bloat.
          </p>
          <div className="mt-10 flex flex-wrap gap-5">
            <Link
              to="/work"
              className="hard-shadow border-2 border-ink bg-red px-7 py-4 font-mono text-sm font-bold tracking-[0.2em] text-paper uppercase transition-transform hover:-translate-y-1"
            >
              See the menu
            </Link>
            <a
              href="mailto:contact@foodcourtcreative.com"
              className="border-2 border-paper/60 px-7 py-4 font-mono text-sm font-bold tracking-[0.2em] text-paper uppercase transition-colors hover:border-amber hover:text-amber"
            >
              Place an order
            </a>
          </div>
        </div>
      </section>

      <Marquee />

      {/* Featured tickets */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.4em] text-red uppercase">
              Today’s specials
            </p>
            <h2 className="mt-2 font-display text-5xl tracking-wide uppercase sm:text-6xl">
              Order up
            </h2>
          </div>
          <Link
            to="/work"
            className="font-mono text-xs font-bold tracking-[0.25em] text-red uppercase hover:underline"
          >
            Full menu →
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((cs) => (
            <WorkCard key={cs.slug} study={cs} />
          ))}
        </div>
      </section>

      {/* Menu board */}
      <section className="border-y-4 border-red bg-board py-16 text-paper sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="font-mono text-xs font-bold tracking-[0.45em] text-paper/60 uppercase">
              ─── Combo meals available ───
            </p>
            <h2 className="neon-amber flicker mt-3 font-display text-5xl tracking-wide uppercase sm:text-6xl">
              On the menu
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-x-14 gap-y-8 sm:grid-cols-2">
            {menu.map((m, i) => (
              <div key={m.name}>
                <div className="flex items-baseline font-display text-xl tracking-wide uppercase sm:text-2xl">
                  <span className="text-amber">{String(i + 1).padStart(2, '0')}.</span>
                  <span className="ml-3">{m.name}</span>
                  <span className="menu-dots" />
                  <span className="font-mono text-sm font-bold text-teal">MKT</span>
                </div>
                <p className="mt-1 pl-9 font-mono text-xs leading-relaxed text-paper/60">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-center font-mono text-xs tracking-[0.3em] text-paper/50 uppercase">
            We operate as an extension of your in-house team — specialized talent, exactly when
            you need it.
          </p>
        </div>
      </section>

      {/* Secret weapon */}
      <section className="mx-auto max-w-6xl px-5 py-16 text-center sm:py-24">
        <p className="font-mono text-xs font-bold tracking-[0.4em] text-red uppercase">
          Psst — over here
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl font-display text-5xl leading-[1] tracking-wide uppercase sm:text-7xl">
          Your brand’s <span className="text-red">secret weapon</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl font-mono text-sm leading-relaxed text-ink/70">
          Challenger CPG brands need more content and more marketing on smaller budgets than
          the big national players. That’s exactly the game we built Food Court Creative to
          win.
        </p>
        <Link
          to="/about"
          className="hard-shadow mt-10 inline-block border-2 border-ink bg-amber px-7 py-4 font-mono text-sm font-bold tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-1"
        >
          More about us
        </Link>
      </section>
    </>
  )
}
