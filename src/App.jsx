import { useState, useMemo } from 'react'
import './App.css'
import BatchRecipe from './components/BatchRecipe'
import CostTracking from './components/CostTracking'
import DistributionPricing from './components/DistributionPricing'
import MixSlider from './components/MixSlider'

const CASE_GAL = 2.25    // 24 x 12oz cans
const SIXTH_GAL = 5.16   // 1/6 barrel
const HALF_GAL = 15.5    // 1/2 barrel

export const INITIAL_RECIPE = {
  batchName: 'Batch #1',
  totalGallons: 31,
  og: '1.060',
  fg: '1.008',
  appleVarieties: [
    { id: 1, variety: 'Honeycrisp', lbs: 120, costPerLb: 0.55 },
    { id: 2, variety: 'Gravenstein', lbs: 80, costPerLb: 0.40 },
  ],
}

export const INITIAL_COSTS = {
  yeast: 12.00,
  nutrients: 8.00,
  sulfites: 5.00,
  adjuncts: 0.00,
  canCost: 0.18,
  lidCost: 0.04,
  labelCost: 0.08,
  sleeveBoxCost: 1.20,
  kegRental16: 8.00,
  kegRental12: 15.00,
  laborHours: 8,
  laborRate: 22.00,
  utilities: 45.00,
  sanitation: 15.00,
  misc: 20.00,
}

export const INITIAL_PRICING = {
  casePTW: 28.00,
  casePTR: 38.00,
  caseSRP: 48.00,
  sixthPTW: 65.00,
  sixthPTR: 85.00,
  sixthSRP: 100.00,
  halfPTW: 155.00,
  halfPTR: 195.00,
  halfSRP: 240.00,
}

export function calcBatch(recipe, costs, pricing, mix) {
  const gallons = parseFloat(recipe.totalGallons) || 0
  const og = parseFloat(recipe.og) || 1.0
  const fg = parseFloat(recipe.fg) || 1.0
  const abv = ((og - fg) * 131.25).toFixed(1)

  const appleCost = recipe.appleVarieties.reduce(
    (sum, v) => sum + (parseFloat(v.lbs) || 0) * (parseFloat(v.costPerLb) || 0), 0
  )
  const otherIngredients = costs.yeast + costs.nutrients + costs.sulfites + costs.adjuncts
  const laborCost = costs.laborHours * costs.laborRate
  const overhead = costs.utilities + costs.sanitation + costs.misc

  const caseGallons = gallons * (mix.casePct / 100)
  const sixthGallons = gallons * (mix.sixthPct / 100)
  const halfGallons = gallons * (mix.halfPct / 100)

  const caseCount = Math.floor(caseGallons / CASE_GAL)
  const sixthCount = Math.floor(sixthGallons / SIXTH_GAL)
  const halfCount = Math.floor(halfGallons / HALF_GAL)

  const casePackagingCost = caseCount * (24 * (costs.canCost + costs.lidCost + costs.labelCost) + costs.sleeveBoxCost)
  const sixthPackagingCost = sixthCount * costs.kegRental16
  const halfPackagingCost = halfCount * costs.kegRental12
  const totalPackaging = casePackagingCost + sixthPackagingCost + halfPackagingCost

  const baseProductionCost = appleCost + otherIngredients + laborCost + overhead
  const totalCOGS = baseProductionCost + totalPackaging
  const cogsPerGallon = gallons > 0 ? baseProductionCost / gallons : 0

  const cogsPerCase = (cogsPerGallon * CASE_GAL) + (24 * (costs.canCost + costs.lidCost + costs.labelCost) + costs.sleeveBoxCost)
  const cogsPerSixth = (cogsPerGallon * SIXTH_GAL) + costs.kegRental16
  const cogsPerHalf = (cogsPerGallon * HALF_GAL) + costs.kegRental12

  const calcFormatProfit = (count, cogs, ptw, ptr) => ({
    ptw: count * ptw - count * cogs,
    ptr: count * ptr - count * cogs,
    revenuePTW: count * ptw,
    revenuePTR: count * ptr,
    cogsTotal: count * cogs,
  })

  const caseProfit = calcFormatProfit(caseCount, cogsPerCase, pricing.casePTW, pricing.casePTR)
  const sixthProfit = calcFormatProfit(sixthCount, cogsPerSixth, pricing.sixthPTW, pricing.sixthPTR)
  const halfProfit = calcFormatProfit(halfCount, cogsPerHalf, pricing.halfPTW, pricing.halfPTR)

  const totalRevenuePTW = caseProfit.revenuePTW + sixthProfit.revenuePTW + halfProfit.revenuePTW
  const totalRevenuePTR = caseProfit.revenuePTR + sixthProfit.revenuePTR + halfProfit.revenuePTR
  const totalProfitPTW = caseProfit.ptw + sixthProfit.ptw + halfProfit.ptw
  const totalProfitPTR = caseProfit.ptr + sixthProfit.ptr + halfProfit.ptr
  const grossMarginPct = totalRevenuePTW > 0 ? ((totalProfitPTW / totalRevenuePTW) * 100).toFixed(1) : 0

  return {
    abv, appleCost, otherIngredients, laborCost, overhead,
    totalPackaging, baseProductionCost, totalCOGS,
    cogsPerGallon, cogsPerCase, cogsPerSixth, cogsPerHalf,
    caseCount, sixthCount, halfCount,
    caseGallons, sixthGallons, halfGallons,
    casePackagingCost, sixthPackagingCost, halfPackagingCost,
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
  const [mix, setMix] = useState({ casePct: 50, sixthPct: 30, halfPct: 20 })
  const [activeTab, setActiveTab] = useState('recipe')

  const calc = useMemo(() => calcBatch(recipe, costs, pricing, mix), [recipe, costs, pricing, mix])

  const tabs = [
    { id: 'recipe', label: '🍎 Batch Recipe' },
    { id: 'costs', label: '💰 Cost Tracking' },
    { id: 'pricing', label: '🏷️ Pricing' },
    { id: 'mix', label: '📊 Mix & Profit' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-700 bg-slate-800/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-amber-400 leading-tight">🍺 Pinball Cider</h1>
            <p className="text-slate-400 text-xs">Batch Calculator — {recipe.batchName}</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-sm font-bold text-red-400">${calc.totalCOGS.toFixed(2)}</div>
              <div className="text-slate-500 text-xs">COGS</div>
            </div>
            <div>
              <div className="text-sm font-bold text-blue-400">${calc.totalRevenuePTW.toFixed(2)}</div>
              <div className="text-slate-500 text-xs">Revenue (PTW)</div>
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-400">${calc.totalProfitPTW.toFixed(2)}</div>
              <div className="text-slate-500 text-xs">Gross Profit</div>
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-400">{calc.grossMarginPct}%</div>
              <div className="text-slate-500 text-xs">Margin</div>
            </div>
          </div>
        </div>
      </header>

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
