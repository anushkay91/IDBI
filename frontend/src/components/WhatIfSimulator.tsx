import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Sliders, HelpCircle, RefreshCw } from "lucide-react";
import { API_BASE_URL } from "../config";

interface TimelineData {
  year: number;
  net_worth: number;
  assets: number;
  debt: number;
  real_value: number;
}

interface SimulationResult {
  scenario: string;
  description: string;
  conclusion: string;
  baseline_timeline: TimelineData[];
  scenario_timeline: TimelineData[];
  final_net_worth_base: number;
  final_net_worth_sc: number;
  difference: number;
}

export const WhatIfSimulator: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<"sip_change" | "early_retirement" | "inflation_spike" | "stop_sip">("sip_change");
  
  // Slider states
  const [additionalSip, setAdditionalSip] = useState(5000);
  const [retireAge, setRetireAge] = useState(50);
  const [inflationRate, setInflationRate] = useState(8.0);
  const [stopYear, setStopYear] = useState(3);
  
  const [simulationData, setSimulationData] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger API call when sliders/scenarios change
  useEffect(() => {
    fetchSimulation();
  }, [activeScenario, additionalSip, retireAge, inflationRate, stopYear]);

  const fetchSimulation = async () => {
    setIsLoading(true);
    try {
      let params: Record<string, any> = {};
      if (activeScenario === "sip_change") {
        params.additional_sip = additionalSip;
      } else if (activeScenario === "early_retirement") {
        params.retire_age = retireAge;
      } else if (activeScenario === "inflation_spike") {
        params.inflation_rate = inflationRate;
      } else if (activeScenario === "stop_sip") {
        params.stop_year = stopYear;
      }

      const response = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: activeScenario,
          params
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile simulation");
      }

      const data = await response.json();
      setSimulationData(data);
    } catch (e) {
      console.error("Simulation fetch error, using local fallback calculations", e);
      // Math fallback in case server is not running yet during hot reload
      generateFallbackLocal(activeScenario, additionalSip, retireAge, inflationRate, stopYear);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackLocal = (scenario: string, sip: number, age: number, infl: number, stopYr: number) => {
    // Generate mock localized calculations for instantaneous feedback
    const baseInvested = 666000;
    const baseSip = 30000;
    const baseInt = 11.5;
    const baseInfl = 6.0;
    
    let scSip = baseSip;
    let scInfl = baseInfl;
    let scRetireYr = 20;
    let scStopYr = 999;
    
    if (scenario === "sip_change") scSip = baseSip + sip;
    if (scenario === "early_retirement") scRetireYr = Math.max(0, age - 34);
    if (scenario === "inflation_spike") scInfl = infl;
    if (scenario === "stop_sip") scStopYr = stopYr;

    let baseWealth = baseInvested;
    let scWealth = baseInvested;
    const baseTimeline: TimelineData[] = [];
    const scTimeline: TimelineData[] = [];

    for (let yr = 1; yr <= 20; yr++) {
      // Base
      baseWealth = baseWealth + baseWealth * (baseInt / 100) + (baseSip + 10000) * 12;
      baseTimeline.push({
        year: yr,
        net_worth: Math.round(baseWealth),
        assets: Math.round(baseWealth),
        debt: 0,
        real_value: Math.round(baseWealth / Math.pow(1 + baseInfl/100, yr))
      });

      // Scenario
      const isRetired = yr > scRetireYr;
      const isSipStopped = yr > scStopYr;
      const interest = scWealth * (baseInt / 100);
      
      if (isRetired) {
        scWealth = scWealth + interest - (scWealth * 0.06);
      } else {
        const currentYrSip = isSipStopped ? 0 : scSip;
        scWealth = scWealth + interest + (currentYrSip + 10000) * 12;
      }
      scTimeline.push({
        year: yr,
        net_worth: Math.round(scWealth),
        assets: Math.round(scWealth),
        debt: 0,
        real_value: Math.round(scWealth / Math.pow(1 + scInfl/100, yr))
      });
    }

    const diff = scWealth - baseWealth;
    let conclusion = "";
    if (diff > 0) {
      conclusion = `Compounding increases your 20-year net worth by ₹${Math.abs(diff).toLocaleString('en-IN')}. Excellent roadmap selection!`;
    } else {
      conclusion = `Early action reduces your 20-year net worth by ₹${Math.abs(diff).toLocaleString('en-IN')}. Buffer other assets to match the target.`;
    }

    setSimulationData({
      scenario,
      description: `Scenario calculation description`,
      conclusion,
      baseline_timeline: baseTimeline,
      scenario_timeline: scTimeline,
      final_net_worth_base: baseWealth,
      final_net_worth_sc: scWealth,
      difference: diff
    });
  };

  // Combine timelines into single data source for Recharts
  const chartData = simulationData
    ? simulationData.baseline_timeline.map((item, idx) => {
        const scItem = simulationData.scenario_timeline[idx] || item;
        return {
          year: `Yr ${item.year}`,
          "Baseline Path": Math.round(item.net_worth / 100000), // In Lakhs
          "Simulated Path": Math.round(scItem.net_worth / 100000) // In Lakhs
        };
      })
    : [];

  const formatRupeesLakhs = (val: any) => {
    return `₹${val}L`;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-cyan" />
            What-If Financial Sandbox
          </h3>
          <span className="cursor-help" title="Model custom future events dynamically">
            <HelpCircle className="w-4 h-4 text-gray-500 hover:text-white" />
          </span>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <button
            onClick={() => setActiveScenario("sip_change")}
            className={`py-2 px-3 rounded-xl text-xs font-semibold font-display border transition-all ${
              activeScenario === "sip_change"
                ? "bg-brand-green/20 border-brand-green text-brand-green"
                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            ₹ SIP Boost
          </button>
          <button
            onClick={() => setActiveScenario("early_retirement")}
            className={`py-2 px-3 rounded-xl text-xs font-semibold font-display border transition-all ${
              activeScenario === "early_retirement"
                ? "bg-brand-purple/20 border-brand-purple text-brand-purple"
                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            Early Retirement
          </button>
          <button
            onClick={() => setActiveScenario("inflation_spike")}
            className={`py-2 px-3 rounded-xl text-xs font-semibold font-display border transition-all ${
              activeScenario === "inflation_spike"
                ? "bg-brand-gold/20 border-brand-gold text-brand-gold"
                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            Inflation Shock
          </button>
          <button
            onClick={() => setActiveScenario("stop_sip")}
            className={`py-2 px-3 rounded-xl text-xs font-semibold font-display border transition-all ${
              activeScenario === "stop_sip"
                ? "bg-brand-pink/20 border-brand-pink text-brand-pink"
                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            Stop SIP
          </button>
        </div>

        {/* Active Slider Section */}
        <div className="bg-black/30 border border-white/5 rounded-2xl p-4 mb-6">
          {activeScenario === "sip_change" && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400 font-semibold font-display uppercase">Additional Monthly SIP</span>
                <span className="text-sm font-bold text-brand-green">₹{additionalSip.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={additionalSip}
                onChange={(e) => setAdditionalSip(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-green"
              />
              <span className="text-[10px] text-gray-500 leading-normal">
                Compounding extra cash in index mutual funds. Ideal risk buffer.
              </span>
            </div>
          )}

          {activeScenario === "early_retirement" && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400 font-semibold font-display uppercase">Retirement Target Age</span>
                <span className="text-sm font-bold text-brand-purple">{retireAge} Years Old</span>
              </div>
              <input
                type="range"
                min="40"
                max="65"
                step="1"
                value={retireAge}
                onChange={(e) => setRetireAge(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-purple"
              />
              <span className="text-[10px] text-gray-500 leading-normal">
                Retiring at {retireAge} leaves {Math.max(0, retireAge - 34)} compounding years prior to safe asset withdrawals.
              </span>
            </div>
          )}

          {activeScenario === "inflation_spike" && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400 font-semibold font-display uppercase">Simulated Inflation Rate</span>
                <span className="text-sm font-bold text-brand-gold">{inflationRate.toFixed(1)}% p.a.</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold"
              />
              <span className="text-[10px] text-gray-500 leading-normal">
                Baseline CPI is 6.0%. High inflation severely reduces long-term rupee purchasing power.
              </span>
            </div>
          )}

          {activeScenario === "stop_sip" && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400 font-semibold font-display uppercase">Stop all SIPs after</span>
                <span className="text-sm font-bold text-brand-pink">{stopYear} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={stopYear}
                onChange={(e) => setStopYear(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-pink"
              />
              <span className="text-[10px] text-gray-500 leading-normal">
                Simulates breaking SIP discipline to cover debt or large retail goals.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart visualization */}
      <div className="h-[220px] w-full my-2 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xs rounded-2xl flex items-center justify-center z-10">
            <RefreshCw className="w-6 h-6 text-brand-cyan animate-spin" />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" fontSize={10} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={formatRupeesLakhs} />
            <Tooltip
              contentStyle={{ background: "#11131f", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
            <Line
              type="monotone"
              dataKey="Baseline Path"
              stroke="#6b7280"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Simulated Path"
              stroke={
                activeScenario === "sip_change"
                  ? "#00e676"
                  : activeScenario === "early_retirement"
                  ? "#7c4dff"
                  : activeScenario === "inflation_spike"
                  ? "#ffd700"
                  : "#ff4081"
              }
              strokeWidth={2.5}
              dot={false}
              className="neon-glow-green"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Numerical Impact Callout */}
      {simulationData && (
        <div className="mt-4 flex flex-col md:flex-row gap-4 justify-between border-t border-white/5 pt-4">
          <div className="flex-1 text-left">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Net Worth Impact (20 Years)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-xl font-extrabold font-display ${simulationData.difference >= 0 ? "text-brand-green" : "text-brand-pink"}`}>
                {simulationData.difference >= 0 ? "+" : ""}
                ₹{(simulationData.difference / 100000).toFixed(1)} Lakhs
              </span>
              <span className="text-xs text-gray-400">
                (₹{(simulationData.final_net_worth_sc / 100000).toFixed(1)}L vs ₹{(simulationData.final_net_worth_base / 100000).toFixed(1)}L)
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 leading-normal font-sans">
              {simulationData.conclusion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default WhatIfSimulator;
