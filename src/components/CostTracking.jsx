function CostInput({ label, value, onChange, prefix = '$', suffix }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-sm text-slate-300 flex-1">{label}</label>
      <div className="flex items-center bg-slate-700 border border-slate-600 rounded focus-within:border-amber-400 w-28">
        {prefix && <span className="pl-2 text-slate-400 text-xs">{prefix}</span>}
        <input
          type="number" min="0" step="0.01"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="bg-transparent px-1 py-1.5 text-sm text-slate-100 outline-none w-full text-right"
        />
        {suffix && <span className="pr-2 text-slate-400 text-xs">{suffix}</span>}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
      <h2 className="text-base font-semibold text-amber-400 mb-4">{title}</h2>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

function CogsRow({ label, value, pct, color = 'text-slate-300' }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="text-right">
        <span className={`text-sm font-medium ${color}`}>${value.toFixed(2)}</span>
        {pct !== undefined && (
          <span className="text-xs text-slate-500 ml-1">({pct.toFixed(0)}%)</span>
        )}
      </div>
    </div>
  )
}

export default function CostTracking({ costs, setCosts, calc }) {
  const set = (key) => (val) => setCosts(c => ({ ...c, [key]: val }))

  const totalPct = calc.totalCOGS > 0 ? (v) => v / calc.totalCOGS * 100 : () => 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Ingredients */}
      <Section title="🌿 Ingredients">
        <p className="text-xs text-slate-500 mb-3">Apple costs are set in Batch Recipe tab</p>
        <CostInput label="Yeast" value={costs.yeast} onChange={set('yeast')} />
        <CostInput label="Nutrients" value={costs.nutrients} onChange={set('nutrients')} />
        <CostInput label="Sulfites / SO₂" value={costs.sulfites} onChange={set('sulfites')} />
        <CostInput label="Adjuncts / Flavorings" value={costs.adjuncts} onChange={set('adjuncts')} />
        <div className="pt-2 border-t border-slate-700 flex justify-between text-sm">
          <span className="text-slate-400">Apple Cost</span>
          <span className="text-amber-400 font-medium">${calc.appleCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-slate-300">Total Ingredients</span>
          <span className="text-amber-400">${(calc.appleCost + calc.otherIngredients).toFixed(2)}</span>
        </div>
      </Section>

      {/* Packaging */}
      <Section title="📦 Packaging (per unit)">
        <p className="text-xs text-slate-500 -mt-1 mb-2">Per-can costs × 24 + box per case</p>
        <CostInput label="Can cost (each)" value={costs.canCost} onChange={set('canCost')} />
        <CostInput label="Lid cost (each)" value={costs.lidCost} onChange={set('lidCost')} />
        <CostInput label="Label cost (each)" value={costs.labelCost} onChange={set('labelCost')} />
        <CostInput label="Sleeve / box per case" value={costs.sleeveBoxCost} onChange={set('sleeveBoxCost')} />
        <div className="pt-1 border-t border-slate-700 text-xs text-slate-400">
          Packaging per case: ${(24 * (costs.canCost + costs.lidCost + costs.labelCost) + costs.sleeveBoxCost).toFixed(2)}
        </div>
        <CostInput label="1/6 keg rental / fill" value={costs.kegRental16} onChange={set('kegRental16')} />
        <CostInput label="1/2 keg rental / fill" value={costs.kegRental12} onChange={set('kegRental12')} />
        <div className="pt-2 border-t border-slate-700 flex justify-between text-sm font-semibold">
          <span className="text-slate-300">Total Packaging</span>
          <span className="text-amber-400">${calc.totalPackaging.toFixed(2)}</span>
        </div>
      </Section>

      {/* Labor & Overhead */}
      <Section title="⚙️ Labor & Overhead">
        <CostInput label="Labor hours" value={costs.laborHours} onChange={set('laborHours')} prefix="" suffix="hr" />
        <CostInput label="Labor rate" value={costs.laborRate} onChange={set('laborRate')} suffix="/hr" />
        <div className="text-xs text-slate-400 pt-0.5">
          Labor cost: ${calc.laborCost.toFixed(2)}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-500 mb-2">Overhead (per batch)</p>
          <CostInput label="Utilities" value={costs.utilities} onChange={set('utilities')} />
          <CostInput label="Sanitation" value={costs.sanitation} onChange={set('sanitation')} />
          <CostInput label="Misc." value={costs.misc} onChange={set('misc')} />
        </div>
        <div className="pt-2 border-t border-slate-700 flex justify-between text-sm font-semibold">
          <span className="text-slate-300">Labor + Overhead</span>
          <span className="text-amber-400">${(calc.laborCost + calc.overhead).toFixed(2)}</span>
        </div>
      </Section>

      {/* COGS Summary */}
      <div className="lg:col-span-3 bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-base font-semibold text-amber-400 mb-4">COGS Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <CogsRow label="Apple Ingredients" value={calc.appleCost} pct={totalPct(calc.appleCost)} />
            <CogsRow label="Other Ingredients" value={calc.otherIngredients} pct={totalPct(calc.otherIngredients)} />
            <CogsRow label="Labor" value={calc.laborCost} pct={totalPct(calc.laborCost)} />
            <CogsRow label="Overhead" value={calc.overhead} pct={totalPct(calc.overhead)} />
            <CogsRow label="Packaging" value={calc.totalPackaging} pct={totalPct(calc.totalPackaging)} />
            <div className="flex justify-between items-center pt-2 mt-1">
              <span className="font-semibold text-slate-200">Total COGS</span>
              <span className="font-bold text-red-400 text-lg">${calc.totalCOGS.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'COGS / Gallon', value: `$${calc.cogsPerGallon.toFixed(2)}` },
              { label: 'COGS / Case (24pk)', value: `$${calc.cogsPerCase.toFixed(2)}` },
              { label: 'COGS / 1/6 Keg', value: `$${calc.cogsPerSixth.toFixed(2)}` },
              { label: 'COGS / 1/2 Keg', value: `$${calc.cogsPerHalf.toFixed(2)}` },
              { label: 'Cases in batch', value: calc.caseCount },
              { label: '1/6 Kegs in batch', value: calc.sixthCount },
            ].map(s => (
              <div key={s.label} className="bg-slate-700/50 rounded p-3 text-center">
                <div className="text-lg font-bold text-red-400">{s.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
