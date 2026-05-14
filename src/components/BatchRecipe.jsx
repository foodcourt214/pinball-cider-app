import { useState } from 'react'

function Field({ label, value, onChange, type = 'text', step, min, prefix, suffix }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <div className="flex items-center bg-slate-700 rounded border border-slate-600 focus-within:border-amber-400">
        {prefix && <span className="pl-2 text-slate-400 text-sm">{prefix}</span>}
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
    </div>
  )
}

export default function BatchRecipe({ recipe, setRecipe, calc }) {
  const [nextId, setNextId] = useState(3)

  const update = (key, val) => setRecipe(r => ({ ...r, [key]: val }))

  const updateVariety = (id, key, val) => {
    setRecipe(r => ({
      ...r,
      appleVarieties: r.appleVarieties.map(v => v.id === id ? { ...v, [key]: val } : v),
    }))
  }

  const addVariety = () => {
    setRecipe(r => ({
      ...r,
      appleVarieties: [...r.appleVarieties, { id: nextId, variety: '', lbs: 0, costPerLb: 0 }],
    }))
    setNextId(n => n + 1)
  }

  const removeVariety = (id) => {
    setRecipe(r => ({
      ...r,
      appleVarieties: r.appleVarieties.filter(v => v.id !== id),
    }))
  }

  const totalLbs = recipe.appleVarieties.reduce((s, v) => s + (parseFloat(v.lbs) || 0), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Batch Info */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-base font-semibold text-amber-400 mb-4">Batch Details</h2>
        <div className="space-y-3">
          <Field label="Batch Name" value={recipe.batchName} onChange={v => update('batchName', v)} />
          <Field label="Total Gallons" value={recipe.totalGallons} onChange={v => update('totalGallons', v)}
            type="number" step="0.5" min="0" suffix="gal" />
          <Field label="Original Gravity (OG)" value={recipe.og} onChange={v => update('og', v)}
            type="number" step="0.001" min="1.000" />
          <Field label="Final Gravity (FG)" value={recipe.fg} onChange={v => update('fg', v)}
            type="number" step="0.001" min="1.000" />
        </div>
      </div>

      {/* Apple Varieties */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-amber-400">Apple Varieties</h2>
          <button
            onClick={addVariety}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-3 py-1 rounded"
          >
            + Add Variety
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs border-b border-slate-700">
                <th className="text-left pb-2">Variety</th>
                <th className="text-right pb-2">Lbs</th>
                <th className="text-right pb-2">% of Blend</th>
                <th className="text-right pb-2">$/lb</th>
                <th className="text-right pb-2">Cost</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {recipe.appleVarieties.map(v => {
                const pct = totalLbs > 0 ? ((parseFloat(v.lbs) || 0) / totalLbs * 100).toFixed(1) : '0.0'
                const lineCost = (parseFloat(v.lbs) || 0) * (parseFloat(v.costPerLb) || 0)
                return (
                  <tr key={v.id} className="border-b border-slate-700/50">
                    <td className="py-1.5 pr-2">
                      <input
                        value={v.variety}
                        onChange={e => updateVariety(v.id, 'variety', e.target.value)}
                        placeholder="Apple variety..."
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 outline-none focus:border-amber-400 w-full"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        type="number" min="0" step="1"
                        value={v.lbs}
                        onChange={e => updateVariety(v.id, 'lbs', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 outline-none focus:border-amber-400 w-20 text-right"
                      />
                    </td>
                    <td className="py-1.5 pr-2 text-right text-slate-300">{pct}%</td>
                    <td className="py-1.5 pr-2">
                      <div className="flex items-center bg-slate-700 border border-slate-600 rounded focus-within:border-amber-400">
                        <span className="pl-1.5 text-slate-400 text-xs">$</span>
                        <input
                          type="number" min="0" step="0.01"
                          value={v.costPerLb}
                          onChange={e => updateVariety(v.id, 'costPerLb', e.target.value)}
                          className="bg-transparent px-1 py-1 text-sm text-slate-100 outline-none w-16 text-right"
                        />
                      </div>
                    </td>
                    <td className="py-1.5 pr-2 text-right text-slate-300">${lineCost.toFixed(2)}</td>
                    <td className="py-1.5">
                      <button
                        onClick={() => removeVariety(v.id)}
                        className="text-slate-500 hover:text-red-400 text-lg leading-none px-1"
                      >×</button>
                    </td>
                  </tr>
                )
              })}
              <tr className="text-slate-400 text-xs">
                <td className="pt-2 font-medium">Total</td>
                <td className="pt-2 text-right text-slate-300 font-medium">{totalLbs.toFixed(0)} lbs</td>
                <td className="pt-2 text-right text-slate-300">100%</td>
                <td></td>
                <td className="pt-2 text-right text-amber-400 font-semibold">${calc.appleCost.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Derived Stats */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 lg:col-span-3">
        <h2 className="text-base font-semibold text-amber-400 mb-4">Batch Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Est. ABV', value: `${calc.abv}%`, color: 'text-amber-400' },
            { label: 'Apple Cost', value: `$${calc.appleCost.toFixed(2)}`, color: 'text-red-400' },
            { label: 'Cost / Gallon', value: `$${calc.cogsPerGallon.toFixed(2)}`, color: 'text-red-400' },
            { label: 'Total Gallons', value: `${recipe.totalGallons} gal`, color: 'text-blue-400' },
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
