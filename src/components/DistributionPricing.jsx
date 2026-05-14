function PriceInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <div className="flex items-center bg-slate-700 border border-slate-600 rounded focus-within:border-amber-400">
        <span className="pl-2 text-slate-400 text-xs">$</span>
        <input
          type="number" min="0" step="0.50"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="bg-transparent px-1 py-1.5 text-sm text-slate-100 outline-none w-full"
        />
      </div>
    </div>
  )
}

function MarginBadge({ value }) {
  const pct = parseFloat(value)
  const color = pct >= 30 ? 'text-emerald-400' : pct >= 15 ? 'text-yellow-400' : 'text-red-400'
  return <span className={`font-semibold ${color}`}>{value}%</span>
}

function FormatCard({ title, icon, gallons, unitCount, cogsPerUnit, pricing, ptwKey, ptrKey, setPricing }) {
  const marginPTW = pricing[ptwKey] > 0 ? ((pricing[ptwKey] - cogsPerUnit) / pricing[ptwKey] * 100).toFixed(0) : 0
  const marginPTR = pricing[ptrKey] > 0 ? ((pricing[ptrKey] - cogsPerUnit) / pricing[ptrKey] * 100).toFixed(0) : 0
  const set = key => val => setPricing(p => ({ ...p, [key]: val }))

  return (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-amber-400">{icon} {title}</h2>
        <span className="text-xs text-slate-400">{gallons} gal/unit</span>
      </div>
      <div className="text-xs text-slate-500 mb-4">
        COGS: <span className="text-red-400 font-medium">${cogsPerUnit.toFixed(2)}</span>
        {unitCount > 0 && <span className="ml-2">· {unitCount} units in current mix</span>}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <PriceInput label="PTW (Price to Wholesaler)" value={pricing[ptwKey]} onChange={set(ptwKey)} />
        <PriceInput label="PTR (Price to Retailer)" value={pricing[ptrKey]} onChange={set(ptrKey)} />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-700/40 rounded p-2">
          <div className={`text-sm font-bold ${(pricing[ptwKey] - cogsPerUnit) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${(pricing[ptwKey] - cogsPerUnit).toFixed(2)}
          </div>
          <div className="text-xs text-slate-400">PTW profit/unit</div>
        </div>
        <div className="bg-slate-700/40 rounded p-2">
          <div className={`text-sm font-bold ${(pricing[ptrKey] - cogsPerUnit) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${(pricing[ptrKey] - cogsPerUnit).toFixed(2)}
          </div>
          <div className="text-xs text-slate-400">PTR profit/unit</div>
        </div>
        <div className="bg-slate-700/40 rounded p-2">
          <div className="text-sm font-bold text-blue-400">
            +${(pricing[ptrKey] - pricing[ptwKey]).toFixed(2)}
          </div>
          <div className="text-xs text-slate-400">PTR vs PTW</div>
        </div>
      </div>

      <div className="mt-3 flex justify-between text-xs text-slate-400">
        <span>PTW margin: <MarginBadge value={marginPTW} /></span>
        <span>PTR margin: <MarginBadge value={marginPTR} /></span>
      </div>
    </div>
  )
}

export default function DistributionPricing({ pricing, setPricing, calc }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormatCard title="Cases (24 × 16oz)" icon="🥤"
          gallons={calc.CASE_GAL} unitCount={calc.caseCount}
          cogsPerUnit={calc.cogsPerCase} pricing={pricing}
          ptwKey="casePTW" ptrKey="casePTR" setPricing={setPricing} />
        <FormatCard title="1/6 Barrel Keg" icon="🛢️"
          gallons={calc.SIXTH_GAL} unitCount={calc.sixthCount}
          cogsPerUnit={calc.cogsPerSixth} pricing={pricing}
          ptwKey="sixthPTW" ptrKey="sixthPTR" setPricing={setPricing} />
        <FormatCard title="1/2 Barrel Keg" icon="🛢️"
          gallons={calc.HALF_GAL} unitCount={calc.halfCount}
          cogsPerUnit={calc.cogsPerHalf} pricing={pricing}
          ptwKey="halfPTW" ptrKey="halfPTR" setPricing={setPricing} />
      </div>

      {/* Summary Table */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 overflow-x-auto">
        <h2 className="text-base font-semibold text-amber-400 mb-4">Pricing Summary</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-xs border-b border-slate-700">
              <th className="text-left pb-2">Format</th>
              <th className="text-right pb-2">COGS</th>
              <th className="text-right pb-2">PTW</th>
              <th className="text-right pb-2">PTW Margin</th>
              <th className="text-right pb-2">PTW Profit/unit</th>
              <th className="text-right pb-2">PTR</th>
              <th className="text-right pb-2">PTR Margin</th>
              <th className="text-right pb-2">Units (mix)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { format: 'Case (24 × 16oz)', cogs: calc.cogsPerCase, ptw: pricing.casePTW, ptr: pricing.casePTR, units: calc.caseCount },
              { format: '1/6 Bbl Keg', cogs: calc.cogsPerSixth, ptw: pricing.sixthPTW, ptr: pricing.sixthPTR, units: calc.sixthCount },
              { format: '1/2 Bbl Keg', cogs: calc.cogsPerHalf, ptw: pricing.halfPTW, ptr: pricing.halfPTR, units: calc.halfCount },
            ].map(row => {
              const mPTW = row.ptw > 0 ? ((row.ptw - row.cogs) / row.ptw * 100).toFixed(0) : 0
              const mPTR = row.ptr > 0 ? ((row.ptr - row.cogs) / row.ptr * 100).toFixed(0) : 0
              return (
                <tr key={row.format} className="border-b border-slate-700/50">
                  <td className="py-2 text-slate-300 font-medium">{row.format}</td>
                  <td className="py-2 text-right text-red-400">${row.cogs.toFixed(2)}</td>
                  <td className="py-2 text-right text-blue-400">${row.ptw.toFixed(2)}</td>
                  <td className="py-2 text-right"><MarginBadge value={mPTW} /></td>
                  <td className="py-2 text-right text-emerald-400">${(row.ptw - row.cogs).toFixed(2)}</td>
                  <td className="py-2 text-right text-blue-400">${row.ptr.toFixed(2)}</td>
                  <td className="py-2 text-right"><MarginBadge value={mPTR} /></td>
                  <td className="py-2 text-right text-slate-300">{row.units}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
