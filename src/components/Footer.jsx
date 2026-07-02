import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="checker h-5" />
      <div className="bg-board text-paper">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="font-display text-4xl leading-tight tracking-wide uppercase sm:text-6xl">
            Let’s make something{' '}
            <span className="neon-amber flicker">delicious</span>.
          </p>
          <a
            href="mailto:contact@foodcourtcreative.com"
            className="hard-shadow mt-8 inline-block border-2 border-ink bg-red px-7 py-4 font-mono text-sm font-bold tracking-[0.15em] text-paper uppercase transition-transform hover:-translate-y-1"
          >
            contact@foodcourtcreative.com
          </a>

          <div className="mt-14 grid gap-8 border-t-2 border-dashed border-paper/25 pt-8 font-mono text-xs sm:grid-cols-3">
            <div>
              <p className="font-bold tracking-[0.3em] text-amber uppercase">
                Food Court Creative
              </p>
              <p className="mt-3 leading-relaxed text-paper/70 uppercase">
                5325 Ballard Ave NW #214
                <br />
                Seattle, WA
              </p>
              <p className="mt-2 text-paper/70">415.706.8281</p>
              <p className="neon-teal mt-3 font-bold tracking-[0.25em] uppercase">
                ● Open late
              </p>
            </div>
            <div className="flex flex-col gap-2 uppercase">
              <p className="font-bold tracking-[0.3em] text-amber">Directory</p>
              <Link to="/work" className="text-paper/70 transition-colors hover:text-amber">
                → The menu
              </Link>
              <Link to="/about" className="text-paper/70 transition-colors hover:text-amber">
                → About us
              </Link>
            </div>
            <div className="flex flex-col gap-2 uppercase">
              <p className="font-bold tracking-[0.3em] text-amber">Elsewhere</p>
              <a
                href="https://www.instagram.com/foodcourtcreative/"
                target="_blank"
                rel="noreferrer"
                className="text-paper/70 transition-colors hover:text-amber"
              >
                → Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/food-court-creative"
                target="_blank"
                rel="noreferrer"
                className="text-paper/70 transition-colors hover:text-amber"
              >
                → LinkedIn
              </a>
              <a
                href="https://vimeo.com/aafeiger"
                target="_blank"
                rel="noreferrer"
                className="text-paper/70 transition-colors hover:text-amber"
              >
                → Vimeo
              </a>
            </div>
          </div>

          <div className="mt-12 flex items-end justify-between gap-6">
            <p className="font-mono text-[0.65rem] tracking-widest text-paper/40 uppercase">
              © {new Date().getFullYear()} Food Court Creative, LLC
              <br />
              *** Thank you, come again ***
            </p>
            <div className="barcode w-40 text-paper/60" aria-hidden />
          </div>
        </div>
      </div>
    </footer>
  )
}
