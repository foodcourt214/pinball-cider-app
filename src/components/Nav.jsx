import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/work', label: 'Menu' },
  { to: '/about', label: 'About' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b-4 border-red bg-board text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl leading-none tracking-wide">
            <span className="neon-amber flicker">FOOD COURT</span>
          </span>
          <span className="hidden font-mono text-[0.6rem] font-bold tracking-[0.45em] text-paper/70 uppercase sm:block">
            Creative
          </span>
        </Link>

        <nav className="hidden items-center gap-7 sm:flex">
          <span className="neon-teal font-mono text-xs font-bold tracking-[0.3em] uppercase">
            ● Open
          </span>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-mono text-xs font-bold tracking-[0.25em] uppercase transition-colors hover:text-amber ${
                  isActive ? 'text-amber' : 'text-paper'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href="mailto:contact@foodcourtcreative.com"
            className="hard-shadow-sm border-2 border-ink bg-red px-4 py-2 font-mono text-xs font-bold tracking-[0.2em] text-paper uppercase transition-transform hover:-translate-y-0.5"
          >
            Order up
          </a>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="text-2xl sm:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-paper/20 px-5 py-4 sm:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="py-2 font-mono text-sm font-bold tracking-[0.25em] uppercase"
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href="mailto:contact@foodcourtcreative.com"
            className="py-2 font-mono text-sm font-bold tracking-[0.25em] text-amber uppercase"
          >
            Order up
          </a>
        </nav>
      )}
    </header>
  )
}
