import { useState } from 'react'

const UNITS = ['gal', 'lbs', 'oz', 'kg', 'g', 'L', 'mL', 'fl oz', 'pails']

export default function FinalRecipe({ recipe, finalRecipe, setFinalRecipe, calc }) {
  const [nextId, setNextId] = useState(
    Math.max(0, ...(finalRecipe.items || []).map(i => i.id)) + 1
  )

  const setFinalGallons = val => setFinalRecipe(r => ({ ...r, finalGallons: val }))
  const updateItem = (id, key, val) =>
    setFinalRecipe(r => ({ ...r, items: r.items.map(i => i.id === id ? { ...i, [key]: val } : i) }))
  const addItem = () => {
    setFinalRecipe(r => ({ ...r, items: [...r.items, { id: nextId, name: '', amount: '', unit: 'lbs' }] }))
    setNextId(n => n + 1)
  }
  const removeItem = id => setFinalRecipe(r => ({ ...r, items: r.items.filter(i => i.id !== id) }))

  const orderedGallons = calc.gallons
  const finalGal = parseFloat(finalRecipe.finalGallons)
  const lossGal = finalGal > 0 ? orderedGallons - finalGal : null
  const lossPct = lossGal !== null && orderedGallons > 0
    ? ((lossGal / orderedGallons) * 100).toFixed(1)
    : null

  return (
    <div className="space-y-6">
      {/* Final Gallons */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <h2 className="text-base font-semibold text-amber-400 mb-4">Final Batch Gallons</h2>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="bg-slate-700/50 rounded p-4 text-center min-w-24">
            <div className="text-2xl font-bold text-slate-300">{orderedGallons.toFixed(0)}</div>
            <div className="text-xs text-slate-500 mt-1">Ordered gal</div>
          </div>
          <div className="text-slate-600 text-2xl">→</div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Final gallons (after loss)</label>
            <div className="flex items-center bg-slate-700 border border-slate-600 rounded focus-within:border-amber-400">
              <input
                type="number" min="0" step="1"
                value={finalRecipe.finalGallons}
                onChange={e => setFinalGallons(e.target.value)}
                placeholder={orderedGallons.toFixed(0)}
                className="bg-transparent px-3 py-2 text-lg text-slate-100 outline-none w-32 text-right font-bold"
              />
              <span className="pr-3 text-slate-400 text-sm">gal</span>
            </div>
            {lossGal !== null && (
              <p className="text-xs text-slate-500 mt-1">
                Loss: {lossGal.toFixed(1)} gal ({lossPct}%)
              </p>
            )}
          </div>
          {finalGal > 0 && (
            <div className="bg-slate-700/50 rounded p-4 text-center min-w-24">
              <div className="text-2xl font-bold text-amber-400">{finalGal.toFixed(0)}</div>
              <div className="text-xs text-slate-500 mt-1">Final gal</div>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Items */}
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-amber-400">Final Recipe</h2>
            <p className="text-xs text-slate-500 mt-0.5">Actual amounts used — as-dosed</p>
          </div>
          <button onClick={addItem}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-3 py-1 rounded">
            + Add Item
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-xs border-b border-slate-700">
              <th className="text-left pb-2">Item</th>
              <th className="text-right pb-2">Amount</th>
              <th className="text-left pb-2 pl-2">Unit</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {(finalRecipe.items || []).map(item => (
              <tr key={item.id} className="border-b border-slate-700/50">
                <td className="py-1.5 pr-2">
                  <input value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)}
                    placeholder="Item name…"
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 outline-none focus:border-amber-400 w-full" />
                </td>
                <td className="py-1.5 pr-2">
                  <input type="number" min="0" step="0.1" value={item.amount}
                    onChange={e => updateItem(item.id, 'amount', e.target.value)}
                    placeholder="0"
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 outline-none focus:border-amber-400 w-24 text-right" />
                </td>
                <td className="py-1.5 pr-2 pl-2">
                  <select value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 outline-none focus:border-amber-400">
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </td>
                <td className="py-1.5">
                  <button onClick={() => removeItem(item.id)}
                    className="text-slate-500 hover:text-red-400 text-lg leading-none px-1">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
