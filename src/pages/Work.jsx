import { useState } from 'react'
import caseStudies, { categories } from '../data/caseStudies.js'
import WorkCard from '../components/WorkCard.jsx'

export default function Work() {
  const [filter, setFilter] = useState('All')
  const shown =
    filter === 'All' ? caseStudies : caseStudies.filter((cs) => cs.categories.includes(filter))

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <p className="font-mono text-xs font-bold tracking-[0.4em] text-red uppercase">
        Take a number
      </p>
      <h1 className="mt-2 font-display text-6xl tracking-wide uppercase sm:text-7xl">
        The full menu
      </h1>
      <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink/70">
        Brand builds, launches, packaging, content and campaigns for food & beverage brands
        that refuse to blend in.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`border-2 border-ink px-4 py-2 font-mono text-xs font-bold tracking-[0.15em] uppercase transition-all ${
              filter === c
                ? 'hard-shadow-sm -translate-y-0.5 bg-red text-paper'
                : 'bg-white hover:bg-amber'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((cs) => (
          <WorkCard key={cs.slug} study={cs} />
        ))}
      </div>
    </section>
  )
}
