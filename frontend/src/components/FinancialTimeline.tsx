import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Calendar, Milestone } from "lucide-react";

interface TimelineProps {
  netWorth: number;
  totalDebt: number;
  totalInvested: number;
}

export const FinancialTimeline: React.FC<TimelineProps> = ({ netWorth, totalDebt, totalInvested }) => {
  const [timeframe, setTimeframe] = useState<5 | 10 | 20>(10);

  // Generate projections based on active timeframe
  const generateTimelineProjections = (years: number) => {
    const data = [];
    let curInvested = totalInvested;
    let curDebt = totalDebt;
    
    // Growth parameters
    const interestRate = 0.115; // 11.5%
    const sipAnnual = (30000 + 10000) * 12; // 30k MF + 10k additional savings
    
    for (let yr = 0; yr <= years; yr++) {
      if (yr > 0) {
        // Compound investments
        curInvested = curInvested + (curInvested * interestRate) + sipAnnual;
        
        // Simulating debt reduction
        // Car loan cleared in 4 years, home loan in 10 years
        let debtReduction = 0;
        if (yr <= 4) {
          debtReduction = (12000 * 12) + (45000 * 12);
        } else if (yr <= 10) {
          debtReduction = (45000 * 12);
        }
        curDebt = Math.max(0, curDebt - debtReduction);
      }
      
      const calculatedNetWorth = curInvested - curDebt;
      
      data.push({
        year: `Year ${yr}`,
        Investments: Math.round(curInvested / 100000), // In Lakhs
        Liabilities: Math.round(curDebt / 100000),
        "Net Worth": Math.round(calculatedNetWorth / 100000)
      });
    }
    return data;
  };

  const chartData = generateTimelineProjections(timeframe);

  // Milestone events
  const getMilestonesForTimeframe = (years: number) => {
    const list = [
      { year: 1, title: "Emergency runway secure", desc: "Liquid buffer expands to 6 months savings.", type: "success" },
      { year: 4, title: "Car Loan Cleared", desc: "ICICI car loan fully discharged. Unlocks ₹12,000/mo EMI cashflow.", type: "success" },
      { year: 10, title: "Home Loan Discharged", desc: "SBI Home loan cleared. Net worth surges by ₹38 Lakhs.", type: "success" },
      { year: 12, title: "Education Goal Met", desc: "₹50 Lakhs child foreign education milestone funded.", type: "success" },
      { year: 20, title: "Pre-Retirement Corpus Check", desc: "Net Worth reaches ₹3.8 Crores. Financial Independence attained.", type: "milestone" }
    ];
    return list.filter((m) => m.year <= years);
  };

  const milestones = getMilestonesForTimeframe(timeframe);

  const formatLakhs = (val: any) => {
    return `₹${val}L`;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
            <Milestone className="w-5 h-5 text-brand-gold animate-bounce" />
            AI Financial Health Timeline
          </h3>
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
            {([5, 10, 20] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`py-1 px-3 rounded-lg text-xs font-semibold font-display transition-all ${
                  timeframe === t
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {t} Years
              </button>
            ))}
          </div>
        </div>

        {/* Current status display card */}
        <div className="grid grid-cols-3 gap-3 mb-4 bg-black/20 border border-white/5 rounded-2xl p-3 text-left">
          <div>
            <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wider">Active Assets</span>
            <span className="text-xs font-extrabold text-white">₹{totalInvested.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wider">Total Liabilities</span>
            <span className="text-xs font-extrabold text-brand-pink">₹{totalDebt.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wider">Net Position</span>
            <span className="text-xs font-extrabold text-brand-green">₹{netWorth.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Projection Chart */}
        <div className="h-[200px] w-full my-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e676" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#00e676" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLiab" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4081" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ff4081" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" fontSize={9} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickFormatter={formatLakhs} />
              <Tooltip
                contentStyle={{ background: "#11131f", borderColor: "rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "10px" }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Area type="monotone" dataKey="Net Worth" stroke="#00e676" fillOpacity={1} fill="url(#colorNetWorth)" strokeWidth={2} />
              <Area type="monotone" dataKey="Investments" stroke="#7c4dff" fill="transparent" strokeWidth={1.5} />
              <Area type="monotone" dataKey="Liabilities" stroke="#ff4081" fillOpacity={1} fill="url(#colorLiab)" strokeWidth={1} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone logs */}
        <div className="text-left mt-6">
          <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 font-display">
            Projected Financial Milestones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[140px] overflow-y-auto pr-1">
            {milestones.map((item, idx) => (
              <div key={idx} className="flex gap-2.5 items-start p-3 bg-white/[0.01] border border-white/5 rounded-2xl">
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-brand-gold shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {item.title}
                    <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400 font-bold border border-white/10 uppercase">
                      Yr {item.year}
                    </span>
                  </h5>
                  <p className="text-[10px] text-gray-500 leading-normal mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FinancialTimeline;
