import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { CreditCard, ShoppingBag, Coffee, AlertTriangle, TrendingUp } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  category: string;
  type: string;
  payment_method: string;
  is_impulse: boolean;
}

interface SpendingIntelligenceProps {
  transactions: Transaction[];
  onAddQuery: (query: string) => void;
}

export const SpendingIntelligence: React.FC<SpendingIntelligenceProps> = ({ transactions, onAddQuery }) => {
  const [filterCategory, setFilterCategory] = useState<string>("All");

  // Sum spending by category
  const categoryTotals: Record<string, number> = {};
  let totalDebit = 0;
  let impulseSpend = 0;

  transactions.forEach((t) => {
    if (t.type === "Debit" && t.category !== "Investment") {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      totalDebit += t.amount;
      if (t.is_impulse) {
        impulseSpend += t.amount;
      }
    }
  });

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }));

  const COLORS = ["#00e676", "#7c4dff", "#00e5ff", "#ff4081", "#ffd700", "#ff9100", "#ec4899", "#8b5cf6"];

  const impulseRatio = totalDebit > 0 ? (impulseSpend / totalDebit) * 100 : 0;

  // Filter transactions list
  const filteredTxns = filterCategory === "All"
    ? transactions
    : transactions.filter((t) => t.category === filterCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Food":
        return <Coffee className="w-4 h-4 text-brand-green" />;
      case "Shopping":
        return <ShoppingBag className="w-4 h-4 text-brand-purple" />;
      case "Luxury":
        return <TrendingUp className="w-4 h-4 text-brand-gold" />;
      case "Bills":
      default:
        return <CreditCard className="w-4 h-4 text-brand-cyan" />;
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-pink" />
            AI Spending Intelligence
          </h3>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider font-display">
            Monthly Outflow: ₹{totalDebit.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Pie Chart */}
          <div className="h-[200px] w-full relative flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(21, 23, 30, 0.8)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#11131f", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-gray-500">No debit logs found.</span>
            )}
            
            {/* Inner Center Text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">Retail Spend</span>
              <span className="text-sm font-bold text-white">₹{Math.round(totalDebit).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Metrics & Impulse gauge */}
          <div className="flex flex-col gap-4">
            {/* Impulse Spend Warning */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400 font-semibold font-display uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-brand-pink shrink-0" />
                  Impulse Spending Ratio
                </span>
                <span className="text-sm font-bold text-brand-pink">{Math.round(impulseRatio)}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-pink rounded-full transition-all duration-1000"
                  style={{ width: `${impulseRatio}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed mt-2">
                You spent <strong className="text-white">₹{impulseSpend.toLocaleString('en-IN')}</strong> on retail categories flagged as non-essential impulse items (Starbucks, late-night Swiggy/Zomato).
              </p>
            </div>

            {/* Savings Arbitrage */}
            <div
              onClick={() => onAddQuery("How can I save ₹2400 monthly from food delivery and coffee?")}
              className="bg-brand-green/5 border border-brand-green/20 hover:bg-brand-green/10 cursor-pointer rounded-2xl p-3 flex items-start gap-2 text-left transition-all"
            >
              <TrendingUp className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">AI Saving Leak Alert</p>
                <p className="text-[10px] text-gray-400 leading-normal mt-0.5">
                  Shifting 20% of Swiggy and Starbucks transactions to emergency mutual funds yields ₹2,400 monthly. compounds to <strong className="text-brand-green">₹4.8L</strong> in 10 years!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Scrollable List */}
        <div className="mt-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
            <span className="text-xs font-bold text-gray-300 font-display">Recent Transaction Ledger</span>
            <div className="flex gap-1.5">
              {["All", "Food", "Shopping", "Luxury", "Bills"].map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`py-0.5 px-2 rounded-lg text-[10px] font-semibold transition-all ${
                    filterCategory === c
                      ? "bg-white/10 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
            {filteredTxns.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
                    {getCategoryIcon(t.category)}
                  </div>
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {t.merchant}
                      {t.is_impulse && (
                        <span className="text-[8px] bg-brand-pink/20 text-brand-pink px-1 rounded uppercase tracking-wider font-extrabold shrink-0 border border-brand-pink/30">
                          Impulse
                        </span>
                      )}
                    </h5>
                    <span className="text-[9px] text-gray-500 font-medium">{t.date} • {t.payment_method}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-extrabold ${t.type === "Credit" ? "text-brand-green" : "text-white"}`}>
                    {t.type === "Credit" ? "+" : "-"}₹{t.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-gray-600 block">{t.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SpendingIntelligence;
