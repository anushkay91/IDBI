import React from "react";
import { Award, Flame, CheckCircle2 } from "lucide-react";

export const Gamification: React.FC = () => {
  const achievements = [
    { name: "EMI Shield", desc: "Maintained debt ratio below 35% for 6 consecutive months.", icon: "🛡️", date: "Earned" },
    { name: "Tax Saver Elite", desc: "Locked-in ELSS and FD targets under section 80C.", icon: "💼", date: "Earned" },
    { name: "Compound Commander", desc: "Run active SIP allocations for over 12 months.", icon: "🚀", date: "Earned" }
  ];

  const challenges = [
    { title: "Weekend Dining Shield", desc: "Keep dining/takeout spends under ₹2,000 this week.", progress: 85, target: "₹2,000", reward: "Discipline badge" },
    { title: "Emergency runway lift", desc: "Deposit ₹25,000 to liquid fund to clear 5 months buffer.", progress: 60, target: "₹25,000", reward: "Score boost +40 pts" },
    { title: "Gold standard rebalance", desc: "Invest ₹10,000 in sovereign gold bonds (SGB).", progress: 0, target: "₹10,000", reward: "Gold badge" }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-gold animate-bounce" />
            Discipline Level & Rewards
          </h3>
          <span className="text-[10px] bg-brand-gold/15 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded-full font-bold uppercase font-display">
            Level 4: Wealth Architect
          </span>
        </div>

        {/* Big Streak Indicator */}
        <div className="bg-black/35 border border-white/5 rounded-2xl p-4 flex items-center justify-around gap-4 mb-6">
          <div className="text-left">
            <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wider">SIP Investment Streak</span>
            <h4 className="text-2xl font-extrabold text-white font-display mt-0.5">14 Months Active</h4>
            <p className="text-[10px] text-gray-400 mt-1 leading-normal">
              Continuous auto-debits without misses since June 2025. Keep going!
            </p>
          </div>
          <div className="h-16 w-16 bg-gradient-to-tr from-brand-gold to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20">
            <Flame className="w-8 h-8 text-black fill-current animate-pulse" />
          </div>
        </div>

        {/* Badges and achievements */}
        <div className="text-left mb-6">
          <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 font-display">
            Earned Badges
          </h4>
          <div className="grid grid-cols-3 gap-2.5">
            {achievements.map((item, idx) => (
              <div key={idx} className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center transition-all flex flex-col justify-between h-[105px]">
                <span className="text-2xl block mb-1">{item.icon}</span>
                <h5 className="text-[10px] font-bold text-white leading-tight truncate">{item.name}</h5>
                <span className="text-[8px] bg-brand-green/10 text-brand-green px-1 py-0.5 rounded font-extrabold border border-brand-green/20 uppercase tracking-wide mt-2">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges checklist */}
        <div className="text-left mt-2 pt-4 border-t border-white/5">
          <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 font-display">
            Active Financial Quests
          </h4>
          <div className="flex flex-col gap-3 max-h-[140px] overflow-y-auto">
            {challenges.map((challenge, idx) => (
              <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-2xl p-3.5 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-white font-display flex items-center gap-1.5">
                      {challenge.title}
                      {challenge.progress === 100 && <CheckCircle2 className="w-3.5 h-3.5 text-brand-green shrink-0" />}
                    </h5>
                    <p className="text-[10px] text-gray-500 leading-normal mt-0.5">{challenge.desc}</p>
                  </div>
                  <span className="text-[9px] text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded font-bold border border-brand-cyan/20 shrink-0">
                    Reward: {challenge.reward}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-brand-gold to-brand-green rounded-full transition-all duration-1000"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-gray-500 font-semibold mt-1">
                  <span>Progress: {challenge.progress}%</span>
                  <span>Target: {challenge.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Gamification;
