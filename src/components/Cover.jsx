// Renders a case study's cover. Drop a real image at
// src/assets/work/<slug>/cover.{jpg,jpeg,png,webp} and it is used
// automatically; otherwise a flat, food-court-style ticket cover in the
// brand's colors is shown.
const covers = import.meta.glob('../assets/work/*/cover.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

function coverFor(slug) {
  const match = Object.entries(covers).find(([path]) => path.includes(`/${slug}/`))
  return match ? match[1] : null
}

export default function Cover({ study, className = '' }) {
  const src = coverFor(study.slug)

  if (src) {
    return (
      <img
        src={src}
        alt={`${study.client} — ${study.title}`}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  const wallpaper = Array(60).fill(study.emoji).join('  ')

  return (
    <div
      aria-hidden
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: study.colors.from }}
    >
      {/* emoji wallpaper */}
      <div
        className="absolute -inset-10 -rotate-6 text-3xl leading-[2.4] tracking-[1em] break-all opacity-20 select-none"
        aria-hidden
      >
        {wallpaper}
      </div>

      <span
        className="relative px-4 text-center font-display uppercase select-none"
        style={{
          color: study.colors.accent,
          fontSize: 'clamp(1.8rem, 9cqw, 4rem)',
          lineHeight: 0.95,
          textShadow: '3px 3px 0 rgba(0,0,0,0.35)',
        }}
      >
        {study.client}
      </span>

      {/* served-fresh stamp */}
      <span
        className="absolute right-3 bottom-3 grid size-16 rotate-12 place-items-center rounded-full border-2 font-mono text-[0.5rem] font-bold tracking-widest uppercase"
        style={{ color: study.colors.accent, borderColor: study.colors.accent }}
      >
        Served
        <br />
        fresh
      </span>
    </div>
  )
}
