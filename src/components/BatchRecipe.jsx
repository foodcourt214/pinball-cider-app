import { useState } from 'react'

function Field({ label, value, onChange, type = 'text', step, min, suffix, note }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <div className="flex items-center bg-slate-700 rounded border border-slate-600 focus-within:border-amber-400">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          step={step}
          min={min}
          className="flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-100 outline-none min-w-0"
        />
        {suffix && <span className="pr-2 text-slate-400 text-sm">{suffix}</span>}
      </div>
      {note && <p className="text-xs text-slate-500 mt-0.5">{note}</p>}
    </div>
  )
}

const UNITS = ['lbs', 'oz', 'kg', 'g', 'gal', 'L', 'mL', 'fl oz']

export default function BatchRecipe({ recipe, setRecipe, calc }) {
  const [nextAppleId, setNextAppleId] = useState(3)
  const [nextAdjunctId, setNextAdjunctId] = useState(3)

  const update = (key, val) => setRecipe(r => ({ ...r, [key]: val }))

  // Apple variety helpers
  const updateVariety = (id, key, val) =>
    setRecipe(r => ({ ...r, appleVarieties: r.appleVarieties.map(v => v.id === id ? { ...v, [key]: val } : v) }))
  const addVariety = () => {
    setRecipe(r => ({ ...r, appleVarieties: [...r.appleVarieties, { id: nextAppleId, variety: '', lbs: '', costPerLb: '' }] }))
    setNextAppleId(n => n + 1)
  }
  const removeVariety = id => setRecipe(r => ({ ...r, appleVarieties: r.appleVarieties.filter(v => v.id !== id) }))

  // Adjunct helpers
  const updateAdjunct = (id, key, val) =>
    setRecipe(r => ({ ...r, adjuncts: r.adjuncts.map(a => a.id === id ? { ...a, [key]: val } : a) }))
  const addAdjunct = () => {
    setRecipe(r => ({ ...r, adjuncts: [...r.adjuncts, { id: nextAdjunctId, name: '', amount: '', unit: 'lbs', costPerUnit: '' }] }))
    setNextAdjunctId(n => n + 1)
  }
  const removeAdjunct = id => setRecipe(r => ({ ...r, adjuncts: r.adjuncts.filter(a => a.id !== id) }))

  const totalGallons = recipe.appleVarieties.reduce((s, v) => s + (parseFloat(v.gallons) || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch Info */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <h2 className="text-base font-semibold text-amber-400 mb-4">Batch Details</h2>
          <div className="space-y-3">
            <Field label="Batch Name" value={recipe.batchName} onChange={v => update('batchName', v)} />
            <Field label="Original Gravity (OG)" value={recipe.og} onChange={v => update('og', v)}
              type="number" step="0.001" min="1.000" note="e.g. 1.060" />
            <Field label="Final Specific Gravity (SG)" value={recipe.sg} onChange={v => update('sg', v)}
              type="number" step="0.001" min="1.000" note="e.g. 1.000 for fully dry" />
          </div>

          {/* Calculated totals */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-slate-700/50 rounded p-3 text-center">
              <div className="text-xl font-bold text-blue-400">{calc.gallons.toFixed(1)}</div>
              <div className="text-xs text-slate-400">Total Gallons</div>
              <div className="text-xs text-slate-500">sum of varieties</div>
            </div>
            <div className="bg-slate-700/50 rounded p-3 text-center">
              <div className="text-xl font-bold text-amber-400">{calc.abv}%</div>
              <div className="text-xs text-slate-400">Est. ABV</div>
              <div className="text-xs text-slate-500">(OG − SG) × 131.25</div>
            </div>
          </div>
        </div>

        {/* Apple Varieties */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-amber-400">Apple Varieties</h2>
            <button onClick={addVariety}
              className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-3 py-1 rounded">
              + Add Variety
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs border-b border-slate-700">
                  <th className="text-left pb-2">Variety</th>
                  <th className="text-right pb-2">Gallons</th>
                  <th className="text-right pb-2">% Blend</th>
                  <th className="text-right pb-2">$/gal</th>
                  <th className="text-right pb-2">Cost</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {recipe.appleVarieties.map(v => {
                  const pct = totalGallons > 0 ? ((parseFloat(v.gallons) || 0) / totalGallons * 100).toFixed(1) : '0.0'
                  const lineCost = (parseFloat(v.gallons) || 0) * (parseFloat(v.costPerGallon) || 0)
                  return (
                    <tr key={v.id} className="border-b border-slate-700/50">
                      <td className="py-1.5 pr-2">
                        <input value={v.variety} onChange={e => updateVariety(v.id, 'variety', e.target.value)}
                          placeholder="Variety name…"
                          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 outline-none focus:border-amber-400 w-full" />
                      </td>
                      <td className="py-1.5 pr-2">
                        <input type="number" min="0" step="1" value={v.gallons}
                          onChange={e => updateVariety(v.id, 'gallons', e.target.value)}
                          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 outline-none focus:border-amber-400 w-20 text-right" />
                      </td>
                      <td className="py-1.5 pr-2 text-right text-slate-300">{pct}%</td>
                      <td className="py-1.5 pr-2">
                        <div className="flex items-center bg-slate-700 border border-slate-600 rounded focus-within:border-amber-400">
                          <span className="pl-1.5 text-slate-400 text-xs">$</span>
                          <input type="number" min="0" step="0.01" value={v.costPerGallon}
                            onChange={e => updateVariety(v.id, 'costPerGallon', e.target.value)}
                            className="bg-transparent px-1 py-1 text-sm text-slate-100 outline-none w-16 text-right" />
                        </div>
                      </td>
                      <td className="py-1.5 pr-2 text-right text-slate-300">${lineCost.toFixed(2)}</td>
                      <td className="py-1.5">
                        <button onClick={() => removeVariety(v.id)}
                          className="text-slate-500 hover:text-red-400 text-lg leading-none px-1">×</button>
                      </td>
                    </tr>
                  )
                })}
                <tr className="text-slate-400 text-xs">
                  <td className="pt-2 font-medium">Total</td>
                  <td className="pt-2 text-right text-slate-300 font-medium">{totalGallons.toFixed(0)} gal</td>
                  <td className="pt-2 text-right text-slate-300">100%</td>
                  <td></td>
                  <td className="pt-2 text-right text-amber-400 font-semibold">${calc.appleCost.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Adjuncts */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-amber-400">Adjuncts & Additions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Fruit, hops, spices, or other additions — costs included in COGS</p>
          </div>
          <button onClick={addAdjunct}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-3 py-1 rounded">
            + Add Adjunct
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs border-b border-slate-700">
                <th className="text-left pb-2">Adjunct</th>
                <th className="text-right pb-2">Amount</th>
                <th className="text-left pb-2 pl-2">Unit</th>
                <th className="text-right pb-2">Cost / unit</th>
                <th className="text-right pb-2">Total Cost</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {(recipe.adjuncts || []).map(a => {
                const lineCost = (parseFloat(a.amount) || 0) * (parseFloat(a.costPerUnit) || 0)
                return (
                  <tr key={a.id} className="border-b border-slate-700/50">
                    <td className="py-1.5 pr-2">
                      <input value={a.name} onChange={e => updateAdjunct(a.id, 'name', e.target.value)}
                        placeholder="e.g. Acai, Hops, Ginger…"
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 outline-none focus:border-amber-400 w-full min-w-32" />
                    </td>
                    <td className="py-1.5 pr-2">
                      <input type="number" min="0" step="0.1" value={a.amount}
                        onChange={e => updateAdjunct(a.id, 'amount', e.target.value)}
                        placeholder="0"
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 outline-none focus:border-amber-400 w-20 text-right" />
                    </td>
                    <td className="py-1.5 pr-2 pl-2">
                      <select value={a.unit} onChange={e => updateAdjunct(a.id, 'unit', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 outline-none focus:border-amber-400">
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </td>
                    <td className="py-1.5 pr-2">
                      <div className="flex items-center bg-slate-700 border border-slate-600 rounded focus-within:border-amber-400 justify-end">
                        <span className="pl-1.5 text-slate-400 text-xs">$</span>
                        <input type="number" min="0" step="0.01" value={a.costPerUnit}
                          onChange={e => updateAdjunct(a.id, 'costPerUnit', e.target.value)}
                          placeholder="0.00"
                          className="bg-transparent px-1 py-1 text-sm text-slate-100 outline-none w-20 text-right" />
                      </div>
                    </td>
                    <td className="py-1.5 pr-2 text-right text-slate-300">${lineCost.toFixed(2)}</td>
                    <td className="py-1.5">
                      <button onClick={() => removeAdjunct(a.id)}
                        className="text-slate-500 hover:text-red-400 text-lg leading-none px-1">×</button>
                    </td>
                  </tr>
                )
              })}
              <tr className="text-xs">
                <td className="pt-2 text-slate-400 font-medium" colSpan={4}>Total Adjunct Cost</td>
                <td className="pt-2 text-right text-amber-400 font-semibold">${calc.adjunctCost.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Stats */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-base font-semibold text-amber-400 mb-4">Batch Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Est. ABV', value: `${calc.abv}%`, color: 'text-amber-400' },
            { label: 'Apple Cost', value: `$${calc.appleCost.toFixed(2)}`, color: 'text-red-400' },
            { label: 'Adjunct Cost', value: `$${calc.adjunctCost.toFixed(2)}`, color: 'text-red-400' },
            { label: 'COGS / Gallon', value: `$${calc.cogsPerGallon.toFixed(2)}`, color: 'text-red-400' },
            { label: 'Total Gallons', value: `${calc.gallons.toFixed(1)} gal`, color: 'text-blue-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-700/50 rounded p-3 text-center">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
