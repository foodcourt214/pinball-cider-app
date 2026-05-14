function CostInput({ label, value, onChange, prefix = '$', suffix, note, highlight }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 min-w-0">
        <label className={`text-sm ${highlight ? 'text-slate-200 font-medium' : 'text-slate-300'}`}>{label}</label>
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

function Section({ title, subtitle, children, total, totalLabel }) {
  return (
    <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
      <h2 className="text-base font-semibold text-amber-400">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5 mb-3">{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      <div className="space-y-2.5">{children}</div>
      {total !== undefined && (
        <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between text-sm font-semibold">
          <span className="text-slate-300">{totalLabel || 'Total'}</span>
          <span className="text-amber-400">${total.toFixed(2)}</span>
        </div>
      )}
    </div>
  )
}

function CogsRow({ label, value, note }) {
  return (
    <div className="flex justify-between items-start py-1 border-b border-slate-700/50">
      <div>
        <span className="text-sm text-slate-400">{label}</span>
        {note && <p className="text-xs text-slate-500">{note}</p>}
      </div>
      <span className="text-sm font-medium text-slate-300 ml-4">${value.toFixed(2)}</span>
    </div>
  )
}

export default function CostTracking({ costs, setCosts, calc }) {
  const set = key => val => setCosts(c => ({ ...c, [key]: val }))

  const canningPerCaseTotal = costs.fillServicePerCase + costs.cansPerCase +
    costs.endsPerCase + costs.pakTechPerCase + costs.traysPerCase

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Manufacturing */}
        <Section
          title="🏭 Manufacturing"
          subtitle="Lump-sum production cost for the batch"
          total={costs.manufacturing}
          totalLabel="Manufacturing Total"
        >
          <CostInput label="Production / Manufacturing" value={costs.manufacturing} onChange={set('manufacturing')}
            note="Co-packer or in-house production cost" />
        </Section>

        {/* Canning Packaging — per case */}
        <Section
          title="📦 Canning Packaging"
          subtitle="Per case (24 × 16oz cans = 3 gal). Applies to canned portion only."
          total={canningPerCaseTotal}
          totalLabel={`Per-case total · ${calc.caseCount} cases = $${(canningPerCaseTotal * calc.caseCount).toFixed(2)}`}
        >
          <CostInput label="Fill Service" value={costs.fillServicePerCase} onChange={set('fillServicePerCase')}
            suffix="/cs" note="Canning line fill charge (e.g. $6.33/cs)" />
          <CostInput label="16oz Brite Cans" value={costs.cansPerCase} onChange={set('cansPerCase')}
            suffix="/cs" note="Standard Brite Can — 24 per case" />
          <CostInput label="Ends / Lids" value={costs.endsPerCase} onChange={set('endsPerCase')}
            suffix="/cs" note="Crown LOE 10-State or similar" />
          <CostInput label="PakTech 4-pack Holders" value={costs.pakTechPerCase} onChange={set('pakTechPerCase')}
            suffix="/cs" note="6 × 4-packs per case" />
          <CostInput label="Trays" value={costs.traysPerCase} onChange={set('traysPerCase')}
            suffix="/cs" />
          <div className="pt-1 border-t border-slate-700 text-xs text-slate-400 flex justify-between">
            <span>Packaging cost per case</span>
            <span className="text-amber-400 font-medium">${canningPerCaseTotal.toFixed(2)}</span>
          </div>
        </Section>

        {/* Labels & Canning Labor */}
        <Section title="🏷️ Labels & Labor" subtitle="Lump-sum and hourly costs">
          <CostInput label="Labels (batch total)" value={costs.labelsLumpSum} onChange={set('labelsLumpSum')}
            note="Supported by invoice — total for batch" />
          <div className="pt-2 border-t border-slate-700">
            <p className="text-xs text-slate-500 mb-2">Canning labor</p>
            <CostInput label="Rate" value={costs.canningLaborRate} onChange={set('canningLaborRate')} suffix="/hr" />
            <div className="mt-2">
              <CostInput label="Hours" value={costs.canningLaborHours} onChange={set('canningLaborHours')} prefix="" suffix="hr" />
            </div>
            <div className="mt-2 text-xs text-slate-400 flex justify-between">
              <span>Labor cost</span>
              <span className="text-amber-400 font-medium">${calc.canningLaborCost.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between text-sm font-semibold">
            <span className="text-slate-300">Labels + Labor</span>
            <span className="text-amber-400">${(costs.labelsLumpSum + calc.canningLaborCost).toFixed(2)}</span>
          </div>
        </Section>

        {/* Keg Costs */}
        <Section
          title="🛢️ Keg Costs"
          subtitle="All-in per keg: fill + cleaning + storage"
          total={calc.sixthCount * costs.sixthBblCost + calc.halfCount * costs.halfBblCost}
          totalLabel={`Total keg cost (${calc.sixthCount} × 1/6, ${calc.halfCount} × 1/2)`}
        >
          <CostInput label="1/6 BBL keg (all-in)" value={costs.sixthBblCost} onChange={set('sixthBblCost')}
            suffix="/keg" note="Includes cider fill + cleaning + storage" />
          <CostInput label="1/2 BBL keg (all-in)" value={costs.halfBblCost} onChange={set('halfBblCost')}
            suffix="/keg" note="Includes cider fill + cleaning + storage" />
        </Section>

        {/* Services */}
        <Section
          title="⚗️ Services"
          subtitle="Per-gallon charges applied to full batch"
          total={calc.velcorinTotal}
          totalLabel={`Total services (${parseFloat(calc.CASE_GAL) ? (calc.caseCount * calc.CASE_GAL + calc.sixthCount * calc.SIXTH_GAL + calc.halfCount * calc.HALF_GAL).toFixed(0) : 0} gal)`}
        >
          <CostInput label="Velcorin dosing" value={costs.velcorinPerGal} onChange={set('velcorinPerGal')}
            suffix="/gal" note="Microbial stabilization — per gallon" />
          <div className="text-xs text-slate-400 flex justify-between pt-1">
            <span>{parseFloat(calc.caseCount * calc.CASE_GAL + calc.sixthCount * calc.SIXTH_GAL + calc.halfCount * calc.HALF_GAL).toFixed(1)} gal × ${costs.velcorinPerGal}</span>
            <span className="text-amber-400">${calc.velcorinTotal.toFixed(2)}</span>
          </div>
        </Section>

        {/* Fixed / Other */}
        <Section
          title="📋 Fixed & Taxes"
          subtitle="Cold storage, excise tax, TTB — update from filings"
          total={costs.coldStorage + costs.stateExciseTax + costs.ttbTax}
          totalLabel="Fixed + Tax Total"
        >
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
            <CogsRow label="Apple Ingredients" value={calc.appleCost} />
            <CogsRow label="Adjuncts" value={calc.adjunctCost} />
            <CogsRow label="Manufacturing" value={costs.manufacturing} />
            <CogsRow label="Labels" value={costs.labelsLumpSum} />
            <CogsRow label="Canning Labor" value={calc.canningLaborCost} />
            <CogsRow label="Cold Storage" value={costs.coldStorage} />
            <CogsRow label="State Excise Tax" value={costs.stateExciseTax} />
            <CogsRow label="TTB Tax" value={costs.ttbTax} />
            <CogsRow label="Velcorin (per gal)" value={calc.velcorinTotal} />
            <CogsRow label={`Canning packaging (${calc.caseCount} cases × $${(costs.fillServicePerCase + costs.cansPerCase + costs.endsPerCase + costs.pakTechPerCase + costs.traysPerCase).toFixed(2)})`}
              value={calc.caseCount * (costs.fillServicePerCase + costs.cansPerCase + costs.endsPerCase + costs.pakTechPerCase + costs.traysPerCase)} />
            <CogsRow label={`Kegs (${calc.sixthCount} × 1/6 + ${calc.halfCount} × 1/2)`}
              value={calc.sixthCount * costs.sixthBblCost + calc.halfCount * costs.halfBblCost} />
            <div className="flex justify-between items-center pt-3 mt-1">
              <span className="font-bold text-slate-100 text-base">Total COGS</span>
              <span className="font-bold text-red-400 text-xl">${calc.totalCOGS.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'COGS / Gallon', value: `$${calc.cogsPerGallon.toFixed(2)}`, sub: 'all-in' },
              { label: 'COGS / Case (24pk)', value: `$${calc.cogsPerCase.toFixed(2)}`, sub: '3 gal + pkg' },
              { label: 'COGS / 1/6 Keg', value: `$${calc.cogsPerSixth.toFixed(2)}`, sub: '5.16 gal' },
              { label: 'COGS / 1/2 Keg', value: `$${calc.cogsPerHalf.toFixed(2)}`, sub: '15.5 gal' },
              { label: 'Cases in batch', value: calc.caseCount, sub: `${(calc.caseCount * calc.CASE_GAL).toFixed(0)} gal` },
              { label: '1/6 Kegs in batch', value: calc.sixthCount, sub: `${(calc.sixthCount * calc.SIXTH_GAL).toFixed(0)} gal` },
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
