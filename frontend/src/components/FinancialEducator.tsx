import React, { useState } from "react";
import { BookOpen, GraduationCap, ChevronRight, HelpCircle } from "lucide-react";

export const FinancialEducator: React.FC<{ onAskCoach: (q: string) => void }> = ({ onAskCoach }) => {
  const [activeStory, setActiveStory] = useState<number | null>(null);

  const stories = [
    {
      title: "The Compounding Magic of SIP",
      desc: "How investing ₹5,000 monthly turns into ₹56 Lakhs.",
      content: "Instead of trying to time the Indian stock market, Rupee Cost Averaging lets you purchase more mutual fund units when prices are low and fewer when they are high. Under 12% average returns, a ₹5,000 monthly SIP creates a ₹56.4L corpus in 20 years, while total principal invested is just ₹12 Lakhs! Over 75% of your future wealth is lazy compounding interest.",
      concept: "Rupee Cost Averaging & Compounding",
      query: "Show me how a ₹5000 monthly SIP compounds in 15 years"
    },
    {
      title: "Inflation vs Fixed Deposits",
      desc: "Why keeping money in savings accounts actually loses value.",
      content: "If your savings account yields 3.5% interest and inflation in India averages 6.0%, your wealth is shrinking in purchasing power by 2.5% every year. A ₹1,00,000 cash stack today will buy only ₹80,000 worth of groceries in 4 years. Locking funds in FDs (7.2%) or mutual funds (11%+) is crucial to beat the inflation leak.",
      concept: "Real Rate of Return (Interest - Inflation)",
      query: "Explain real rate of return and inflation"
    },
    {
      title: "ELSS Mutual Funds (Section 80C)",
      desc: "Save up to ₹46,800 in taxes with a 3-year lock-in.",
      content: "Under Section 80C of the Income Tax Act (old regime), you can deduct up to ₹1.5 Lakhs from your taxable income. Equity Linked Savings Schemes (ELSS) have the shortest lock-in period (3 years) among all tax-saving instruments (PPF is 15 years, tax-saving FDs are 5 years), while providing higher equity exposure to compound your tax savings.",
      concept: "Tax Saving Mutual Funds & Lock-ins",
      query: "How do ELSS mutual funds save tax under Section 80C?"
    },
    {
      title: "Term Insurance vs Life Insurance Policies",
      desc: "Why pure protection plans beat savings-linked insurance.",
      content: "Traditional LIC plans combine insurance with low-yield savings, generating barely 5% returns. Pure Term Insurance (e.g. ₹1.5 Crore sum assured) has extremely cheap premium rates (~₹1,500/month) and protects your family fully, allowing you to invest the remaining cash in mutual funds for double the yields.",
      concept: "Separating Insurance from Investments",
      query: "Why is pure term insurance better than traditional policies?"
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-cyan" />
            AI Financial Academy
          </h3>
          <span className="text-[10px] bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 px-2 py-0.5 rounded-full font-bold uppercase font-display">
            Interactive Stories
          </span>
        </div>

        {/* Stories list */}
        <div className="flex flex-col gap-3 text-left">
          {stories.map((story, idx) => {
            const isOpen = activeStory === idx;
            return (
              <div
                key={idx}
                className="border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl p-4 transition-all"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setActiveStory(isOpen ? null : idx)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl text-brand-cyan shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-display leading-tight">{story.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-normal mt-0.5">{story.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-90 text-white" : ""}`} />
                </div>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-3">
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {story.content}
                    </p>
                    
                    <div className="flex items-center justify-between bg-black/35 rounded-xl p-2.5">
                      <div>
                        <span className="text-[8px] text-gray-500 uppercase block font-semibold">Core Principle</span>
                        <span className="text-[10px] font-bold text-white">{story.concept}</span>
                      </div>
                      
                      <button
                        onClick={() => onAskCoach(story.query)}
                        className="py-1 px-2.5 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-[10px] font-semibold text-brand-cyan hover:bg-brand-cyan/25 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" /> Ask Avatar
                      </button>
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
export default FinancialEducator;
