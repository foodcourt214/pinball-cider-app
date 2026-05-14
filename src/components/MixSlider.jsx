import { useMemo } from 'react'
import { calcBatch } from '../App'

function Bar({ value, max, color }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  return (
    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

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

function ProfitCard({ label, icon, unitCount, revenueKey, profitKey, cogsKey, pricing, calc, gallons, formatGal }) {
  const revenue = calc[revenueKey] || 0
  const profit = calc[profitKey]
  const cogsTotal = unitCount * cogsKey
  const margin = revenue > 0 ? (profit / revenue * 100).toFixed(0) : 0
  const profitPerUnit = unitCount > 0 ? (profit / unitCount).toFixed(2) : '0.00'

  return (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-200">{icon} {label}</h3>
        <span className="text-xs text-slate-400">{unitCount} units · {gallons.toFixed(1)} gal</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">${revenue.toFixed(0)}</div>
          <div className="text-xs text-slate-400">Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">${cogsTotal.toFixed(0)}</div>
          <div className="text-xs text-slate-400">COGS</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${profit.toFixed(0)}
          </div>
          <div className="text-xs text-slate-400">Profit</div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Margin: <span className={`font-medium ${parseFloat(margin) >= 30 ? 'text-emerald-400' : parseFloat(margin) >= 15 ? 'text-yellow-400' : 'text-red-400'}`}>{margin}%</span></span>
        <span>${profitPerUnit}/unit</span>
      </div>
      <Bar value={profit} max={Math.max(calc.caseProfit.ptw, calc.sixthProfit.ptw, calc.halfProfit.ptw, 1)} color={profit >= 0 ? 'bg-emerald-500' : 'bg-red-500'} />
    </div>
  )
}

export default function MixSlider({ mix, setMix, pricing, calc, recipe }) {
  // When one slider moves, redistribute the remainder proportionally between the other two
  const handleChange = (key, newVal) => {
    const others = { casePct: mix.casePct, sixthPct: mix.sixthPct, halfPct: mix.halfPct }
    others[key] = newVal
    const otherKeys = Object.keys(others).filter(k => k !== key)
    const remaining = 100 - newVal
    const currentSum = mix[otherKeys[0]] + mix[otherKeys[1]]
    if (currentSum === 0) {
      others[otherKeys[0]] = Math.round(remaining / 2)
      others[otherKeys[1]] = remaining - Math.round(remaining / 2)
    } else {
      others[otherKeys[0]] = Math.round((mix[otherKeys[0]] / currentSum) * remaining)
      others[otherKeys[1]] = remaining - others[otherKeys[0]]
    }
    // Clamp
    Object.keys(others).forEach(k => { others[k] = Math.max(0, Math.min(100, others[k])) })
    setMix(others)
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
            Total: {mix.casePct + mix.sixthPct + mix.halfPct}% of {recipe.totalGallons} gal
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MixControl label="Cases (24pk)" icon="🥤" pct={mix.casePct}
            onChange={v => handleChange('casePct', v)} color="#f59e0b" />
          <MixControl label="1/6 Bbl Kegs" icon="🛢️" pct={mix.sixthPct}
            onChange={v => handleChange('sixthPct', v)} color="#3b82f6" />
          <MixControl label="1/2 Bbl Kegs" icon="🛢️" pct={mix.halfPct}
            onChange={v => handleChange('halfPct', v)} color="#8b5cf6" />
        </div>

        {/* Visual mix bar */}
        <div className="mt-4">
          <div className="flex rounded-full overflow-hidden h-4">
            <div className="bg-amber-500 transition-all" style={{ width: `${mix.casePct}%` }} title={`Cases ${mix.casePct}%`} />
            <div className="bg-blue-500 transition-all" style={{ width: `${mix.sixthPct}%` }} title={`1/6 Kegs ${mix.sixthPct}%`} />
            <div className="bg-violet-500 transition-all" style={{ width: `${mix.halfPct}%` }} title={`1/2 Kegs ${mix.halfPct}%`} />
          </div>
          <div className="flex text-xs text-slate-400 mt-1 justify-between">
            <span>🥤 Cases {mix.casePct}%</span>
            <span>🛢️ 1/6 Kegs {mix.sixthPct}%</span>
            <span>🛢️ 1/2 Kegs {mix.halfPct}%</span>
          </div>
        </div>
      </div>

      {/* Per-format profit cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-5 border border-amber-500/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-200">🥤 Cases (24pk)</h3>
            <span className="text-xs text-slate-400">{calc.caseCount} units · {calc.caseGallons.toFixed(1)} gal</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <div className="text-base font-bold text-blue-400">${calc.caseProfit.revenuePTW.toFixed(0)}</div>
              <div className="text-xs text-slate-400">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-red-400">${calc.caseProfit.cogsTotal.toFixed(0)}</div>
              <div className="text-xs text-slate-400">COGS</div>
            </div>
            <div className="text-center">
              <div className={`text-base font-bold ${calc.caseProfit.ptw >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${calc.caseProfit.ptw.toFixed(0)}
              </div>
              <div className="text-xs text-slate-400">Profit</div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>PTW margin: <span className="text-amber-400 font-medium">
              {calc.caseProfit.revenuePTW > 0 ? (calc.caseProfit.ptw / calc.caseProfit.revenuePTW * 100).toFixed(0) : 0}%
            </span></span>
            <span>${calc.caseCount > 0 ? (calc.caseProfit.ptw / calc.caseCount).toFixed(2) : '0.00'}/case</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.max(0, (calc.caseProfit.ptw / maxProfit) * 100)}%` }} />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            PTR profit: <span className="text-emerald-400">${calc.caseProfit.ptr.toFixed(0)}</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-5 border border-blue-500/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-200">🛢️ 1/6 Bbl Kegs</h3>
            <span className="text-xs text-slate-400">{calc.sixthCount} units · {calc.sixthGallons.toFixed(1)} gal</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <div className="text-base font-bold text-blue-400">${calc.sixthProfit.revenuePTW.toFixed(0)}</div>
              <div className="text-xs text-slate-400">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-red-400">${calc.sixthProfit.cogsTotal.toFixed(0)}</div>
              <div className="text-xs text-slate-400">COGS</div>
            </div>
            <div className="text-center">
              <div className={`text-base font-bold ${calc.sixthProfit.ptw >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${calc.sixthProfit.ptw.toFixed(0)}
              </div>
              <div className="text-xs text-slate-400">Profit</div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>PTW margin: <span className="text-blue-400 font-medium">
              {calc.sixthProfit.revenuePTW > 0 ? (calc.sixthProfit.ptw / calc.sixthProfit.revenuePTW * 100).toFixed(0) : 0}%
            </span></span>
            <span>${calc.sixthCount > 0 ? (calc.sixthProfit.ptw / calc.sixthCount).toFixed(2) : '0.00'}/keg</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.max(0, (calc.sixthProfit.ptw / maxProfit) * 100)}%` }} />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            PTR profit: <span className="text-emerald-400">${calc.sixthProfit.ptr.toFixed(0)}</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-5 border border-violet-500/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-200">🛢️ 1/2 Bbl Kegs</h3>
            <span className="text-xs text-slate-400">{calc.halfCount} units · {calc.halfGallons.toFixed(1)} gal</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <div className="text-base font-bold text-blue-400">${calc.halfProfit.revenuePTW.toFixed(0)}</div>
              <div className="text-xs text-slate-400">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-red-400">${calc.halfProfit.cogsTotal.toFixed(0)}</div>
              <div className="text-xs text-slate-400">COGS</div>
            </div>
            <div className="text-center">
              <div className={`text-base font-bold ${calc.halfProfit.ptw >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${calc.halfProfit.ptw.toFixed(0)}
              </div>
              <div className="text-xs text-slate-400">Profit</div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>PTW margin: <span className="text-violet-400 font-medium">
              {calc.halfProfit.revenuePTW > 0 ? (calc.halfProfit.ptw / calc.halfProfit.revenuePTW * 100).toFixed(0) : 0}%
            </span></span>
            <span>${calc.halfCount > 0 ? (calc.halfProfit.ptw / calc.halfCount).toFixed(2) : '0.00'}/keg</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${Math.max(0, (calc.halfProfit.ptw / maxProfit) * 100)}%` }} />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            PTR profit: <span className="text-emerald-400">${calc.halfProfit.ptr.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Bottom totals */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-base font-semibold text-amber-400 mb-4">Batch Profit Summary (PTW)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: `$${calc.totalRevenuePTW.toFixed(2)}`, color: 'text-blue-400' },
            { label: 'Total COGS', value: `$${calc.totalCOGS.toFixed(2)}`, color: 'text-red-400' },
            { label: 'Gross Profit', value: `$${calc.totalProfitPTW.toFixed(2)}`, color: calc.totalProfitPTW >= 0 ? 'text-emerald-400' : 'text-red-400' },
            { label: 'Gross Margin', value: `${calc.grossMarginPct}%`, color: parseFloat(calc.grossMarginPct) >= 30 ? 'text-emerald-400' : parseFloat(calc.grossMarginPct) >= 15 ? 'text-yellow-400' : 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-700/50 rounded p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
          {[
            { label: 'PTR Revenue', value: `$${calc.totalRevenuePTR.toFixed(2)}`, color: 'text-blue-300' },
            { label: 'PTR Profit', value: `$${calc.totalProfitPTR.toFixed(2)}`, color: calc.totalProfitPTR >= 0 ? 'text-emerald-300' : 'text-red-300' },
            { label: 'Cases', value: calc.caseCount, color: 'text-amber-400' },
            { label: 'Kegs total', value: calc.sixthCount + calc.halfCount, color: 'text-blue-400' },
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
