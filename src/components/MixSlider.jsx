function MixControl({ label, icon, pct, onChange, color }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-300">{icon} {label}</span>
        <span className="text-lg font-bold text-amber-400">{pct}%</span>
      </div>
      <input
        type="range" min="0" max="100" value={pct}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }}
      />
    </div>
  )
}

function FormatProfitCard({ title, icon, units, gallons, revenue, cogsTotal, profitPTW, profitPTR, maxProfit, accentClass, borderClass }) {
  const margin = revenue > 0 ? (profitPTW / revenue * 100).toFixed(0) : 0
  const profitPerUnit = units > 0 ? (profitPTW / units).toFixed(2) : '0.00'

  return (
    <div className={`bg-slate-800 rounded-lg p-5 border ${borderClass}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-200">{icon} {title}</h3>
        <span className="text-xs text-slate-400">{units} units · {gallons.toFixed(1)} gal</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-base font-bold text-blue-400">${revenue.toFixed(0)}</div>
          <div className="text-xs text-slate-400">Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-base font-bold text-red-400">${cogsTotal.toFixed(0)}</div>
          <div className="text-xs text-slate-400">COGS</div>
        </div>
        <div className="text-center">
          <div className={`text-base font-bold ${profitPTW >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${profitPTW.toFixed(0)}
          </div>
          <div className="text-xs text-slate-400">Profit</div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mb-2">
        <span>PTW margin: <span className={`font-medium ${parseFloat(margin) >= 30 ? 'text-emerald-400' : parseFloat(margin) >= 15 ? 'text-yellow-400' : 'text-red-400'}`}>{margin}%</span></span>
        <span>${profitPerUnit}/unit</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${accentClass}`}
          style={{ width: `${Math.max(0, maxProfit > 0 ? (profitPTW / maxProfit) * 100 : 0)}%` }} />
      </div>
      <div className="mt-2 text-xs text-slate-500">
        PTR profit: <span className="text-emerald-300">${profitPTR.toFixed(0)}</span>
      </div>
    </div>
  )
}

export default function MixSlider({ mix, setMix, pricing, calc, recipe }) {
  const handleChange = (key, newVal) => {
    const otherKeys = ['casePct', 'sixthPct', 'halfPct'].filter(k => k !== key)
    const remaining = 100 - newVal
    const currentSum = mix[otherKeys[0]] + mix[otherKeys[1]]
    const next = { ...mix, [key]: newVal }
    if (currentSum === 0) {
      next[otherKeys[0]] = Math.round(remaining / 2)
      next[otherKeys[1]] = remaining - Math.round(remaining / 2)
    } else {
      next[otherKeys[0]] = Math.round((mix[otherKeys[0]] / currentSum) * remaining)
      next[otherKeys[1]] = remaining - next[otherKeys[0]]
    }
    Object.keys(next).forEach(k => { next[k] = Math.max(0, Math.min(100, next[k])) })
    setMix(next)
  }

  const maxProfit = Math.max(
    Math.abs(calc.caseProfit.ptw),
    Math.abs(calc.sixthProfit.ptw),
    Math.abs(calc.halfProfit.ptw),
    1
  )

  return (
    <div className="space-y-6">
      {/* Sliders */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-amber-400">Format Mix</h2>
          <span className="text-xs text-slate-400">
            {recipe.totalGallons} total gal — {mix.casePct + mix.sixthPct + mix.halfPct}% allocated
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MixControl label="Cases (24 × 16oz)" icon="🥤" pct={mix.casePct}
            onChange={v => handleChange('casePct', v)} color="#f59e0b" />
          <MixControl label="1/6 Bbl Kegs" icon="🛢️" pct={mix.sixthPct}
            onChange={v => handleChange('sixthPct', v)} color="#3b82f6" />
          <MixControl label="1/2 Bbl Kegs" icon="🛢️" pct={mix.halfPct}
            onChange={v => handleChange('halfPct', v)} color="#8b5cf6" />
        </div>

        {/* Visual stacked bar */}
        <div className="mt-4">
          <div className="flex rounded-full overflow-hidden h-4">
            <div className="bg-amber-500 transition-all" style={{ width: `${mix.casePct}%` }} />
            <div className="bg-blue-500 transition-all" style={{ width: `${mix.sixthPct}%` }} />
            <div className="bg-violet-500 transition-all" style={{ width: `${mix.halfPct}%` }} />
          </div>
          <div className="flex text-xs text-slate-400 mt-1 justify-between">
            <span className="text-amber-400">🥤 Cases {mix.casePct}% ({calc.caseCount} cs)</span>
            <span className="text-blue-400">🛢️ 1/6 {mix.sixthPct}% ({calc.sixthCount} kegs)</span>
            <span className="text-violet-400">🛢️ 1/2 {mix.halfPct}% ({calc.halfCount} kegs)</span>
          </div>
        </div>
      </div>

      {/* Per-format profit cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormatProfitCard
          title="Cases (24 × 16oz)" icon="🥤"
          units={calc.caseCount} gallons={calc.caseGallons}
          revenue={calc.caseProfit.revenuePTW} cogsTotal={calc.caseProfit.cogsTotal}
          profitPTW={calc.caseProfit.ptw} profitPTR={calc.caseProfit.ptr}
          maxProfit={maxProfit} accentClass="bg-amber-500" borderClass="border-amber-500/30"
        />
        <FormatProfitCard
          title="1/6 Bbl Kegs" icon="🛢️"
          units={calc.sixthCount} gallons={calc.sixthGallons}
          revenue={calc.sixthProfit.revenuePTW} cogsTotal={calc.sixthProfit.cogsTotal}
          profitPTW={calc.sixthProfit.ptw} profitPTR={calc.sixthProfit.ptr}
          maxProfit={maxProfit} accentClass="bg-blue-500" borderClass="border-blue-500/30"
        />
        <FormatProfitCard
          title="1/2 Bbl Kegs" icon="🛢️"
          units={calc.halfCount} gallons={calc.halfGallons}
          revenue={calc.halfProfit.revenuePTW} cogsTotal={calc.halfProfit.cogsTotal}
          profitPTW={calc.halfProfit.ptw} profitPTR={calc.halfProfit.ptr}
          maxProfit={maxProfit} accentClass="bg-violet-500" borderClass="border-violet-500/30"
        />
      </div>

      {/* Totals */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-base font-semibold text-amber-400 mb-4">Batch Profit Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Revenue (PTW)', value: `$${calc.totalRevenuePTW.toFixed(0)}`, color: 'text-blue-400' },
            { label: 'Total COGS', value: `$${calc.totalCOGS.toFixed(0)}`, color: 'text-red-400' },
            { label: 'Gross Profit (PTW)', value: `$${calc.totalProfitPTW.toFixed(0)}`, color: calc.totalProfitPTW >= 0 ? 'text-emerald-400' : 'text-red-400' },
            { label: 'Gross Margin', value: `${calc.grossMarginPct}%`, color: parseFloat(calc.grossMarginPct) >= 30 ? 'text-emerald-400' : parseFloat(calc.grossMarginPct) >= 15 ? 'text-yellow-400' : 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-700/50 rounded p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
          {[
            { label: 'Revenue (PTR)', value: `$${calc.totalRevenuePTR.toFixed(0)}`, color: 'text-blue-300' },
            { label: 'Profit (PTR)', value: `$${calc.totalProfitPTR.toFixed(0)}`, color: calc.totalProfitPTR >= 0 ? 'text-emerald-300' : 'text-red-300' },
            { label: 'Total Cases', value: calc.caseCount, color: 'text-amber-400' },
            { label: 'Total Kegs', value: calc.sixthCount + calc.halfCount, color: 'text-blue-400' },
          ].map(s => (
            <div key={s.label}>
              <span className={`font-semibold ${s.color}`}>{s.value}</span>
              <span className="text-slate-500 ml-1 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
