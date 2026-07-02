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
    <span
      key={c}
      className="led-text flex items-center px-5 font-mono text-sm font-bold whitespace-nowrap uppercase sm:text-base"
    >
      {c}
      <span className="ml-10 opacity-60">●</span>
    </span>
  ))

  return (
    <div>
      <div className="checker h-4" />
      <div className="overflow-hidden border-y-2 border-ink/80 bg-[#0d0905] py-3">
        <div className="animate-marquee flex w-max">
          <div className="flex">{row}</div>
          <div className="flex" aria-hidden>
            {row}
          </div>
        </div>
      </div>
      <div className="checker h-4" />
    </div>
  )
}
