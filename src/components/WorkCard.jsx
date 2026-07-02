import { Link } from 'react-router-dom'
import Cover from './Cover.jsx'

export default function WorkCard({ study }) {
  return (
    <Link
      to={`/work/${study.slug}`}
      className="group block overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
      style={{ containerType: 'inline-size' }}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <Cover study={study} className="transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-xs font-bold tracking-[0.2em] text-tomato uppercase">{study.client}</p>
        <h3 className="mt-1 font-display text-xl font-bold group-hover:underline">
          {study.title}
        </h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {study.categories.map((c) => (
            <span
              key={c}
              className="rounded-full bg-cream-dark px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-ink-soft uppercase"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
