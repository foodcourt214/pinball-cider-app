function CostInput({ label, value, onChange, prefix = '$', suffix, note }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 min-w-0">
        <label className="text-sm text-slate-300">{label}</label>
        {note && <p className="text-xs text-slate-500">{note}</p>}
      </div>
      <div className="flex items-center bg-slate-700 border border-slate-600 rounded focus-within:border-amber-400 w-28 flex-shrink-0">
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

function Section({ title, subtitle, badge, children, total, totalLabel }) {
  return (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-base font-semibold text-amber-400">{title}</h2>
        {badge && <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">{badge}</span>}
      </div>
      {subtitle && <p className="text-xs text-slate-500 mb-3">{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      <div className="space-y-2.5">{children}</div>
      {total !== undefined && (
        <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between text-sm font-semibold">
          <span className="text-slate-300">{totalLabel || 'Total'}</span>
          <span className="text-amber-400">${typeof total === 'number' ? total.toFixed(2) : total}</span>
        </div>
      )}
    </div>
  )
}

function CogsRow({ label, value, note, bold }) {
  return (
    <div className={`flex justify-between items-start py-1 border-b border-slate-700/50 ${bold ? 'mt-1' : ''}`}>
      <div>
        <span className={`text-sm ${bold ? 'font-semibold text-slate-200' : 'text-slate-400'}`}>{label}</span>
        {note && <p className="text-xs text-slate-500">{note}</p>}
      </div>
      <span className={`text-sm ml-4 ${bold ? 'font-bold text-red-400' : 'text-slate-300'}`}>${value.toFixed(2)}</span>
    </div>
  )
}

export default function CostTracking({ costs, setCosts, calc }) {
  const set = key => val => setCosts(c => ({ ...c, [key]: val }))

  const canningPkgPerCase = costs.fillServicePerCase + costs.cansPerCase +
    costs.endsPerCase + costs.pakTechPerCase + costs.traysPerCase
  const labelPerCase = 24 * (costs.labelCostPerM / 1000)
  const totalPerCase = canningPkgPerCase + labelPerCase

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Manufacturing */}
        <Section title="🏭 Manufacturing" badge="Batch lump sum"
          subtitle="Allocated across all formats proportionally by gallon"
          total={costs.manufacturing} totalLabel="Manufacturing Total">
          <CostInput label="Production / Manufacturing" value={costs.manufacturing} onChange={set('manufacturing')}
            note="Co-packer or in-house production cost" />
        </Section>

        {/* Canning Packaging */}
        <Section title="📦 Canning Packaging" badge="Per case"
          subtitle={`Per case (24 × 16oz = 3 gal) · ${calc.caseCount} cases · total $${(totalPerCase * calc.caseCount).toFixed(2)}`}>
          <CostInput label="Fill Service" value={costs.fillServicePerCase} onChange={set('fillServicePerCase')}
            suffix="/cs" note="Canning line fill charge" />
          <CostInput label="16oz Brite Cans" value={costs.cansPerCase} onChange={set('cansPerCase')}
            suffix="/cs" note="24 cans per case" />
          <CostInput label="Ends / Lids" value={costs.endsPerCase} onChange={set('endsPerCase')}
            suffix="/cs" note="Crown LOE 10-State" />
          <CostInput label="PakTech 4-pack Holders" value={costs.pakTechPerCase} onChange={set('pakTechPerCase')}
            suffix="/cs" />
          <CostInput label="Trays" value={costs.traysPerCase} onChange={set('traysPerCase')}
            suffix="/cs" />
          <div className="pt-1 border-t border-slate-700 text-xs text-slate-400 flex justify-between">
            <span>Packaging subtotal / case</span>
            <span className="text-slate-300">${canningPkgPerCase.toFixed(2)}</span>
          </div>
        </Section>

        {/* Labels — auto-calculated */}
        <Section title="🏷️ Labels" badge="Per can (auto)"
          subtitle="Auto-calculated from can count. Rate from Northwest Label invoice.">
          <CostInput label="Label cost" value={costs.labelCostPerM} onChange={set('labelCostPerM')}
            suffix="/M" note="Per 1,000 labels ($/M) — invoice: $247.96/M" />
          <div className="mt-2 bg-slate-700/40 rounded p-3 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Cans in mix</span>
              <span className="text-slate-200">{calc.totalCanCount.toLocaleString()} cans</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Cost per can</span>
              <span className="text-slate-200">${(costs.labelCostPerM / 1000).toFixed(5)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Cost per case (24 cans)</span>
              <span className="text-slate-200">${labelPerCase.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium border-t border-slate-600 pt-1 mt-1">
              <span className="text-slate-300">Total label cost</span>
              <span className="text-amber-400">${calc.labelCostTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between text-sm font-semibold">
            <span className="text-slate-300">All-in per case (pkg + labels)</span>
            <span className="text-amber-400">${totalPerCase.toFixed(2)}</span>
          </div>
        </Section>

        {/* Canning Labor */}
        <Section title="👷 Canning Labor" badge="Canning only"
          subtitle="Lump sum allocated to canned gallons only — not applied to kegs">
          <CostInput label="Rate" value={costs.canningLaborRate} onChange={set('canningLaborRate')} suffix="/hr" />
          <CostInput label="Hours" value={costs.canningLaborHours} onChange={set('canningLaborHours')} prefix="" suffix="hr" />
          <div className="mt-2 bg-slate-700/40 rounded p-2 text-xs flex justify-between">
            <span className="text-slate-400">Labor cost</span>
            <span className="text-amber-400 font-medium">${calc.canningLaborCost.toFixed(2)}</span>
          </div>
        </Section>

        {/* Contract Producer Fee */}
        <Section title="🤝 Contract Producer Fee" badge="Per canned gal"
          subtitle="Co-packer charge per gallon of canned product — not applied to kegs">
          <CostInput label="Rate" value={costs.contractFeePerGal} onChange={set('contractFeePerGal')}
            suffix="/gal" note="Charged on canned gallons only" />
          <div className="mt-2 bg-slate-700/40 rounded p-3 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Canned gallons</span>
              <span className="text-slate-200">{calc.caseGallons.toFixed(1)} gal</span>
            </div>
            <div className="flex justify-between font-medium border-t border-slate-600 pt-1 mt-1">
              <span className="text-slate-300">Total contract fee</span>
              <span className="text-amber-400">${calc.contractFeeTotal.toFixed(2)}</span>
            </div>
          </div>
        </Section>

        {/* Services — Velcorin */}
        <Section title="⚗️ Velcorin / Services" badge="Per canned gal"
          subtitle="Applied to canned gallons only — kegs are not dosed">
          <CostInput label="Velcorin dosing" value={costs.velcorinPerGal} onChange={set('velcorinPerGal')}
            suffix="/gal" note="Microbial stabilization for canning" />
          <div className="mt-2 bg-slate-700/40 rounded p-3 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Canned gallons</span>
              <span className="text-slate-200">{calc.caseGallons.toFixed(1)} gal</span>
            </div>
            <div className="flex justify-between font-medium border-t border-slate-600 pt-1 mt-1">
              <span className="text-slate-300">Total Velcorin cost</span>
              <span className="text-amber-400">${calc.velcorinTotal.toFixed(2)}</span>
            </div>
          </div>
        </Section>

        {/* Keg Costs */}
        <Section title="🛢️ Keg Costs" badge="Per keg"
          subtitle="All-in per keg: fill + cleaning + storage. No canning costs applied."
          total={calc.sixthCount * costs.sixthBblCost + calc.halfCount * costs.halfBblCost}
          totalLabel={`${calc.sixthCount} × 1/6 + ${calc.halfCount} × 1/2`}>
          <CostInput label="1/6 BBL keg (all-in)" value={costs.sixthBblCost} onChange={set('sixthBblCost')}
            suffix="/keg" note="Fill + cleaning + storage" />
          <CostInput label="1/2 BBL keg (all-in)" value={costs.halfBblCost} onChange={set('halfBblCost')}
            suffix="/keg" note="Fill + cleaning + storage" />
        </Section>

        {/* Fixed & Taxes */}
        <Section title="📋 Fixed & Taxes" badge="Batch lump sum"
          subtitle="Allocated across all formats — update taxes from filings"
          total={costs.coldStorage + costs.stateExciseTax + costs.ttbTax}
          totalLabel="Fixed + Tax Total">
          <CostInput label="Cold Storage" value={costs.coldStorage} onChange={set('coldStorage')}
            note="Includes forklift in/out" />
          <CostInput label="State Excise Tax" value={costs.stateExciseTax} onChange={set('stateExciseTax')}
            note="Supported by tax filings" />
          <CostInput label="TTB Tax" value={costs.ttbTax} onChange={set('ttbTax')}
            note="Supported by tax filings" />
        </Section>

      </div>

      {/* COGS Summary */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-base font-semibold text-amber-400 mb-4">COGS Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Batch-wide costs</p>
            <CogsRow label="Apple Ingredients" value={calc.appleCost} />
            <CogsRow label="Adjuncts" value={calc.adjunctCost} />
            <CogsRow label="Manufacturing" value={costs.manufacturing} />
            <CogsRow label="Cold Storage" value={costs.coldStorage} />
            <CogsRow label="State Excise Tax" value={costs.stateExciseTax} />
            <CogsRow label="TTB Tax" value={costs.ttbTax} />
            <p className="text-xs text-slate-500 mt-3 mb-2 font-medium uppercase tracking-wide">Canning-only costs</p>
            <CogsRow label="Canning Labor" value={calc.canningLaborCost} note={`${calc.caseGallons.toFixed(0)} canned gal`} />
            <CogsRow label={`Contract Producer Fee ($${costs.contractFeePerGal}/gal)`} value={calc.contractFeeTotal} note={`${calc.caseGallons.toFixed(0)} canned gal`} />
            <CogsRow label={`Velcorin ($${costs.velcorinPerGal}/gal)`} value={calc.velcorinTotal} note={`${calc.caseGallons.toFixed(0)} canned gal`} />
            <CogsRow label={`Case packaging + labels (${calc.caseCount} cs × $${calc.canningCostPerCase.toFixed(2)})`} value={calc.directCaseCost} />
            <p className="text-xs text-slate-500 mt-3 mb-2 font-medium uppercase tracking-wide">Keg costs</p>
            <CogsRow label={`Kegs (${calc.sixthCount} × 1/6 + ${calc.halfCount} × 1/2)`} value={calc.directKegCost} />
            <CogsRow label="Total COGS" value={calc.totalCOGS} bold />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'COGS / Case', value: `$${calc.cogsPerCase.toFixed(2)}`, sub: '(can + allocated)' },
              { label: 'COGS / 1/6 Keg', value: `$${calc.cogsPerSixth.toFixed(2)}`, sub: '(keg + allocated)' },
              { label: 'COGS / 1/2 Keg', value: `$${calc.cogsPerHalf.toFixed(2)}`, sub: '(keg + allocated)' },
              { label: 'COGS / Batch Gal', value: `$${calc.cogsPerGallon.toFixed(2)}`, sub: 'fixed only' },
              { label: 'Cases in mix', value: calc.caseCount, sub: `${calc.caseGallons.toFixed(0)} gal` },
              { label: 'Kegs in mix', value: calc.sixthCount + calc.halfCount, sub: `${(calc.sixthCount * calc.SIXTH_GAL + calc.halfCount * calc.HALF_GAL).toFixed(0)} gal` },
            ].map(s => (
              <div key={s.label} className="bg-slate-700/50 rounded p-3 text-center">
                <div className="text-lg font-bold text-red-400">{s.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                {s.sub && <div className="text-xs text-slate-500">{s.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
