import React from "react";
import { Award, AlertCircle, ArrowUpRight } from "lucide-react";

interface ScoreBreakdownDetail {
  score: number;
  max: number;
  value: string;
}

interface WealthScoreProps {
  score: number;
  breakdown: Record<string, ScoreBreakdownDetail>;
  onImproveClick: (actionText: string) => void;
}

export const WealthScore: React.FC<WealthScoreProps> = ({ score, breakdown, onImproveClick }) => {
  // SVG circular properties
  const radius = 60;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  
  // Normalize score from 0-1000 to percentage
  const percentage = Math.min(100, Math.max(0, (score / 1000) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Get score categorization
  const getScoreInfo = () => {
    if (score >= 800) {
      return { label: "Elite", color: "text-brand-green", strokeColor: "#00e676", bgGlow: "neon-glow-green", desc: "Top 2% of Indian savers. Excellent resilience." };
    } else if (score >= 700) {
      return { label: "Very Good", color: "text-brand-cyan", strokeColor: "#00e5ff", bgGlow: "neon-glow-green", desc: "Solid discipline. Optimize assets to reach Elite tier." };
    } else if (score >= 550) {
      return { label: "Moderate", color: "text-brand-gold", strokeColor: "#ffd700", bgGlow: "neon-glow-gold", desc: "Good base. Debt EMI and liquid reserves need work." };
    } else {
      return { label: "Needs Review", color: "text-brand-pink", strokeColor: "#ff4081", bgGlow: "neon-glow-purple", desc: "High leverage risk. Action recommended immediately." };
    }
  };

  const info = getScoreInfo();

  // Helper to format labels from snake_case
  const formatLabel = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-gold animate-pulse" />
          AI Wealth Score
        </h3>
        <span className={`text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 font-medium ${info.color}`}>
          {info.label}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-around gap-6 py-2">
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center w-[160px] h-[160px]">
          {/* Outer glow ring */}
          <div className={`absolute inset-0 rounded-full bg-white/[0.02] border border-white/5 ${info.bgGlow}`} />
          
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth={strokeWidth}
            />
            {/* Value Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={info.strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Inner Text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold font-display tracking-tight text-white">{score}</span>
            <span className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">of 1000</span>
          </div>
        </div>

        {/* Dynamic score summary */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-sm font-medium text-gray-300 leading-snug">
            {info.desc}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center lg:justify-start">
            <div className="bg-black/30 border border-white/5 rounded-lg px-3 py-1.5 text-left min-w-[100px]">
              <span className="text-[9px] text-gray-500 block uppercase tracking-wider">SIP Streak</span>
              <span className="text-xs font-semibold text-brand-green">14 Months 🔥</span>
            </div>
            <div className="bg-black/30 border border-white/5 rounded-lg px-3 py-1.5 text-left min-w-[100px]">
              <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Debt Ratio</span>
              <span className="text-xs font-semibold text-white">32.5% (Safe)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5">
        {Object.entries(breakdown || {}).map(([key, val]) => (
          <div key={key} className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl p-2.5 transition-all">
            <span className="text-[9px] text-gray-500 block uppercase font-medium truncate">
              {formatLabel(key)}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xs font-bold text-white">{val.value}</span>
              <span className="text-[10px] text-gray-400 font-display">
                {val.score}/{val.max}
              </span>
            </div>
            {/* Progress line */}
            <div className="w-full bg-white/5 h-[3px] rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(val.score / val.max) * 100}%`,
                  backgroundColor: val.score / val.max >= 0.85 ? "#00e676" : val.score / val.max >= 0.6 ? "#ffd700" : "#ff4081"
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Alert */}
      <div className="mt-4 bg-brand-cyan/5 border border-brand-cyan/20 rounded-2xl p-3 flex items-center justify-between gap-3 text-left">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-brand-cyan mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-white">Boost score by 65 points</p>
            <p className="text-[10px] text-gray-400 leading-normal">
              Move ₹1 Lakh lazy savings cash to IDBI Liquid Mutual Fund to secure your 6 months emergency runway.
            </p>
          </div>
        </div>
        <button
          onClick={() => onImproveClick("How can I increase my Wealth Score?")}
          className="p-1.5 rounded-lg bg-brand-cyan/15 hover:bg-brand-cyan/25 text-brand-cyan border border-brand-cyan/35 transition-all cursor-pointer"
          title="Ask AI Coach"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default WealthScore;
