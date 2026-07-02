import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-full bg-tomato font-display text-lg font-black text-cream transition-transform group-hover:-rotate-12">
            FC
          </span>
          <span className="text-sm font-extrabold tracking-[0.18em] uppercase">
            Food Court
            <span className="block text-[0.65rem] font-semibold tracking-[0.3em] text-ink-soft">
              Creative
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide uppercase transition-colors hover:text-tomato ${
                  isActive ? 'text-tomato' : 'text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href="mailto:contact@foodcourtcreative.com"
            className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-tomato"
          >
            Let’s talk
          </a>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="sm:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink/10 px-5 py-4 sm:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="py-2 text-lg font-semibold"
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href="mailto:contact@foodcourtcreative.com"
            className="py-2 text-lg font-semibold text-tomato"
          >
            Let’s talk
          </a>
        </nav>
      )}
    </header>
  )
}
