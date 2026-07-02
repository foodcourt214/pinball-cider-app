import { Link, useParams, Navigate } from 'react-router-dom'
import caseStudies, { getCaseStudy } from '../data/caseStudies.js'
import Cover from '../components/Cover.jsx'

export default function CaseStudyPage() {
  const { slug } = useParams()
  const study = getCaseStudy(slug)

  if (!study) return <Navigate to="/work" replace />

  const idx = caseStudies.indexOf(study)
  const next = caseStudies[(idx + 1) % caseStudies.length]

  return (
    <article>
      {/* Hero band */}
      <header
        className="text-white"
        style={{
          background: `linear-gradient(120deg, ${study.colors.from} 0%, ${study.colors.to} 100%)`,
        }}
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <Link
            to="/work"
            className="text-sm font-bold tracking-[0.2em] uppercase opacity-80 hover:opacity-100"
          >
            ← All work
          </Link>
          <p
            className="mt-6 text-sm font-bold tracking-[0.3em] uppercase"
            style={{ color: study.colors.accent }}
          >
            {study.client}
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-black sm:text-6xl">
            {study.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg opacity-90">{study.tagline}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="font-display text-2xl leading-relaxed font-medium">{study.summary}</p>

            <div className="mt-10 overflow-hidden rounded-2xl">
              <div className="aspect-[16/9]">
                <Cover study={study} />
              </div>
            </div>

            {study.sections.map((s) => (
              <section key={s.heading} className="mt-10">
                <h2 className="font-display text-2xl font-bold text-tomato">{s.heading}</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink-soft">{s.body}</p>
              </section>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-ink/10 bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
              Services
            </h2>
            <ul className="mt-3 space-y-2">
              {study.services.map((s) => (
                <li key={s} className="border-b border-ink/5 pb-2 text-sm font-semibold">
                  {s}
                </li>
              ))}
            </ul>
            <h2 className="mt-6 text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
              Categories
            </h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {study.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-cream-dark px-2.5 py-1 text-[0.7rem] font-semibold uppercase"
                >
                  {c}
                </span>
              ))}
            </div>
            <a
              href="mailto:contact@foodcourtcreative.com"
              className="mt-8 block rounded-full bg-tomato px-5 py-3 text-center text-sm font-bold text-cream transition-colors hover:bg-tomato-dark"
            >
              Start a project like this
            </a>
          </aside>
        </div>

        {/* Next project */}
        <Link
          to={`/work/${next.slug}`}
          className="group mt-16 flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:p-8"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
              Next project
            </p>
            <p className="mt-1 font-display text-2xl font-bold group-hover:text-tomato sm:text-3xl">
              {next.client} — {next.title}
            </p>
          </div>
          <span className="text-3xl transition-transform group-hover:translate-x-2">→</span>
        </Link>
      </div>
    </article>
  )
}
