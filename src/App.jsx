import { useState, useMemo, useEffect, useRef } from 'react'
import './App.css'
import BatchRecipe from './components/BatchRecipe'
import FinalRecipe from './components/FinalRecipe'
import CostTracking from './components/CostTracking'
import DistributionPricing from './components/DistributionPricing'
import MixSlider from './components/MixSlider'

export const CASE_GAL = 3.0    // 24 × 16oz cans
export const SIXTH_GAL = 5.16  // 1/6 barrel
export const HALF_GAL = 15.5   // 1/2 barrel

export const INITIAL_RECIPE = {
  batchName: 'Acai Yuzu',
  og: '1.060',
  sg: '1.000',
  appleVarieties: [
    { id: 1, variety: 'Cullinary', gallons: 320, costPerGallon: 3.17, shipping: '' },
    { id: 2, variety: 'Heirloom', gallons: 106, costPerGallon: 6.50, shipping: '' },
  ],
  adjuncts: [
    { id: 1, name: 'Acai', amount: '', unit: 'lbs', costPerUnit: '', shipping: '' },
    { id: 2, name: 'Yuzu', amount: '', unit: 'lbs', costPerUnit: '', shipping: '' },
  ],
}

export const INITIAL_FINAL_RECIPE = {
  finalGallons: '',
  items: [],
}

// Costs structured to match canning invoices
export const INITIAL_COSTS = {
  // Canning packaging — charged per case (24 × 16oz)
  fillServicePerCase: 6.33,
  cansPerCase: 4.56,        // 16oz Standard Brite Can
  endsPerCase: 1.00,        // Crown LOE 10-State ends/lids
  pakTechPerCase: 0.95,     // PakTech 4-pack holders
  traysPerCase: 0.45,       // Trays

  // Labels — auto-calculated from can count ($/1000 labels from Northwest Label invoice)
  labelCostPerM: 247.96,    // $247.96 per M (per 1000 cans) — $595.10 / 2,400 labels

  // Canning labor (lump sum, allocated to canned gallons only)
  canningLaborRate: 80.00,
  canningLaborHours: 2.5,

  // Contract producer fee (per canned gallon only)
  contractFeePerGal: 3.23,

  // Velcorin (per canned gallon only — not applied to kegs)
  velcorinPerGal: 1.05,

  // Keg costs (all-in: fill + cleaning + storage per keg)
  halfBblCost: 60.00,
  sixthBblCost: 22.00,

  // Cold storage (lump sum)
  coldStorage: 400.00,

  // Taxes (lump sum — update from filings)
  stateExciseTax: 186.00,
  ttbTax: 210.30,
}

export const INITIAL_PRICING = {
  casePTW: 58.00,
  casePTR: 84.00,
  sixthPTW: 84.00,
  sixthPTR: 120.00,
  halfPTW: 175.00,
  halfPTR: 250.00,
}

const STORAGE_KEY = 'pinball-cider-batches'

function loadSavedBatches() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

