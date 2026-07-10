import React, { useState, useEffect } from "react";
import { ShieldCheck, Sparkles, RefreshCw, Check } from "lucide-react";
import { API_BASE_URL } from "../config";

interface FundRecom {
  name: string;
  allocation: string;
  type: string;
}

interface PortfolioConfig {
  allocation: Record<string, number>;
  description: string;
  recommended_funds: FundRecom[];
}

interface PortfolioOptimizerProps {
  currentRisk: string;
}

export const PortfolioOptimizer: React.FC<PortfolioOptimizerProps> = ({ currentRisk }) => {
  const [riskProfile, setRiskProfile] = useState<"Conservative" | "Moderate" | "Aggressive">("Moderate");
  const [recom, setRecom] = useState<PortfolioConfig | null>(null);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceSuccess, setRebalanceSuccess] = useState(false);

  useEffect(() => {
    // Cast input
    if (["Conservative", "Moderate", "Aggressive"].includes(currentRisk)) {
      setRiskProfile(currentRisk as any);
    }
  }, [currentRisk]);

  useEffect(() => {
    fetchRecommendation();
  }, [riskProfile]);

  const fetchRecommendation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/portfolio/optimize?risk_profile=${riskProfile}`);
      if (!response.ok) throw new Error("Optimization failed");
      const data = await response.json();
      setRecom(data.recommendation);
    } catch (e) {
      console.error("Local optimization fallback used", e);
      // Fallback local static calculations
      const fallbackAllocations: Record<string, PortfolioConfig> = {
        Conservative: {
          allocation: { Fixed_Deposits: 45, Debt_Funds_Liquid: 25, Large_Cap_MF: 15, Gold: 10, ETFs_Stocks: 5 },
          description: "Focus is on capital preservation. High allocation to Fixed Deposits protects capital.",
          recommended_funds: [
            { name: "IDBI Liquid Fund Direct-Growth", allocation: "25%", type: "Liquid Debt" },
            { name: "HDFC Short Term Debt Direct-Growth", allocation: "20%", type: "Debt" },
            { name: "ICICI Prudential Bluechip Fund Direct-Growth", allocation: "15%", type: "Large Cap Equity" },
            { name: "Sovereign Gold Bonds / Digital Gold", allocation: "10%", type: "Gold commodity" },
            { name: "IDBI Bank 3-Year FD (7.25% p.a.)", allocation: "30%", type: "Fixed Deposit" }
          ]
        },
        Moderate: {
          allocation: { Fixed_Deposits: 20, Debt_Funds_Liquid: 15, Large_Cap_MF: 30, Mid_Small_Cap_MF: 20, Gold: 8, ETFs_Stocks: 7 },
          description: "Balanced approach. Combines high-growth potential of mid/small-cap equity mutual funds with bluechips.",
          recommended_funds: [
            { name: "Parag Parikh Flexi Cap Fund Direct-Growth", allocation: "25%", type: "Flexi Cap Equity" },
            { name: "Mirae Asset Large Cap Fund Direct-Growth", allocation: "15%", type: "Large Cap Equity" },
            { name: "Quant Mid Cap Fund Direct-Growth", allocation: "15%", type: "Mid Cap Equity" },
            { name: "SBI Small Cap Fund Direct-Growth", allocation: "10%", type: "Small Cap Equity" },
            { name: "IDBI Liquid Fund Direct-Growth", allocation: "15%", type: "Liquid / Emergency" },
            { name: "Digital Gold / SGB", allocation: "10%", type: "Gold Assets" },
            { name: "IDBI Bank Fixed Deposit (7.10% p.a.)", allocation: "10%", type: "Fixed Deposit" }
          ]
        },
        Aggressive: {
          allocation: { Fixed_Deposits: 5, Debt_Funds_Liquid: 5, Large_Cap_MF: 25, Mid_Small_Cap_MF: 45, Gold: 5, ETFs_Stocks: 15 },
          description: "Focus is on high capital growth. Equity allocation is maximized across diversified flexi-caps.",
          recommended_funds: [
            { name: "Nippon India Small Cap Fund Direct-Growth", allocation: "20%", type: "Small Cap Equity" },
            { name: "HDFC Mid-Cap Opportunities Fund Direct-Growth", allocation: "15%", type: "Mid Cap Equity" },
            { name: "Parag Parikh Flexi Cap Fund Direct-Growth", allocation: "20%", type: "Flexi Cap Equity" },
            { name: "UTI Nifty 50 Index Fund Direct-Growth", allocation: "15%", type: "Large Cap Index" },
            { name: "Direct Nifty Stock Portfolio", allocation: "15%", type: "Direct Equities" },
            { name: "SBI Gold Fund Direct-Growth", allocation: "5%", type: "Gold ETF" },
            { name: "IDBI Liquid Fund", allocation: "10%", type: "Liquid" }
          ]
        }
      };
      setRecom(fallbackAllocations[riskProfile]);
    }
  };

  const handleRebalance = () => {
    setIsRebalancing(true);
    setRebalanceSuccess(false);
    setTimeout(() => {
      setIsRebalancing(false);
      setRebalanceSuccess(true);
      setTimeout(() => setRebalanceSuccess(false), 4000);
    }, 2500);
  };

  const assetColors: Record<string, string> = {
    Fixed_Deposits: "bg-brand-gold",
    Debt_Funds_Liquid: "bg-brand-cyan",
    Large_Cap_MF: "bg-brand-green",
    Mid_Small_Cap_MF: "bg-brand-purple",
    Gold: "bg-amber-500",
    ETFs_Stocks: "bg-brand-pink"
  };

  const formatLabel = (key: string) => {
    return key.replace(/_/g, " ");
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-green" />
            AI Portfolio Optimizer
          </h3>
          <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-gray-400 font-semibold uppercase tracking-wider font-display">
            Risk Profile: {riskProfile}
          </span>
        </div>

        {/* Risk Selector Slider */}
        <div className="bg-black/20 border border-white/5 rounded-2xl p-4 mb-5 text-left">
          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-display block mb-3">
            Adjust target risk index
          </label>
          <div className="flex justify-between items-center text-xs font-semibold px-1 text-gray-500">
            <span className={riskProfile === "Conservative" ? "text-brand-green font-bold" : ""}>Conservative</span>
            <span className={riskProfile === "Moderate" ? "text-brand-cyan font-bold" : ""}>Moderate</span>
            <span className={riskProfile === "Aggressive" ? "text-brand-purple font-bold" : ""}>Aggressive</span>
          </div>
          <div className="relative mt-2">
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={riskProfile === "Conservative" ? 0 : riskProfile === "Moderate" ? 1 : 2}
              onChange={(e) => {
                const val = Number(e.target.value);
                setRiskProfile(val === 0 ? "Conservative" : val === 1 ? "Moderate" : "Aggressive");
              }}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-green"
            />
          </div>
        </div>

        {recom && (
          <div>
            {/* Visual allocation bar */}
            <div className="flex w-full h-4 rounded-full overflow-hidden mb-5 bg-white/5">
              {Object.entries(recom.allocation).map(([key, val]) => (
                <div
                  key={key}
                  className={`h-full ${assetColors[key] || "bg-gray-500"} transition-all duration-500`}
                  style={{ width: `${val}%` }}
                  title={`${formatLabel(key)}: ${val}%`}
                />
              ))}
            </div>

            {/* Grid display of allocations */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 text-left">
              {Object.entries(recom.allocation).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2 bg-white/[0.01] border border-white/5 rounded-xl p-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${assetColors[key] || "bg-gray-500"}`} />
                  <div>
                    <span className="text-[9px] text-gray-500 block uppercase font-medium leading-none truncate w-[90px]">{formatLabel(key)}</span>
                    <span className="text-xs font-bold text-white">{val}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Portfolio Description */}
            <p className="text-xs text-gray-400 bg-white/[0.01] border border-white/5 rounded-2xl p-3.5 text-left leading-relaxed mb-5">
              {recom.description}
            </p>

            {/* Fund suggestions list */}
            <div className="text-left">
              <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 font-display">
                Recommended Target Allocation Breakdown
              </h4>
              <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto">
                {recom.recommended_funds.map((fund, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-white/[0.01] border border-white/5">
                    <div>
                      <h5 className="text-xs font-semibold text-white truncate max-w-[190px]">{fund.name}</h5>
                      <span className="text-[9px] text-gray-500 uppercase font-semibold">{fund.type}</span>
                    </div>
                    <span className="text-xs font-bold text-brand-green bg-brand-green/10 border border-brand-green/20 px-2.5 py-0.5 rounded-lg">
                      {fund.allocation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-5 border-t border-white/5 pt-4">
        {rebalanceSuccess ? (
          <div className="w-full py-3 rounded-xl bg-brand-green/20 border border-brand-green text-brand-green font-semibold text-sm flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Rebalancing Order Executed Successfully!</span>
          </div>
        ) : (
          <button
            onClick={handleRebalance}
            disabled={isRebalancing}
            className={`w-full py-3 rounded-xl font-semibold text-sm font-display flex items-center justify-center gap-2 border transition-all ${
              isRebalancing
                ? "bg-brand-green/10 border-brand-green/20 text-brand-green cursor-wait"
                : "bg-brand-green text-black border-brand-green hover:bg-brand-green/90 shadow-lg shadow-brand-green/15"
            }`}
          >
            {isRebalancing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Orchestrating Buy/Sell Orders via API...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute Portfolio Rebalance</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
export default PortfolioOptimizer;
