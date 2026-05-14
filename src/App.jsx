import { useState, useMemo } from 'react'
import './App.css'
import BatchRecipe from './components/BatchRecipe'
import CostTracking from './components/CostTracking'
import DistributionPricing from './components/DistributionPricing'
import MixSlider from './components/MixSlider'

export const CASE_GAL = 3.0    // 24 × 16oz cans
export const SIXTH_GAL = 5.16  // 1/6 barrel
export const HALF_GAL = 15.5   // 1/2 barrel

export const INITIAL_RECIPE = {
  batchName: 'Acai Yuzu',
  totalGallons: 426,
  og: '1.060',
  sg: '1.000',
  appleVarieties: [
    { id: 1, variety: 'Cullinary', lbs: 320, costPerLb: 3.17 },
    { id: 2, variety: 'Heirloom', lbs: 106, costPerLb: 6.50 },
  ],
  adjuncts: [
    { id: 1, name: 'Acai', amount: '', unit: 'lbs', costPerUnit: '' },
    { id: 2, name: 'Yuzu', amount: '', unit: 'lbs', costPerUnit: '' },
  ],
}

// Costs structured to match canning invoices — all per-case, lump sums, or per-gallon
export const INITIAL_COSTS = {
  // Manufacturing / production (lump sum per batch)
  manufacturing: 4500.00,

  // Canning packaging — charged per case (24 × 16oz)
  fillServicePerCase: 6.33,
  cansPerCase: 4.56,        // 16oz Standard Brite Can
  endsPerCase: 1.00,        // Crown LOE 10-State ends/lids
  pakTechPerCase: 0.95,     // PakTech 4-pack holders
  traysPerCase: 0.45,       // Trays

  // Labels (lump sum)
  labelsLumpSum: 185.00,

  // Canning labor
  canningLaborRate: 80.00,
  canningLaborHours: 2.5,

  // Services (per gallon)
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
  casePTW: 28.00,
  casePTR: 38.00,
  sixthPTW: 65.00,
  sixthPTR: 85.00,
  halfPTW: 155.00,
  halfPTR: 195.00,
}

const STORAGE_KEY = 'pinball-cider-batches'

function loadSavedBatches() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

