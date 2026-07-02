import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <p className="font-display text-4xl font-black sm:text-6xl">
          Let’s make something{' '}
          <span className="text-mustard italic">delicious</span>.
        </p>
        <a
          href="mailto:contact@foodcourtcreative.com"
          className="mt-6 inline-block rounded-full bg-tomato px-8 py-4 text-lg font-bold text-cream transition-colors hover:bg-mustard hover:text-ink"
        >
          contact@foodcourtcreative.com
        </a>

        <div className="mt-14 grid gap-8 border-t border-cream/15 pt-8 text-sm sm:grid-cols-3">
          <div>
            <p className="font-bold tracking-[0.2em] uppercase">Food Court Creative</p>
            <p className="mt-2 text-cream/70">
              5325 Ballard Ave NW #214
              <br />
              Seattle, WA
            </p>
            <p className="mt-2 text-cream/70">415.706.8281</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/work" className="text-cream/70 transition-colors hover:text-mustard">
              Work
            </Link>
            <Link to="/about" className="text-cream/70 transition-colors hover:text-mustard">
              About
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="https://www.instagram.com/foodcourtcreative/"
              target="_blank"
              rel="noreferrer"
              className="text-cream/70 transition-colors hover:text-mustard"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/food-court-creative"
              target="_blank"
              rel="noreferrer"
              className="text-cream/70 transition-colors hover:text-mustard"
            >
              LinkedIn
            </a>
            <a
              href="https://vimeo.com/aafeiger"
              target="_blank"
              rel="noreferrer"
              className="text-cream/70 transition-colors hover:text-mustard"
            >
              Vimeo
            </a>
          </div>
        </div>

        <p className="mt-10 text-xs text-cream/40">
          © {new Date().getFullYear()} Food Court Creative, LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
