const clients = [
  'Bakerly',
  "Van Holten's",
  'Pringles',
  'Deschutes Brewery',
  'Outshine',
  'Tofurky',
  'Good Culture',
  'Sidework',
  'City Fish',
  'True Essence',
  'ModernAlchemy',
  'MycoSci',
  'RAWR',
  'Goodwell Co.',
  'WineO',
]

export default function Marquee() {
  const row = clients.map((c) => (
    <span key={c} className="flex items-center gap-6 px-6">
      <span className="font-display text-2xl font-bold whitespace-nowrap sm:text-3xl">{c}</span>
      <span className="text-tomato">✦</span>
    </span>
  ))

  return (
    <div className="overflow-hidden border-y border-ink/10 bg-mustard py-4 text-ink">
      <div className="animate-marquee flex w-max">
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden>
          {row}
        </div>
      </div>
    </div>
  )
}
