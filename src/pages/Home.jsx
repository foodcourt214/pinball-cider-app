import { Link } from 'react-router-dom'
import caseStudies from '../data/caseStudies.js'
import WorkCard from '../components/WorkCard.jsx'
import Marquee from '../components/Marquee.jsx'

const services = [
  {
    title: 'Brand Strategy & Identity',
    body: 'Positioning, personas, messaging frameworks, voice & tone, and brand guidelines that give your team a north star.',
    emoji: '🧭',
  },
  {
    title: 'Packaging Design',
    body: 'Shelf-ready systems that flex across a growing product line — and make people reach for yours first.',
    emoji: '📦',
  },
  {
    title: 'Launch Campaigns',
    body: 'Full-funnel, cross-channel product launches — from :30 commercials to TikTok to UGC.',
    emoji: '🚀',
  },
  {
    title: 'Content & Social',
    body: 'Scroll-stopping content production, social strategy, influencer programs and paid social that actually converts.',
    emoji: '📱',
  },
  {
    title: 'Web & Ecommerce',
    body: 'Shopify design and development that tells your story and moves product, from DTC storefronts to marketplaces.',
    emoji: '🛒',
  },
  {
    title: 'AI-Powered Production',
    body: 'Generative AI worlds, asset libraries and campaigns that deliver big-budget creative at challenger-brand speed.',
    emoji: '🤖',
  },
]

export default function Home() {
  const featured = caseStudies.filter((cs) => cs.featured)

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-14 sm:pt-24 sm:pb-20">
        <p className="text-sm font-bold tracking-[0.3em] text-tomato uppercase">
          Creative agency for food & beverage
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.02] font-black sm:text-7xl">
          Delicious experiences that connect{' '}
          <span className="text-tomato italic">brands</span> to{' '}
          <span className="text-teal italic">humans</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft sm:text-xl">
          Equal parts creativity, strategy and production. All the expertise of a big agency —
          none of the bloat — and a deep understanding of what it takes for food & beverage
          brands to break through.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/work"
            className="rounded-full bg-tomato px-8 py-4 font-bold text-cream transition-colors hover:bg-tomato-dark"
          >
            See the work
          </Link>
          <a
            href="mailto:contact@foodcourtcreative.com"
            className="rounded-full border-2 border-ink px-8 py-4 font-bold transition-colors hover:bg-ink hover:text-cream"
          >
            Start a project
          </a>
        </div>
      </section>

      <Marquee />

      {/* Featured work */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-4xl font-black sm:text-5xl">Fresh off the grill</h2>
          <Link
            to="/work"
            className="hidden text-sm font-bold tracking-wide text-tomato uppercase hover:underline sm:block"
          >
            All work →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((cs) => (
            <WorkCard key={cs.slug} study={cs} />
          ))}
        </div>
        <Link
          to="/work"
          className="mt-8 block text-center text-sm font-bold tracking-wide text-tomato uppercase hover:underline sm:hidden"
        >
          All work →
        </Link>
      </section>

      {/* Services */}
      <section className="bg-ink py-16 text-cream sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-4xl font-black sm:text-5xl">On the menu</h2>
          <p className="mt-3 max-w-2xl text-cream/70">
            We operate as an extension of your in-house team, bringing in specialized talent
            exactly when and where you need it.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-cream/15 bg-cream/5 p-6 transition-colors hover:border-mustard/60"
              >
                <span className="text-3xl">{s.emoji}</span>
                <h3 className="mt-3 font-display text-xl font-bold text-mustard">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secret weapon strip */}
      <section className="mx-auto max-w-6xl px-5 py-16 text-center sm:py-24">
        <p className="font-display text-3xl leading-snug font-black sm:text-5xl">
          We’re your brand’s <span className="text-tomato italic">secret weapon</span>.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
          Challenger CPG brands need more content and more marketing on smaller budgets than the
          big national players. That’s exactly the game we built Food Court Creative to win.
        </p>
        <Link
          to="/about"
          className="mt-8 inline-block rounded-full border-2 border-ink px-8 py-4 font-bold transition-colors hover:bg-ink hover:text-cream"
        >
          More about us
        </Link>
      </section>
    </>
  )
}
