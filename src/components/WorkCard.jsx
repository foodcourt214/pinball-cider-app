import { Link } from 'react-router-dom'
import Cover from './Cover.jsx'
import { orderNumber } from '../data/caseStudies.js'

export default function WorkCard({ study }) {
  return (
    <Link
      to={`/work/${study.slug}`}
      className="group hard-shadow block border-2 border-ink bg-white transition-transform hover:-translate-x-0.5 hover:-translate-y-1"
      style={{ containerType: 'inline-size', '--notch': 'var(--color-paper)' }}
    >
      {/* ticket header */}
      <div className="flex items-center justify-between border-b-2 border-ink px-4 py-2 font-mono text-[0.65rem] font-bold tracking-[0.2em] uppercase">
        <span>Order #{orderNumber(study)}</span>
        <span className="text-red">FCC ★</span>
      </div>

      <div className="aspect-[4/3] overflow-hidden border-b-2 border-ink">
        <Cover study={study} className="transition-transform duration-500 group-hover:scale-105" />
      </div>

      <div className="p-5">
        <p className="font-mono text-[0.65rem] font-bold tracking-[0.25em] text-red uppercase">
          {study.client}
        </p>
        <h3 className="mt-1 font-display text-2xl leading-tight tracking-wide uppercase group-hover:underline">
          {study.title}
        </h3>
      </div>

      <div className="ticket-tear mx-0 px-5 py-3">
        <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.6rem] font-bold tracking-widest text-ink/60 uppercase">
          {study.categories.map((c) => (
            <span key={c}>[{c}]</span>
          ))}
        </div>
      </div>
    </Link>
  )
}
