// Renders a case study's cover. Drop a real image at
// src/assets/work/<slug>/cover.{jpg,jpeg,png,webp} and it is used
// automatically; otherwise an art-directed placeholder in the brand's
// colors is shown.
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

  return (
    <div
      aria-hidden
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${study.colors.from} 0%, ${study.colors.to} 100%)`,
      }}
    >
      <span
        className="font-display font-black select-none"
        style={{
          color: study.colors.accent,
          fontSize: 'clamp(4rem, 16cqw, 11rem)',
          lineHeight: 1,
        }}
      >
        {study.mark}
      </span>
      <span className="absolute right-4 bottom-3 text-3xl opacity-80">{study.emoji}</span>
      <span
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 15%, rgba(255,255,255,0.18) 0%, transparent 45%)',
        }}
      />
    </div>
  )
}
