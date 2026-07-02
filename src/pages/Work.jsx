import { useState } from 'react'
import caseStudies, { categories } from '../data/caseStudies.js'
import WorkCard from '../components/WorkCard.jsx'

export default function Work() {
  const [filter, setFilter] = useState('All')
  const shown =
    filter === 'All' ? caseStudies : caseStudies.filter((cs) => cs.categories.includes(filter))

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <h1 className="font-display text-5xl font-black sm:text-6xl">The work</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Brand builds, launches, packaging, content and campaigns for food & beverage brands that
        refuse to blend in.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === c
                ? 'bg-ink text-cream'
                : 'bg-cream-dark text-ink hover:bg-mustard'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((cs) => (
          <WorkCard key={cs.slug} study={cs} />
        ))}
      </div>
    </section>
  )
}