export function calcBatch(recipe, costs, pricing, mix) {
  const gallons = parseFloat(recipe.totalGallons) || 0
  const og = parseFloat(recipe.og) || 1.0
  const sg = parseFloat(recipe.sg) || 1.0
  const abv = ((og - sg) * 131.25).toFixed(1)

  const appleCost = recipe.appleVarieties.reduce(
    (sum, v) => sum + (parseFloat(v.lbs) || 0) * (parseFloat(v.costPerLb) || 0), 0
  )
  const adjunctCost = (recipe.adjuncts || []).reduce(
    (sum, a) => sum + (parseFloat(a.amount) || 0) * (parseFloat(a.costPerUnit) || 0), 0
  )

  const canningLaborCost = costs.canningLaborRate * costs.canningLaborHours

  // Lump-sum costs allocated proportionally by gallon across all formats
  const lumpSumCosts = costs.manufacturing + costs.labelsLumpSum + costs.coldStorage +
    costs.stateExciseTax + costs.ttbTax
  const totalAllocatedBase = appleCost + adjunctCost + canningLaborCost + lumpSumCosts
  const allocatedPerGal = gallons > 0 ? totalAllocatedBase / gallons : 0

  // Per-gallon variable services
  const velcorinPerGal = costs.velcorinPerGal

  // Combined per-gallon rate (allocated + variable)
  const totalPerGal = allocatedPerGal + velcorinPerGal

  // Direct per-case packaging cost
  const canningCostPerCase = costs.fillServicePerCase + costs.cansPerCase +
    costs.endsPerCase + costs.pakTechPerCase + costs.traysPerCase

  const caseGallons = gallons * (mix.casePct / 100)
  const sixthGallons = gallons * (mix.sixthPct / 100)
  const halfGallons = gallons * (mix.halfPct / 100)

  const caseCount = Math.floor(caseGallons / CASE_GAL)
  const sixthCount = Math.floor(sixthGallons / SIXTH_GAL)
  const halfCount = Math.floor(halfGallons / HALF_GAL)

  const cogsPerCase = totalPerGal * CASE_GAL + canningCostPerCase
  const cogsPerSixth = totalPerGal * SIXTH_GAL + costs.sixthBblCost
  const cogsPerHalf = totalPerGal * HALF_GAL + costs.halfBblCost

  const directPackaging = caseCount * canningCostPerCase +
    sixthCount * costs.sixthBblCost + halfCount * costs.halfBblCost
  const velcorinTotal = velcorinPerGal * gallons
  const totalCOGS = totalAllocatedBase + velcorinTotal + directPackaging

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
    abv, appleCost, adjunctCost, canningLaborCost, lumpSumCosts,
    totalAllocatedBase, allocatedPerGal, velcorinTotal,
    canningCostPerCase, directPackaging, totalCOGS,
    cogsPerGallon: totalPerGal, cogsPerCase, cogsPerSixth, cogsPerHalf,
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
  const [mix, setMix] = useState({ casePct: 60, sixthPct: 25, halfPct: 15 })
  const [activeTab, setActiveTab] = useState('recipe')
  const [savedBatches, setSavedBatches] = useState(loadSavedBatches)
  const [loadMenuOpen, setLoadMenuOpen] = useState(false)
  const [saveFlash, setSaveFlash] = useState(false)

  const calc = useMemo(() => calcBatch(recipe, costs, pricing, mix), [recipe, costs, pricing, mix])

  const saveBatch = () => {
    const updated = { ...savedBatches, [recipe.batchName]: { recipe, costs, pricing, mix } }
    setSavedBatches(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSaveFlash(true)
    setTimeout(() => setSaveFlash(false), 1500)
  }

  const loadBatch = (name) => {
    const b = savedBatches[name]
    if (!b) return
    setRecipe(b.recipe)
    setCosts(b.costs)
    setPricing(b.pricing)
    setMix(b.mix)
    setLoadMenuOpen(false)
  }

  const deleteBatch = (name, e) => {
    e.stopPropagation()
    const updated = { ...savedBatches }
    delete updated[name]
    setSavedBatches(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const tabs = [
    { id: 'recipe', label: '🍎 Batch Recipe' },
    { id: 'costs', label: '💰 Cost Tracking' },
    { id: 'pricing', label: '🏷️ Pricing' },
    { id: 'mix', label: '📊 Mix & Profit' },
  ]

  const savedNames = Object.keys(savedBatches)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-700 bg-slate-800/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div>
              <h1 className="text-xl font-bold text-amber-400 leading-tight">🍺 Pinball Cider</h1>
              <p className="text-slate-400 text-xs truncate">Batch Calculator — {recipe.batchName}</p>
            </div>
            {/* Save / Load */}
            <div className="flex items-center gap-2">
              <button
                onClick={saveBatch}
                className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                  saveFlash ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {saveFlash ? '✓ Saved' : '💾 Save'}
              </button>
              <div className="relative">
                <button
                  onClick={() => setLoadMenuOpen(o => !o)}
                  className="text-xs px-3 py-1.5 rounded font-medium bg-slate-700 hover:bg-slate-600 text-slate-300"
                >
                  📂 Load {savedNames.length > 0 && <span className="ml-1 text-amber-400">({savedNames.length})</span>}
                </button>
                {loadMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 min-w-48">
                    {savedNames.length === 0 ? (
                      <p className="text-slate-400 text-xs px-3 py-2">No saved batches yet</p>
                    ) : savedNames.map(name => (
                      <div key={name} className="flex items-center justify-between hover:bg-slate-700 px-3 py-2 cursor-pointer group"
                        onClick={() => loadBatch(name)}>
                        <span className="text-sm text-slate-200">{name}</span>
                        <button onClick={(e) => deleteBatch(name, e)}
                          className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 ml-2 text-lg leading-none">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 text-center flex-shrink-0">
            <div>
              <div className="text-sm font-bold text-red-400">${calc.totalCOGS.toFixed(0)}</div>
              <div className="text-slate-500 text-xs">COGS</div>
            </div>
            <div>
              <div className="text-sm font-bold text-blue-400">${calc.totalRevenuePTW.toFixed(0)}</div>
              <div className="text-slate-500 text-xs">Revenue</div>
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-400">${calc.totalProfitPTW.toFixed(0)}</div>
              <div className="text-slate-500 text-xs">Profit</div>
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-400">{calc.grossMarginPct}%</div>
              <div className="text-slate-500 text-xs">Margin</div>
            </div>
          </div>
        </div>
      </header>

      {loadMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setLoadMenuOpen(false)} />
      )}

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex border-b border-slate-700 mt-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === 'recipe' && (
            <BatchRecipe recipe={recipe} setRecipe={setRecipe} calc={calc} />
          )}
          {activeTab === 'costs' && (
            <CostTracking costs={costs} setCosts={setCosts} calc={calc} />
          )}
          {activeTab === 'pricing' && (
            <DistributionPricing pricing={pricing} setPricing={setPricing} calc={calc} />
          )}
          {activeTab === 'mix' && (
            <MixSlider mix={mix} setMix={setMix} pricing={pricing} calc={calc} recipe={recipe} />
          )}
        </div>
      </div>
    </div>
  )
}
