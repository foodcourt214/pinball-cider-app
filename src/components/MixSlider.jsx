function Slider({ label, icon, pct, onChange, color, sub }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-300">{icon} {label}</span>
        <span className="text-lg font-bold text-amber-400">{pct}%</span>
      </div>
      {sub && <p className="text-xs text-slate-500 mb-2">{sub}</p>}
      <input
        type="range" min="0" max="100" value={pct}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }}
      />
    </div>
  )
}

function ChannelSlider({ label, icon, ptwPct, onChange, count, color }) {
  const ptrPct = 100 - ptwPct
  const ptwCount = Math.round(count * (ptwPct / 100))
  const ptrCount = count - ptwCount
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-300">{icon} {label}</span>
        <span className="text-xs text-slate-400">{count} total units</span>
      </div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-blue-400 font-medium">PTW {ptwPct}% ({ptwCount} units)</span>
        <span className="text-violet-400 font-medium">PTR {ptrPct}% ({ptrCount} units)</span>
      </div>
      <input
        type="range" min="0" max="100" value={ptwPct}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }}
      />
      {/* Mini stacked bar */}
      <div className="flex rounded-full overflow-hidden h-1.5 mt-2">
        <div className="bg-blue-500 transition-all" style={{ width: `${ptwPct}%` }} />
        <div className="bg-violet-500 transition-all" style={{ width: `${ptrPct}%` }} />
      </div>
    </div>
  )
}

