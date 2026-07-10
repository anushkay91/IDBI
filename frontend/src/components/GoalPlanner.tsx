import React, { useState, useEffect } from "react";
import { Plus, Target, Calendar, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { API_BASE_URL } from "../config";

interface GoalDetail {
  id: string;
  name: string;
  category: string;
  target_amount: number;
  inflated_target: number;
  current_amount: number;
  monthly_sip_allocated: number;
  required_sip: number;
  estimated_future_value: number;
  success_probability: number;
  expected_return: number;
  timeline: { year: number; projected_val: number; target_val: number }[];
}

export const GoalPlanner: React.FC = () => {
  const [goals, setGoals] = useState<GoalDetail[]>([]);
  const [inflation, setInflation] = useState(6.0);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  
  // Add Goal Form States
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("Education");
  const [newGoalTarget, setNewGoalTarget] = useState(1000000);
  const [newGoalYears, setNewGoalYears] = useState(5);
  const [newGoalCurrent, setNewGoalCurrent] = useState(50000);
  const [newGoalSIP, setNewGoalSIP] = useState(5000);

  useEffect(() => {
    fetchGoals();
  }, [inflation]);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/goals?inflation=${inflation}`);
      if (!response.ok) throw new Error("Failed to load goals");
      const data = await response.json();
      setGoals(data.goals);
    } catch (e) {
      console.error("Local fallback for goals calculation", e);
      // Math fallback
      calculateFallbackGoals(inflation);
    }
  };

  const calculateFallbackGoals = (infl: number) => {
    const rawGoals = [
      { id: "G-1", name: "Child's Foreign Education", target_amount: 5000000, current_amount: 400000, timeframe_years: 12, monthly_sip_allocated: 15000, priority: "High", category: "Education" },
      { id: "G-2", name: "Retirement Corpus", target_amount: 50000000, current_amount: 615000, timeframe_years: 26, monthly_sip_allocated: 10000, priority: "High", category: "Retirement" },
      { id: "G-3", name: "Europe Family Vacation", target_amount: 500000, current_amount: 150000, timeframe_years: 1.5, monthly_sip_allocated: 10000, priority: "Medium", category: "Vacation" },
      { id: "G-4", name: "New SUV Car purchase", target_amount: 1800000, current_amount: 200000, timeframe_years: 4, monthly_sip_allocated: 5000, priority: "Low", category: "Car" }
    ];

    const computed = rawGoals.map((g) => {
      const expected_return = g.category === "Retirement" ? 12.0 : g.category === "Education" ? 12.5 : 8.5;
      const months = g.timeframe_years * 12;
      const r_monthly = expected_return / 100 / 12;
      const inflated_target = g.target_amount * Math.pow(1 + infl/100, g.timeframe_years);

      const fv_current = g.current_amount * Math.pow(1 + r_monthly, months);
      const fv_sip = g.monthly_sip_allocated * ((Math.pow(1 + r_monthly, months) - 1) / r_monthly) * (1 + r_monthly);
      const estimated_fv = fv_current + fv_sip;

      const needed = Math.max(0, inflated_target - fv_current);
      const required_sip = needed / (((Math.pow(1 + r_monthly, months) - 1) / r_monthly) * (1 + r_monthly));

      const ratio = estimated_fv / inflated_target;
      const probability = Math.min(99.0, Math.max(15.0, ratio * 75.0));

      const timeline = [];
      for (let y = 0; y <= Math.ceil(g.timeframe_years); y++) {
        const y_months = y * 12;
        const y_fv_current = g.current_amount * Math.pow(1 + r_monthly, y_months);
        const y_fv_sip = g.monthly_sip_allocated * ((Math.pow(1 + r_monthly, y_months) - 1) / r_monthly) * (1 + r_monthly);
        timeline.push({
          year: y,
          projected_val: Math.round(y_fv_current + y_fv_sip),
          target_val: Math.round(inflated_target * (y / g.timeframe_years))
        });
      }

      return {
        id: g.id,
        name: g.name,
        category: g.category,
        target_amount: g.target_amount,
        inflated_target: Math.round(inflated_target),
        current_amount: g.current_amount,
        monthly_sip_allocated: g.monthly_sip_allocated,
        required_sip: Math.round(required_sip),
        estimated_future_value: Math.round(estimated_fv),
        success_probability: Math.round(probability),
        expected_return,
        timeline
      };
    });

    setGoals(computed);
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `G-${goals.length + 1}`;
    
    // Add simple mock computation for new goal
    const expected_return = 12.0;
    const months = newGoalYears * 12;
    const r_monthly = expected_return / 100 / 12;
    const inflated_target = newGoalTarget * Math.pow(1 + inflation/100, newGoalYears);
    const fv_current = newGoalCurrent * Math.pow(1 + r_monthly, months);
    const fv_sip = newGoalSIP * ((Math.pow(1 + r_monthly, months) - 1) / r_monthly) * (1 + r_monthly);
    const estimated_fv = fv_current + fv_sip;
    const needed = Math.max(0, inflated_target - fv_current);
    const required_sip = needed / (((Math.pow(1 + r_monthly, months) - 1) / r_monthly) * (1 + r_monthly));
    const ratio = estimated_fv / inflated_target;
    const probability = Math.min(99.0, Math.max(15.0, ratio * 75.0));

    const timeline = [];
    for (let y = 0; y <= newGoalYears; y++) {
      timeline.push({
        year: y,
        projected_val: Math.round(newGoalCurrent * Math.pow(1 + r_monthly, y * 12) + newGoalSIP * ((Math.pow(1 + r_monthly, y * 12) - 1) / r_monthly) * (1 + r_monthly)),
        target_val: Math.round(inflated_target * (y / newGoalYears))
      });
    }

    const newGoal: GoalDetail = {
      id,
      name: newGoalName,
      category: newGoalCategory,
      target_amount: newGoalTarget,
      inflated_target: Math.round(inflated_target),
      current_amount: newGoalCurrent,
      monthly_sip_allocated: newGoalSIP,
      required_sip: Math.round(required_sip),
      estimated_future_value: Math.round(estimated_fv),
      success_probability: Math.round(probability),
      expected_return,
      timeline
    };

    setGoals([...goals, newGoal]);
    setShowAddGoal(false);
    // Reset Form
    setNewGoalName("");
    setNewGoalTarget(1000000);
    setNewGoalYears(5);
    setNewGoalCurrent(50000);
    setNewGoalSIP(5000);
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return "text-brand-green bg-brand-green/10 border-brand-green/20";
    if (prob >= 50) return "text-brand-gold bg-brand-gold/10 border-brand-gold/20";
    return "text-brand-pink bg-brand-pink/10 border-brand-pink/20";
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-purple" />
            AI Wealth Goal Planner
          </h3>
          <button
            onClick={() => setShowAddGoal(true)}
            className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold font-display text-white flex items-center gap-1 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-brand-green" /> Add Goal
          </button>
        </div>

        {/* Inflation Slider */}
        <div className="bg-black/30 border border-white/5 rounded-2xl p-4 mb-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-display block mb-1">
              Adjust Inflation Index (India Standard)
            </span>
            <p className="text-[10px] text-gray-500 leading-normal">
              Future targets will adjust to maintain current purchasing power values.
            </p>
          </div>
          <div className="flex items-center gap-3 min-w-[200px]">
            <input
              type="range"
              min="4.0"
              max="10.0"
              step="0.5"
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-purple"
            />
            <span className="text-sm font-extrabold text-white font-display shrink-0">{inflation}%</span>
          </div>
        </div>

        {/* Add Goal Modal/Form Panel */}
        {showAddGoal && (
          <form onSubmit={handleAddGoalSubmit} className="bg-black/45 border border-white/10 rounded-2xl p-4 mb-5 text-left flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Configure New Goal</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-gray-500 uppercase font-semibold">Goal Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buy Luxury Villa"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple mt-1"
                />
              </div>
              <div>
                <label className="text-[9px] text-gray-500 uppercase font-semibold">Category</label>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple mt-1"
                >
                  <option value="Education">Education</option>
                  <option value="Retirement">Retirement</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Car">SUV / Car</option>
                  <option value="House">House / Property</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[9px] text-gray-500 uppercase font-semibold">Target (₹)</label>
                <input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple mt-1"
                />
              </div>
              <div>
                <label className="text-[9px] text-gray-500 uppercase font-semibold">Years</label>
                <input
                  type="number"
                  value={newGoalYears}
                  onChange={(e) => setNewGoalYears(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple mt-1"
                />
              </div>
              <div>
                <label className="text-[9px] text-gray-500 uppercase font-semibold">Active Saved (₹)</label>
                <input
                  type="number"
                  value={newGoalCurrent}
                  onChange={(e) => setNewGoalCurrent(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] text-gray-500 uppercase font-semibold">Proposed Monthly SIP (₹)</label>
              <input
                type="number"
                value={newGoalSIP}
                onChange={(e) => setNewGoalSIP(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple mt-1"
              />
            </div>

            <div className="flex gap-2 justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowAddGoal(false)}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-brand-green text-black font-semibold text-xs hover:bg-brand-green/90"
              >
                Compute & Add
              </button>
            </div>
          </form>
        )}

        {/* Goals List */}
        <div className="flex flex-col gap-3 text-left">
          {goals.map((goal) => {
            const isExpanded = expandedGoalId === goal.id;
            const targetDeficit = goal.required_sip - goal.monthly_sip_allocated;
            
            return (
              <div
                key={goal.id}
                className="border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl p-4 transition-all"
              >
                {/* Header overview */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-purple/10 border border-brand-purple/20 rounded-xl text-brand-purple shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-display leading-tight">{goal.name}</h4>
                      <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                        Target: ₹{(goal.target_amount/100000).toFixed(0)}L • Active SIP: ₹{goal.monthly_sip_allocated.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getProbabilityColor(goal.success_probability)}`}>
                      {goal.success_probability}% Success
                    </span>
                    <span className="text-[9px] text-gray-500 block mt-1 font-semibold uppercase">Click to toggle roadmap</span>
                  </div>
                </div>

                {/* Collapsible Roadmap Timeline */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-black/30 border border-white/5 rounded-xl p-2.5">
                        <span className="text-[9px] text-gray-500 block uppercase font-medium">Inflation-Adjusted Target</span>
                        <span className="text-xs font-bold text-white">₹{(goal.inflated_target/100000).toFixed(1)} Lakhs</span>
                      </div>
                      <div className="bg-black/30 border border-white/5 rounded-xl p-2.5">
                        <span className="text-[9px] text-gray-500 block uppercase font-medium">Required Monthly SIP</span>
                        <span className="text-xs font-bold text-brand-green">₹{goal.required_sip.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 col-span-2 md:col-span-1">
                        <span className="text-[9px] text-gray-500 block uppercase font-medium">Interest Growth Return</span>
                        <span className="text-xs font-bold text-brand-cyan">{goal.expected_return}% p.a.</span>
                      </div>
                    </div>

                    {/* Deficit Alert Warning */}
                    {targetDeficit > 0 && (
                      <div className="bg-brand-pink/5 border border-brand-pink/20 rounded-xl p-3 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-brand-pink mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-white uppercase">SIP Buffer Deficit: ₹{targetDeficit.toLocaleString('en-IN')}/mo</p>
                          <p className="text-[10px] text-gray-400 leading-normal mt-0.5">
                            Your active SIP of ₹{goal.monthly_sip_allocated.toLocaleString('en-IN')} is short of the required ₹{goal.required_sip.toLocaleString('en-IN')} to clear the inflation shock. Boost SIP by ₹{targetDeficit.toLocaleString('en-IN')} or extend timeframe.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Timeline Graph */}
                    <div className="h-[140px] w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={goal.timeline}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" fontSize={9} tickFormatter={(v) => `Yr ${v}`} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
                          <Tooltip
                            contentStyle={{ background: "#11131f", borderColor: "rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "10px" }}
                            itemStyle={{ color: "#fff" }}
                          />
                          <Line type="monotone" dataKey="projected_val" name="Projected Portfolio Value" stroke="#00e676" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="target_val" name="Target Roadmap" stroke="#7c4dff" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default GoalPlanner;
