import { Link, useParams, Navigate } from 'react-router-dom'
import caseStudies, { getCaseStudy, orderNumber } from '../data/caseStudies.js'
import Cover from '../components/Cover.jsx'

export default function CaseStudyPage() {
  const { slug } = useParams()
  const study = getCaseStudy(slug)

  if (!study) return <Navigate to="/work" replace />

  const idx = caseStudies.indexOf(study)
  const next = caseStudies[(idx + 1) % caseStudies.length]
  const num = orderNumber(study)

  return (
    <article>
      {/* Menu-board hero */}
      <header className="bg-board text-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs font-bold tracking-[0.3em] uppercase">
            <Link to="/work" className="text-paper/60 hover:text-amber">
              ← Full menu
            </Link>
            <span className="text-amber">Order #{num}</span>
          </div>
          <p className="mt-8 font-mono text-xs font-bold tracking-[0.45em] text-red uppercase">
            {study.client}
          </p>
          <h1
            className="mt-3 max-w-4xl font-display text-5xl leading-[0.95] tracking-wide uppercase sm:text-7xl"
            style={{
              textShadow: `0 0 6px ${study.colors.to}cc, 0 0 28px ${study.colors.to}88`,
            }}
          >
            {study.title}
          </h1>
          <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-paper/70">
            {study.tagline}
          </p>
        </div>
      </header>
      <div className="checker h-4" />

      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="text-xl leading-relaxed font-semibold sm:text-2xl">{study.summary}</p>

            <div className="hard-shadow mt-10 border-2 border-ink">
              <div className="aspect-[16/9]">
                <Cover study={study} />
              </div>
            </div>

            {study.sections.map((s, i) => (
              <section key={s.heading} className="mt-12">
                <p className="font-mono text-xs font-bold tracking-[0.35em] text-red uppercase">
                  Course {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-2 font-display text-3xl tracking-wide uppercase">
                  {s.heading}
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-ink/75">{s.body}</p>
              </section>
            ))}
          </div>

          {/* Receipt */}
          <aside
            className="hard-shadow h-fit border-2 border-ink bg-white p-6 font-mono lg:sticky lg:top-24"
            style={{ '--notch': 'var(--color-paper)' }}
          >
            <p className="text-center text-xs font-bold tracking-[0.3em] uppercase">
              Food Court Creative
            </p>
            <p className="mt-1 text-center text-[0.65rem] tracking-[0.2em] text-ink/50 uppercase">
              Seattle, WA ★ Order #{num}
            </p>
            <div className="my-4 border-t-2 border-dashed border-ink/25" />
            <ul className="space-y-2 text-xs uppercase">
              {study.services.map((s) => (
                <li key={s} className="flex justify-between gap-3">
                  <span>1× {s}</span>
                  <span className="text-ink/40">✓</span>
                </li>
              ))}
            </ul>
            <div className="my-4 border-t-2 border-dashed border-ink/25" />
            <div className="flex justify-between text-xs font-bold uppercase">
              <span>Total</span>
              <span className="text-red">Delicious</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.6rem] font-bold tracking-widest text-ink/50 uppercase">
              {study.categories.map((c) => (
                <span key={c}>[{c}]</span>
              ))}
            </div>
            <div className="my-4 border-t-2 border-dashed border-ink/25" />
            <div className="barcode text-ink/70" aria-hidden />
            <p className="mt-3 text-center text-[0.6rem] tracking-[0.25em] text-ink/50 uppercase">
              *** Thank you, come again ***
            </p>
            <a
              href="mailto:contact@foodcourtcreative.com"
              className="hard-shadow-sm mt-5 block border-2 border-ink bg-red px-4 py-3 text-center text-xs font-bold tracking-[0.2em] text-paper uppercase transition-transform hover:-translate-y-0.5"
            >
              Order one like this
            </a>
          </aside>
        </div>

        {/* Next order */}
        <Link
          to={`/work/${next.slug}`}
          className="group hard-shadow mt-16 flex items-center justify-between gap-4 border-2 border-ink bg-white p-6 transition-transform hover:-translate-y-1 sm:p-8"
        >
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.35em] text-red uppercase">
              Next order up — #{orderNumber(next)}
            </p>
            <p className="mt-2 font-display text-2xl tracking-wide uppercase group-hover:underline sm:text-4xl">
              {next.client}: {next.title}
            </p>
          </div>
          <span className="text-4xl transition-transform group-hover:translate-x-2">→</span>
        </Link>
      </div>
    </article>
  )
}