export function calcBatch(recipe, costs, pricing, mix, finalGallons = '') {
  const gallons = recipe.appleVarieties.reduce((s, v) => s + (parseFloat(v.gallons) || 0), 0)
  const og = parseFloat(recipe.og) || 1.0
  const sg = parseFloat(recipe.sg) || 1.0
  const abv = ((og - sg) * 131.25).toFixed(1)

  const appleCost = recipe.appleVarieties.reduce(
    (sum, v) => sum + (parseFloat(v.gallons) || 0) * (parseFloat(v.costPerGallon) || 0), 0
  )
  const appleShipping = recipe.appleVarieties.reduce(
    (sum, v) => sum + (parseFloat(v.shipping) || 0), 0
  )
  const adjunctCost = (recipe.adjuncts || []).reduce(
    (sum, a) => sum + (parseFloat(a.amount) || 0) * (parseFloat(a.costPerUnit) || 0), 0
  )
  const adjunctShipping = (recipe.adjuncts || []).reduce(
    (sum, a) => sum + (parseFloat(a.shipping) || 0), 0
  )
  const totalShipping = appleShipping + adjunctShipping

  const packagingGallons = parseFloat(finalGallons) > 0 ? parseFloat(finalGallons) : gallons
  const caseGallons = packagingGallons * (mix.casePct / 100)
  const sixthGallons = packagingGallons * (mix.sixthPct / 100)
  const halfGallons = packagingGallons * (mix.halfPct / 100)

  const caseCount = Math.floor(caseGallons / CASE_GAL)
  const sixthCount = Math.floor(sixthGallons / SIXTH_GAL)
  const halfCount = Math.floor(halfGallons / HALF_GAL)

  const totalCanCount = caseCount * 24

  // Canning labor (lump sum) — allocated only to canned gallons
  const canningLaborCost = costs.canningLaborRate * costs.canningLaborHours
  const canningLaborPerGal = caseGallons > 0 ? canningLaborCost / caseGallons : 0

  // Contract producer fee — per canned gallon only
  const contractFeeTotal = costs.contractFeePerGal * caseGallons

  // Velcorin — per canned gallon only
  const velcorinTotal = costs.velcorinPerGal * caseGallons

  // Labels — auto-calculated from total can count ($X per 1000 cans)
  const labelCostTotal = totalCanCount * (costs.labelCostPerM / 1000)
  const labelCostPerCase = 24 * (costs.labelCostPerM / 1000)

  // Batch-wide lump sums allocated per total gallon (applied to ALL formats)
  const batchLumpSums = costs.coldStorage + costs.stateExciseTax + costs.ttbTax
  const totalBatchFixed = appleCost + appleShipping + adjunctCost + adjunctShipping + batchLumpSums
  const batchFixedPerGal = gallons > 0 ? totalBatchFixed / gallons : 0

  // Canning-only per-gallon cost (labor + velcorin + contract fee)
  const canningOnlyPerGal = canningLaborPerGal + costs.velcorinPerGal + costs.contractFeePerGal

  // Per-case direct packaging (all can/canning costs, labels included)
  const canningCostPerCase = costs.fillServicePerCase + costs.cansPerCase +
    costs.endsPerCase + costs.pakTechPerCase + costs.traysPerCase + labelCostPerCase

  // COGS per unit — kegs only get batch-fixed allocation, no canning costs
  const cogsPerCase = (batchFixedPerGal + canningOnlyPerGal) * CASE_GAL + canningCostPerCase
  const cogsPerSixth = batchFixedPerGal * SIXTH_GAL + costs.sixthBblCost
  const cogsPerHalf = batchFixedPerGal * HALF_GAL + costs.halfBblCost

  const directCaseCost = caseCount * canningCostPerCase
  const directKegCost = sixthCount * costs.sixthBblCost + halfCount * costs.halfBblCost
  const totalCOGS = totalBatchFixed + canningLaborCost + contractFeeTotal + velcorinTotal +
    directCaseCost + directKegCost

  const fmt = (count, cogs, ptw, ptr) => ({
    ptw: count * ptw - count * cogs,
    ptr: count * ptr - count * cogs,
    revenuePTW: count * ptw,
    revenuePTR: count * ptr,
    cogsTotal: count * cogs,
  })

  const caseProfit = fmt(caseCount, cogsPerCase, pricing.casePTW, pricing.casePTR)
  const sixthProfit = fmt(sixthCount, cogsPerSixth, pricing.sixthPTW, pricing.sixthPTR)
  const halfProfit = fmt(halfCount, cogsPerHalf, pricing.halfPTW, pricing.halfPTR)

  const totalRevenuePTW = caseProfit.revenuePTW + sixthProfit.revenuePTW + halfProfit.revenuePTW
  const totalRevenuePTR = caseProfit.revenuePTR + sixthProfit.revenuePTR + halfProfit.revenuePTR
  const totalProfitPTW = caseProfit.ptw + sixthProfit.ptw + halfProfit.ptw
  const totalProfitPTR = caseProfit.ptr + sixthProfit.ptr + halfProfit.ptr
  const grossMarginPct = totalRevenuePTW > 0 ? ((totalProfitPTW / totalRevenuePTW) * 100).toFixed(1) : 0

  return {
    abv, appleCost, appleShipping, adjunctCost, adjunctShipping, totalShipping,
    canningLaborCost, contractFeeTotal, velcorinTotal,
    labelCostTotal, labelCostPerCase, totalCanCount,
    batchLumpSums, totalBatchFixed, batchFixedPerGal,
    canningOnlyPerGal, canningCostPerCase,
    directCaseCost, directKegCost, totalCOGS,
    gallons, packagingGallons,
    cogsPerGallon: batchFixedPerGal, cogsPerCase, cogsPerSixth, cogsPerHalf,
    caseCount, sixthCount, halfCount,
    caseGallons, sixthGallons, halfGallons,
    caseProfit, sixthProfit, halfProfit,
    totalRevenuePTW, totalRevenuePTR,
    totalProfitPTW, totalProfitPTR,
    grossMarginPct,
    CASE_GAL, SIXTH_GAL, HALF_GAL,
  }
}