function FormatCard({ title, icon, units, gallons, blendData, cogsTotal, accentClass, borderClass }) {
  const margin = parseFloat(blendData.margin)
  const marginColor = margin >= 30 ? 'text-emerald-400' : margin >= 15 ? 'text-yellow-400' : 'text-red-400'
  const profitPerUnit = units > 0 ? (blendData.profit / units).toFixed(2) : '0.00'

  return (
    <div className={`bg-slate-800 rounded-lg p-5 border ${borderClass}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-200">{icon} {title}</h3>
        <span className="text-xs text-slate-400">{units} units · {gallons.toFixed(1)} gal</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-base font-bold text-blue-400">${blendData.revenue.toFixed(0)}</div>
          <div className="text-xs text-slate-400">Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-base font-bold text-red-400">${cogsTotal.toFixed(0)}</div>
          <div className="text-xs text-slate-400">COGS</div>
        </div>
        <div className="text-center">
          <div className={`text-base font-bold ${blendData.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${blendData.profit.toFixed(0)}
          </div>
          <div className="text-xs text-slate-400">Profit</div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mb-2">
        <span>Margin: <span className={`font-medium ${marginColor}`}>{blendData.margin}%</span></span>
        <span>${profitPerUnit}/unit blended</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${accentClass} transition-all`}
          style={{ width: `${Math.max(0, Math.min(100, blendData.revenue > 0 ? (blendData.profit / blendData.revenue) * 100 : 0))}%` }} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-slate-500">
        <span>PTW ({blendData.ptwCount} units): ${blendData.ptwCount > 0 ? (blendData.ptwCount * (blendData.revenue / units - 0)).toFixed(0) : 0}</span>
        <span className="text-right">PTR ({blendData.ptrCount} units)</span>
      </div>
    </div>
  )
}

export default function MixSlider({ mix, setMix, channelMix, setChannelMix, pricing, calc, recipe, blended }) {
  // Format mix: redistribute remaining proportionally
  const handleMixChange = (key, newVal) => {
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

  const setChannel = key => val => setChannelMix(c => ({ ...c, [key]: val }))

  return (
    <div className="space-y-6">
      {/* Format Mix */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-amber-400">Format Mix</h2>
            <p className="text-xs text-slate-500 mt-0.5">What % of the batch goes to each package format</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-500">Ordered</div>
              <div className="text-xs text-slate-400">{Math.round(calc.gallons || 0)} gal</div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <label className="text-xs text-slate-500">Final gallons (after loss)</label>
              <div className="flex items-center bg-slate-700 border border-slate-600 rounded focus-within:border-amber-400">
                <input
                  type="number" min="0" step="1"
                  value={mix.finalGallons}
                  onChange={e => setMix(m => ({ ...m, finalGallons: e.target.value }))}
                  placeholder={Math.round(calc.gallons || 0)}
                  className="bg-transparent px-2 py-1 text-sm text-slate-100 outline-none w-24 text-right"
                />
                <span className="pr-2 text-slate-400 text-xs">gal</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Slider label="Cases (24 × 16oz)" icon="🥤" pct={mix.casePct}
            sub={`${calc.caseCount} cases · ${Math.round(calc.caseGallons)} gal`}
            onChange={v => handleMixChange('casePct', v)} color="#f59e0b" />
          <Slider label="1/6 Bbl Kegs" icon="🛢️" pct={mix.sixthPct}
            sub={`${calc.sixthCount} kegs · ${Math.round(calc.sixthGallons)} gal`}
            onChange={v => handleMixChange('sixthPct', v)} color="#3b82f6" />
          <Slider label="1/2 Bbl Kegs" icon="🛢️" pct={mix.halfPct}
            sub={`${calc.halfCount} kegs · ${Math.round(calc.halfGallons)} gal`}
            onChange={v => handleMixChange('halfPct', v)} color="#8b5cf6" />
        </div>
        <div className="mt-4">
          <div className="flex rounded-full overflow-hidden h-4">
            <div className="bg-amber-500 transition-all" style={{ width: `${mix.casePct}%` }} />
            <div className="bg-blue-500 transition-all" style={{ width: `${mix.sixthPct}%` }} />
            <div className="bg-violet-500 transition-all" style={{ width: `${mix.halfPct}%` }} />
          </div>
          <div className="flex text-xs text-slate-400 mt-1 justify-between">
            <span className="text-amber-400">🥤 Cases {mix.casePct}%</span>
            <span className="text-blue-400">🛢️ 1/6 Kegs {mix.sixthPct}%</span>
            <span className="text-violet-400">🛢️ 1/2 Kegs {mix.halfPct}%</span>
          </div>
        </div>
      </div>

      {/* Channel Mix — PTW vs PTR */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-amber-400">Channel Mix — PTW vs PTR</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Of each format, what % sells at wholesale (PTW) vs retail (PTR)?
            Revenue and profit update live.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChannelSlider label="Cases" icon="🥤" ptwPct={channelMix.casePtwPct}
            onChange={setChannel('casePtwPct')} count={calc.caseCount} color="#f59e0b" />
          <ChannelSlider label="1/6 Bbl Kegs" icon="🛢️" ptwPct={channelMix.sixthPtwPct}
            onChange={setChannel('sixthPtwPct')} count={calc.sixthCount} color="#3b82f6" />
          <ChannelSlider label="1/2 Bbl Kegs" icon="🛢️" ptwPct={channelMix.halfPtwPct}
            onChange={setChannel('halfPtwPct')} count={calc.halfCount} color="#8b5cf6" />
        </div>
        {/* Legend */}
        <div className="mt-3 flex gap-4 text-xs text-slate-400">
          <span><span className="inline-block w-3 h-2 bg-blue-500 rounded mr-1" />PTW = Price to Wholesaler (${pricing.casePTW} / ${pricing.sixthPTW} / ${pricing.halfPTW})</span>
          <span><span className="inline-block w-3 h-2 bg-violet-500 rounded mr-1" />PTR = Price to Retailer (${pricing.casePTR} / ${pricing.sixthPTR} / ${pricing.halfPTR})</span>
        </div>
      </div>

      {/* Per-format profit cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormatCard title="Cases (24 × 16oz)" icon="🥤"
          units={calc.caseCount} gallons={calc.caseGallons}
          blendData={blended.case} cogsTotal={calc.caseProfit.cogsTotal}
          accentClass="bg-amber-500" borderClass="border-amber-500/30" />
        <FormatCard title="1/6 Bbl Kegs" icon="🛢️"
          units={calc.sixthCount} gallons={calc.sixthGallons}
          blendData={blended.sixth} cogsTotal={calc.sixthProfit.cogsTotal}
          accentClass="bg-blue-500" borderClass="border-blue-500/30" />
        <FormatCard title="1/2 Bbl Kegs" icon="🛢️"
          units={calc.halfCount} gallons={calc.halfGallons}
          blendData={blended.half} cogsTotal={calc.halfProfit.cogsTotal}
          accentClass="bg-violet-500" borderClass="border-violet-500/30" />
      </div>

      {/* Totals */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-base font-semibold text-amber-400 mb-4">Batch Profit Summary (Blended)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Blended Revenue', value: `$${blended.totalRevenue.toFixed(0)}`, color: 'text-blue-400' },
            { label: 'Total COGS', value: `$${calc.totalCOGS.toFixed(0)}`, color: 'text-red-400' },
            { label: 'Gross Profit', value: `$${blended.totalProfit.toFixed(0)}`, color: blended.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400' },
            { label: 'Gross Margin', value: `${blended.totalMargin}%`, color: parseFloat(blended.totalMargin) >= 30 ? 'text-emerald-400' : parseFloat(blended.totalMargin) >= 15 ? 'text-yellow-400' : 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-700/50 rounded p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        {/* PTW-only vs PTR-only reference */}
        <div className="pt-4 border-t border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
          {[
            { label: 'If 100% PTW', value: `$${calc.totalProfitPTW.toFixed(0)}`, color: 'text-slate-400' },
            { label: 'If 100% PTR', value: `$${calc.totalProfitPTR.toFixed(0)}`, color: 'text-slate-400' },
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
