import React from "react";
import { UserCheck, Zap } from "lucide-react";

interface ProfileData {
  name: string;
  age: number;
  profession: string;
  monthly_income: number;
  savings_rate: number;
  risk_appetite: string;
  net_worth: number;
  liquid_cash: number;
  total_invested: number;
  total_debt: number;
  emergency_fund_months: number;
  family_members: number;
  discipline_score: number;
  wealth_score: number;
}

interface DigitalTwinProps {
  profile: ProfileData;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({ profile }) => {
  // Ratios list representing the financial digital twin
  const behaviors = [
    {
      label: "Savings rate",
      value: `${profile.savings_rate}%`,
      percentage: profile.savings_rate * 2, // scale for progress bar
      status: profile.savings_rate >= 30 ? "Excellent" : profile.savings_rate >= 15 ? "Optimized" : "Critical",
      color: profile.savings_rate >= 30 ? "bg-brand-green" : profile.savings_rate >= 15 ? "bg-brand-cyan" : "bg-brand-pink",
      description: "Ratio of monthly salary invested or saved."
    },
    {
      label: "Emergency fund runway",
      value: `${profile.emergency_fund_months} Months`,
      percentage: (profile.emergency_fund_months / 12) * 100,
      status: profile.emergency_fund_months >= 6 ? "Safe" : profile.emergency_fund_months >= 3 ? "Caution" : "Critical",
      color: profile.emergency_fund_months >= 6 ? "bg-brand-green" : profile.emergency_fund_months >= 3 ? "bg-brand-gold" : "bg-brand-pink",
      description: "Months of mandatory expenses covered by liquid reserves."
    },
    {
      label: "Debt service (EMI) ratio",
      value: "32.5%", // Total EMI / Income
      percentage: 32.5 * 2.5,
      status: "Safe", // < 35% is safe
      color: "bg-brand-cyan",
      description: "Monthly EMI burden as percentage of total cash inflow."
    },
    {
      label: "Lifestyle expenditure index",
      value: "12.8%", // Non-essential / Income
      percentage: 12.8 * 3,
      status: "Very Safe", // < 20% is very safe
      color: "bg-brand-green",
      description: "Discretionary spend on dining, shopping, and subscriptions."
    },
    {
      label: "Investment discipline index",
      value: `${profile.discipline_score}/100`,
      percentage: profile.discipline_score,
      status: profile.discipline_score >= 80 ? "High" : profile.discipline_score >= 50 ? "Consistent" : "Irregular",
      color: profile.discipline_score >= 80 ? "bg-brand-green" : profile.discipline_score >= 50 ? "bg-brand-cyan" : "bg-brand-pink",
      description: "Metric of SIP consistency and timely credit card payments."
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-cyan" />
            Financial Digital Twin
          </h3>
          <span className="text-[10px] bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 px-2 py-0.5 rounded-full font-bold uppercase font-display">
            Twin Synced Live
          </span>
        </div>

        {/* Demographics Overview Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/30 border border-white/5 rounded-2xl p-4 mb-6 text-left">
          <div>
            <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wider">Identified Age</span>
            <span className="text-sm font-bold text-white">{profile.name}, {profile.age}</span>
          </div>
          <div>
            <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wider">Profession Class</span>
            <span className="text-sm font-bold text-white truncate max-w-[120px]" title={profile.profession}>{profile.profession}</span>
          </div>
          <div>
            <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wider">Dependents</span>
            <span className="text-sm font-bold text-white">{profile.family_members} Members</span>
          </div>
          <div>
            <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wider">Risk Archetype</span>
            <span className="text-sm font-bold text-brand-purple">{profile.risk_appetite}</span>
          </div>
        </div>

        {/* Behavioral profile parameters list */}
        <div className="text-left flex flex-col gap-4">
          <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-display">
            Active Behavioral Vectors
          </h4>
          
          <div className="flex flex-col gap-3">
            {behaviors.map((item, idx) => (
              <div key={idx} className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-2xl p-4 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-xs font-bold text-white font-display">
                      {item.label}
                    </span>
                    <p className="text-[10px] text-gray-500 leading-normal mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-white block">{item.value}</span>
                    <span className="text-[9px] text-gray-400 font-bold bg-white/5 px-1.5 py-0.5 rounded border border-white/10 mt-1 inline-block uppercase">
                      {item.status}
                    </span>
                  </div>
                </div>
                {/* Visual line progress bar */}
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Consensus Summary */}
      <div className="mt-6 border-t border-white/5 pt-4 flex gap-3 text-left">
        <div className="p-2 bg-brand-purple/10 border border-brand-purple/20 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center text-brand-purple">
          <Zap className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-white font-display">Twin Core Analytics</h5>
          <p className="text-[10px] text-gray-400 leading-relaxed mt-1">
            Rajesh exhibits highly disciplined savings habits with stable retirement projections. However, his liquid emergency buffers are sub-optimal due to the ₹4.5 Lakh outstanding car loan. Clearing this early will unlock ₹12,000/month of additional compounding capability.
          </p>
        </div>
      </div>
    </div>
  );
};
export default DigitalTwin;