export default function App() {
  const [recipe, setRecipe] = useState(INITIAL_RECIPE)
  const [costs, setCosts] = useState(INITIAL_COSTS)
  const [pricing, setPricing] = useState(INITIAL_PRICING)
  const [mix, setMix] = useState({ casePct: 60, sixthPct: 25, halfPct: 15, finalGallonsOverride: null })
  const [finalRecipe, setFinalRecipe] = useState(() => ({
    finalGallons: '',
    items: INITIAL_RECIPE.adjuncts.map((a, i) => ({ id: i + 1, name: a.name, amount: '', unit: a.unit })),
  }))
  const [channelMix, setChannelMix] = useState({ casePtwPct: 70, sixthPtwPct: 60, halfPtwPct: 50 })
  const [activeTab, setActiveTab] = useState('recipe')
  const [savedBatches, setSavedBatches] = useState(loadSavedBatches)
  const [loadMenuOpen, setLoadMenuOpen] = useState(false)
  const [saveFlash, setSaveFlash] = useState(false)
  const [logoOk, setLogoOk] = useState(true)
  const loadMenuRef = useRef(null)
  const nameInputRef = useRef(null)

  useEffect(() => {
    if (!loadMenuOpen) return
    const handler = (e) => {
      if (loadMenuRef.current && !loadMenuRef.current.contains(e.target)) {
        setLoadMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [loadMenuOpen])

  const orderedGallons = useMemo(
    () => recipe.appleVarieties.reduce((s, v) => s + (parseFloat(v.gallons) || 0), 0),
    [recipe]
  )

  const finalGallonsTotal = useMemo(() => {
    const adjGal = (finalRecipe.items || [])
      .filter(i => i.unit === 'gal')
      .reduce((s, i) => s + (parseFloat(i.amount) || 0), 0)
    const hasJuice = parseFloat(finalRecipe.finalGallons) > 0
    const juiceBase = hasJuice ? parseFloat(finalRecipe.finalGallons) : orderedGallons
    if (!hasJuice && adjGal === 0) return 0  // nothing entered — fall back to ordered in calcBatch
    return juiceBase + adjGal
  }, [finalRecipe, orderedGallons])

  // What the Final Recipe tab arrives at — the starting value shown in Mix & Profit
  const recipeFinalGallons = finalGallonsTotal > 0 ? finalGallonsTotal : orderedGallons

  // Mix & Profit can override it for extra loss discovered at packaging
  const overrideGallons = parseFloat(mix.finalGallonsOverride)
  const packagingGallons = overrideGallons > 0 ? overrideGallons : finalGallonsTotal

  const calc = useMemo(() => calcBatch(recipe, costs, pricing, mix, packagingGallons), [recipe, costs, pricing, mix, packagingGallons])

  // Blended revenue/profit based on PTW/PTR channel split
  const blended = useMemo(() => {
    const blend = (count, cogsTotal, ptw, ptr, ptwPct) => {
      const ptwCount = Math.round(count * (ptwPct / 100))
      const ptrCount = count - ptwCount
      const revenue = ptwCount * ptw + ptrCount * ptr
      const profit = revenue - cogsTotal
      const margin = revenue > 0 ? (profit / revenue * 100).toFixed(1) : 0
      return { ptwCount, ptrCount, revenue, profit, margin }
    }
    const c = blend(calc.caseCount, calc.caseProfit.cogsTotal, pricing.casePTW, pricing.casePTR, channelMix.casePtwPct)
    const s = blend(calc.sixthCount, calc.sixthProfit.cogsTotal, pricing.sixthPTW, pricing.sixthPTR, channelMix.sixthPtwPct)
    const h = blend(calc.halfCount, calc.halfProfit.cogsTotal, pricing.halfPTW, pricing.halfPTR, channelMix.halfPtwPct)
    const totalRevenue = c.revenue + s.revenue + h.revenue
    const totalProfit = totalRevenue - calc.totalCOGS
    const totalMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100).toFixed(1) : 0
    return { case: c, sixth: s, half: h, totalRevenue, totalProfit, totalMargin }
  }, [calc, channelMix, pricing])

  // New batch — clears the recipe but keeps costs and pricing, which carry between batches
  const newBatch = () => {
    if (!window.confirm('Start a new batch? Unsaved changes to the current one will be lost.\n\nCost Tracking and Pricing are kept.')) return
    setRecipe({
      batchName: '',
      og: '1.060',
      sg: '1.000',
      appleVarieties: [{ id: 1, variety: '', gallons: '', costPerGallon: '', shipping: '' }],
      adjuncts: [{ id: 1, name: '', amount: '', unit: 'lbs', costPerUnit: '', shipping: '' }],
    })
    setFinalRecipe({ finalGallons: '', items: [] })
    setMix(m => ({ ...m, finalGallonsOverride: null }))
    setActiveTab('recipe')
    setLoadMenuOpen(false)
    requestAnimationFrame(() => nameInputRef.current?.focus())
  }

  const saveBatch = () => {
    if (!recipe.batchName.trim()) {
      alert('Give the batch a name before saving.')
      nameInputRef.current?.focus()
      return
    }
    const updated = { ...savedBatches, [recipe.batchName]: { recipe, costs, pricing, mix, channelMix, finalRecipe } }
    setSavedBatches(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSaveFlash(true)
    setTimeout(() => setSaveFlash(false), 1500)
  }

  const loadBatch = (name) => {
    const b = savedBatches[name]
    if (!b) return
    // Migrate old batches missing shipping fields
    const recipe = {
      ...b.recipe,
      appleVarieties: (b.recipe.appleVarieties || []).map(v => ({ shipping: '', ...v })),
      adjuncts: (b.recipe.adjuncts || []).map(a => ({ shipping: '', ...a })),
    }
    setRecipe(recipe)
    setCosts(b.costs)
    setPricing(b.pricing)
    setMix({ casePct: 60, sixthPct: 25, halfPct: 15, finalGallonsOverride: null, ...(b.mix || {}) })
    setFinalRecipe(b.finalRecipe || {
      finalGallons: b.mix?.finalGallons || '',
      items: (b.recipe.adjuncts || []).map((a, i) => ({ id: i + 1, name: a.name, amount: '', unit: a.unit })),
    })
    if (b.channelMix) setChannelMix(b.channelMix)
    setLoadMenuOpen(false)
  }

  const deleteBatch = (name, e) => {
    e.stopPropagation()
    e.preventDefault()
    const updated = { ...savedBatches }
    delete updated[name]
    setSavedBatches(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const tabs = [
    { id: 'recipe', label: '🍎 Batch' },
    { id: 'final', label: '📋 Final Recipe' },
    { id: 'costs', label: '💰 Cost Tracking' },
    { id: 'pricing', label: '🏷️ Pricing' },
    { id: 'mix', label: '📊 Mix & Profit' },
  ]

  const savedNames = Object.keys(savedBatches)

  const exportBatches = () => {
    const json = JSON.stringify(savedBatches, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pinball-cider-batches.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importBatches = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result)
        const merged = { ...savedBatches, ...imported }
        setSavedBatches(merged)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        alert(`Imported ${Object.keys(imported).length} batch(es).`)
      } catch {
        alert('Invalid file — could not import.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-700 bg-slate-800/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4">
          {/* Logo — public/logo.png, falls back to the wordmark if absent */}
          {logoOk ? (
            <img src="/logo.png" alt="Pinball Cider" onError={() => setLogoOk(false)}
              className="h-10 w-auto flex-shrink-0" />
          ) : (
            <h1 className="text-lg font-bold text-amber-400 leading-tight flex-shrink-0">🍺 Pinball Cider</h1>
          )}

          {/* Save / Load / Export / Import */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={newBatch}
              className="text-xs px-3 py-1.5 rounded font-medium bg-slate-700 hover:bg-slate-600 text-slate-300"
              title="Start a new batch (keeps Cost Tracking and Pricing)"
            >
              ➕ New
            </button>
            <button
              onClick={saveBatch}
              className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                saveFlash ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {saveFlash ? '✓ Saved' : '💾 Save'}
            </button>
            <div className="relative" ref={loadMenuRef}>
              <button
                onClick={() => setLoadMenuOpen(o => !o)}
                className="text-xs px-3 py-1.5 rounded font-medium bg-slate-700 hover:bg-slate-600 text-slate-300"
              >
                📂 Load {savedNames.length > 0 && <span className="ml-1 text-amber-400">({savedNames.length})</span>}
              </button>
              {loadMenuOpen && (
                <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 min-w-52">
                  {savedNames.length === 0 ? (
                    <p className="text-slate-400 text-xs px-3 py-2">No saved batches yet</p>
                  ) : savedNames.map(name => (
                    <div key={name} className="flex items-center justify-between hover:bg-slate-700 px-3 py-2 cursor-pointer"
                      onMouseDown={() => loadBatch(name)}>
                      <span className="text-sm text-slate-200 truncate">{name}</span>
                      <button
                        onMouseDown={e => { e.stopPropagation(); deleteBatch(name, e) }}
                        className="ml-3 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:bg-red-500 hover:text-white text-sm font-bold transition-colors"
                        title="Delete"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={exportBatches}
              className="text-xs px-3 py-1.5 rounded font-medium bg-slate-700 hover:bg-slate-600 text-slate-300"
              title="Download all saved batches as JSON">
              ⬇ Export
            </button>
            <label className="text-xs px-3 py-1.5 rounded font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer"
              title="Import batches from JSON file">
              ⬆ Import
              <input type="file" accept=".json" onChange={importBatches} className="hidden" />
            </label>
          </div>

          <div className="ml-auto flex gap-4 text-center flex-shrink-0">
            <div>
              <div className="text-sm font-bold text-red-400">${calc.totalCOGS.toFixed(0)}</div>
              <div className="text-slate-500 text-xs">COGS</div>
            </div>
            <div>
              <div className="text-sm font-bold text-blue-400">${blended.totalRevenue.toFixed(0)}</div>
              <div className="text-slate-500 text-xs">Revenue</div>
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-400">${blended.totalProfit.toFixed(0)}</div>
              <div className="text-slate-500 text-xs">Profit</div>
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-400">{blended.totalMargin}%</div>
              <div className="text-slate-500 text-xs">Margin</div>
            </div>
          </div>
        </div>

        {/* Batch name + tabs */}
        <div className="max-w-6xl mx-auto px-4 h-11 flex items-center gap-3">
          <input
            ref={nameInputRef}
            value={recipe.batchName}
            onChange={e => setRecipe(r => ({ ...r, batchName: e.target.value }))}
            placeholder="Name this batch…"
            size={Math.max(14, Math.min(34, (recipe.batchName || '').length + 2))}
            title="Batch name — click to edit"
            className="px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-base font-bold tracking-wide
              outline-none transition-colors hover:bg-amber-500/25 focus:border-amber-400 focus:bg-amber-500/25
              placeholder:text-amber-300/40 placeholder:font-normal flex-shrink-0 max-w-sm"
          />

          <nav className="flex items-center h-full flex-1 min-w-0 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-full px-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-amber-400'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        <div className="py-6">
          {activeTab === 'recipe' && (
            <BatchRecipe recipe={recipe} setRecipe={setRecipe} calc={calc} />
          )}
          {activeTab === 'final' && (
            <FinalRecipe recipe={recipe} finalRecipe={finalRecipe} setFinalRecipe={setFinalRecipe} calc={calc} />
          )}
          {activeTab === 'costs' && (
            <CostTracking costs={costs} setCosts={setCosts} calc={calc} />
          )}
          {activeTab === 'pricing' && (
            <DistributionPricing pricing={pricing} setPricing={setPricing} calc={calc} />
          )}
          {activeTab === 'mix' && (
            <MixSlider mix={mix} setMix={setMix} channelMix={channelMix} setChannelMix={setChannelMix}
              pricing={pricing} calc={calc} recipe={recipe} blended={blended}
              recipeFinalGallons={recipeFinalGallons} />
          )}
        </div>
      </div>
    </div>
  )
}
