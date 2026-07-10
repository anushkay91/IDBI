import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UserCheck,
  Target,
  Sliders,
  ShieldCheck,
  Users,
  BookOpen,
  Award,
  Sun,
  Moon,
  Send,
  Percent,
  RefreshCw
} from "lucide-react";

// Import custom components
import Avatar from "./components/Avatar";
import WealthScore from "./components/WealthScore";
import AgentOrchestratorView from "./components/AgentOrchestratorView";
import WhatIfSimulator from "./components/WhatIfSimulator";
import SpendingIntelligence from "./components/SpendingIntelligence";
import PortfolioOptimizer from "./components/PortfolioOptimizer";
import DigitalTwin from "./components/DigitalTwin";
import GoalPlanner from "./components/GoalPlanner";
import FinancialTimeline from "./components/FinancialTimeline";
import FamilyWealth from "./components/FamilyWealth";
import FraudProtection from "./components/FraudProtection";
import FinancialEducator from "./components/FinancialEducator";
import Gamification from "./components/Gamification";
import SmartNotifications from "./components/SmartNotifications";
import { API_BASE_URL } from "./config";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "twin" | "goals" | "sandbox" | "rebalance" | "fraud" | "learn" | "family" | "rewards"
  >("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // App API data states
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Conversational states
  const [chatQuery, setChatQuery] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "artha"; text: string }[]>([
    { sender: "artha", text: "Welcome, Rajesh! I am ARTHA, your Personal Digital Wealth Avatar. I've audited your UPI accounts, active SIPs, and mutual funds. How can I guide you today?" }
  ]);
  const [avatarStatus, setAvatarStatus] = useState<"neutral" | "thinking" | "speaking" | "listening" | "warning" | "smiling">("neutral");
  const [spokenResponse, setSpokenResponse] = useState("");
  const [thoughtHistory, setThoughtHistory] = useState<any[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState<string | undefined>(undefined);

  // Fetch Dashboard data on mount
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard`);
      if (!response.ok) throw new Error("Dashboard API offline");
      const data = await response.json();
      setDashboardData(data);
    } catch (e) {
      console.error("Dashboard backend connection failed. Generating local mock fallback.", e);
      // Generate fallbacks matching Python models
      generateLocalDashboardFallback();
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalDashboardFallback = () => {
    const profile = {
      name: "Rajesh Kumar",
      age: 34,
      profession: "Lead Software Architect",
      monthly_income: 175000,
      savings_rate: 35.5,
      risk_appetite: "Moderate",
      net_worth: 1618750,
      liquid_cash: 142500,
      total_invested: 666000,
      total_debt: 4272450,
      emergency_fund_months: 4.2,
      family_members: 4,
      discipline_score: 82,
      wealth_score: 745
    };

    const transactions = [
      { id: "TXN-0001", date: "2026-07-10 14:15", amount: 450, merchant: "Swiggy", category: "Food", type: "Debit", payment_method: "UPI", is_impulse: false },
      { id: "TXN-0002", date: "2026-07-10 09:30", amount: 1200, merchant: "Amazon", category: "Shopping", type: "Debit", payment_method: "Credit Card", is_impulse: true },
      { id: "TXN-0003", date: "2026-07-09 20:45", amount: 280, merchant: "Starbucks Coffee", category: "Luxury", type: "Debit", payment_method: "UPI", is_impulse: true },
      { id: "TXN-0004", date: "2026-07-08 11:20", amount: 1500, merchant: "Shell Petrol", category: "Fuel", type: "Debit", payment_method: "Debit Card", is_impulse: false },
      { id: "TXN-0005", date: "2026-07-05 08:00", amount: 35000, merchant: "Rent Payment", category: "Bills", type: "Debit", payment_method: "IMPS", is_impulse: false },
      { id: "TXN-SAL-01", date: "2026-07-01 09:00", amount: 175000, merchant: "TechCorp IT Solutions", category: "Salary", type: "Credit", payment_method: "IMPS", is_impulse: false }
    ];

    const mutual_funds = [
      { name: "Parag Parikh Flexi Cap Fund Direct-Growth", category: "Large & Mid Cap / Flexi", sip_amount: 15000, invested_value: 250000, current_value: 310000, units: 4960, nav: 62.5 },
      { name: "Mirae Asset Large Cap Fund Direct-Growth", category: "Large Cap", sip_amount: 10000, invested_value: 180000, current_value: 220000, units: 2115.38, nav: 104 },
      { name: "SBI Small Cap Fund Direct-Growth", category: "Small Cap", sip_amount: 5000, invested_value: 70000, current_value: 85000, units: 566.66, nav: 150 }
    ];

    const stocks = [
      { ticker: "HDFCBANK", name: "HDFC Bank Ltd", shares: 45, avg_price: 1444, current_price: 1620, current_value: 72900 },
      { ticker: "RELIANCE", name: "Reliance Industries Ltd", shares: 35, avg_price: 2450, current_price: 2850, current_value: 99750 }
    ];

    const fds = [
      { id: "FD-88902", principal: 150000, interest_rate: 7.1, maturity_date: "2027-11-15", current_value: 158200 },
      { id: "FD-88905", principal: 100000, interest_rate: 7.25, maturity_date: "2028-06-20", current_value: 101800 }
    ];

    const detailed_score = {
      score: 745,
      breakdown: {
        savings_rate: { score: 133, max: 150, value: "35.5%" },
        discipline: { score: 123, max: 150, value: "82/100" },
        emergency_fund: { score: 105, max: 150, value: "4.2 Months" },
        debt_ratio: { score: 150, max: 150, value: "32.5% EMI/Inc" },
        diversification: { score: 70, max: 100, value: "Max 46%" },
        insurance: { score: 100, max: 100, value: "Fully Protected" },
        retirement: { score: 66, max: 100, value: "₹10,000/mo SIP" },
        goal_progress: { score: 55, max: 100, value: "41.2% met" }
      }
    };

    setDashboardData({
      profile,
      transactions,
      mutual_funds,
      stocks,
      fds,
      liquid_gold: 50000,
      wealth_score_details: detailed_score,
      debts: {
        home_loan: { provider: "SBI Home Finance", outstanding: 3800000, emi: 45000, interest_rate: 8.4 },
        car_loan: { provider: "ICICI Bank Car Loan", outstanding: 450000, emi: 12000, interest_rate: 9.2 }
      }
    });
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  };

  const triggerChatQuery = async (query: string) => {
    if (!query.trim()) return;
    
    // Add user query to chat logs
    setChatLog((prev) => [...prev, { sender: "user", text: query }]);
    setChatQuery("");
    setIsChatLoading(true);
    setAvatarStatus("thinking");
    setThoughtHistory([]);

    // Simulate Agent Step-by-step thinking lights
    const agentSequence = ["A1", "A4", "A6", "A3", "A2", "A7", "A8", "A9"];
    let seqIdx = 0;
    const interval = setInterval(() => {
      if (seqIdx < agentSequence.length) {
        setActiveAgentId(agentSequence[seqIdx]);
        seqIdx++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error("Chat engine offline");
      const data = await response.json();
      
      clearInterval(interval);
      setActiveAgentId(undefined);
      
      setChatLog((prev) => [...prev, { sender: "artha", text: data.final_response }]);
      setThoughtHistory(data.thought_history);
      setSpokenResponse(data.final_response);
      setAvatarStatus("speaking");
      setTimeout(() => setAvatarStatus("neutral"), 5000);
      
    } catch (e) {
      console.error("Local fallback for Agent Orchestrator logs", e);
      clearInterval(interval);
      setActiveAgentId(undefined);

      // Local chatbot logic fallback
      setTimeout(() => {
        let finalResponse = "";
        let mockThoughts = [];

        const queryLower = query.toLowerCase();

        if (queryLower.includes("score")) {
          finalResponse = "Your Wealth Score is 745. Move ₹1L lazy cash to Mutual Funds to increase score to 810 instantly.";
          mockThoughts = [
            { agent_id: "A1", agent_name: "Customer Profile", role: "Metrics Analysis", status: "completed", message: "Evaluating savings rate & emergency levels." },
            { agent_id: "A4", agent_name: "Risk Analyzer", role: "Hedge Auditing", status: "completed", message: "Emergency buffer is below 6 months." },
            { agent_id: "A2", agent_name: "Investment Advisor", role: "Rebalancer", status: "completed", message: "Suggested transfer of ₹1 Lakh to Liquid Mutual Fund." }
          ];
        } else if (queryLower.includes("retire")) {
          finalResponse = "Retiring at 50 requires ₹5.2 Cr inflated target. Bridge your ₹2.1 Cr gap by increasing your SIP by ₹18.5k/month.";
          mockThoughts = [
            { agent_id: "A3", agent_name: "Goal Planner", role: "Compound Calculations", status: "completed", message: "Evaluated 16 year timeframe. Current trajectory hits ₹3.1 Cr." },
            { agent_id: "A7", agent_name: "Behavior Prediction", role: "Cash flow analysis", status: "completed", message: "Identified savings leaks from Swiggy & luxury purchases." }
          ];
        } else if (queryLower.includes("fraud") || queryLower.includes("spam")) {
          finalResponse = "ARTHA Shield state: SECURE. Locked spam Collect mandate of ₹5,000 from pay-quick@upi last week.";
          mockThoughts = [
            { agent_id: "A5", agent_name: "Fraud Detector", role: "Signature audits", status: "completed", message: "UPI collects matches threat metadata. Flagged merchant blocked." }
          ];
        } else {
          finalResponse = "Hello Rajesh! The ARTHA agents have processed your request. How else can I assist with your Indian bank accounts today?";
          mockThoughts = [
            { agent_id: "A1", agent_name: "Customer Profile", role: "Demographic Sync", status: "completed", message: "Synchronized IT architect profile parameters." }
          ];
        }

        setChatLog((prev) => [...prev, { sender: "artha", text: finalResponse }]);
        setThoughtHistory(mockThoughts);
        setSpokenResponse(finalResponse);
        setAvatarStatus("speaking");
        setTimeout(() => setAvatarStatus("neutral"), 5000);
      }, 1500);

    } finally {
      setIsChatLoading(false);
    }
  };

  // Navigations sidebar mapping
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "twin", label: "Digital Twin", icon: <UserCheck className="w-5 h-5" /> },
    { id: "goals", label: "Goal Planner", icon: <Target className="w-5 h-5" /> },
    { id: "sandbox", label: "What-If Sandbox", icon: <Sliders className="w-5 h-5" /> },
    { id: "rebalance", label: "Portfolio Optimizer", icon: <Percent className="w-5 h-5" /> },
    { id: "fraud", label: "Security Shield", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: "learn", label: "Academy Learn", icon: <BookOpen className="w-5 h-5" /> },
    { id: "family", label: "Family Wealth", icon: <Users className="w-5 h-5" /> },
    { id: "rewards", label: "Streaks & Quests", icon: <Award className="w-5 h-5" /> }
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-dark-text-primary transition-all duration-300">
      
      {/* Header Bar */}
      <header className="glass-panel border-b border-white/5 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-green to-brand-cyan rounded-2xl flex items-center justify-center font-display font-black text-black shadow-lg shadow-brand-green/20">
            A
          </div>
          <div className="text-left">
            <h1 className="text-lg font-bold font-display text-white tracking-wide leading-none m-0">
              ARTHA AI
            </h1>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 block">
              Personal Wealth Avatar • IDBI Bank
            </span>
          </div>
        </div>

        {/* Global Net Worth & Theme Toggle */}
        <div className="flex items-center gap-6">
          {dashboardData && (
            <div className="hidden sm:block text-right">
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Estimated Net Worth</span>
              <span className="text-base font-extrabold text-brand-green font-display block mt-0.5">
                ₹{dashboardData.profile.net_worth.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Toggle Light/Dark Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-brand-gold" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
              RK
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto p-4 gap-4 box-border">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-[240px] flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible shrink-0 pb-2 lg:pb-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-max lg:w-full py-3 px-4 rounded-xl flex items-center gap-3 font-semibold text-xs font-display border transition-all justify-start shrink-0 cursor-pointer ${
                activeTab === item.id
                  ? "bg-brand-green text-black border-brand-green shadow-lg shadow-brand-green/10"
                  : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Render Area */}
        <main className="flex-1 min-w-0 flex flex-col gap-4">
          {isLoading ? (
            <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center gap-3 h-[500px]">
              <RefreshCw className="w-8 h-8 text-brand-green animate-spin" />
              <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider font-display">
                Calibrating Digital Twin & Syncing Ledger...
              </p>
            </div>
          ) : (
            <>
              {/* Tab: Dashboard (Primary View) */}
              {activeTab === "dashboard" && dashboardData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Wealth Score */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <WealthScore
                      score={dashboardData.profile.wealth_score}
                      breakdown={dashboardData.wealth_score_details.breakdown}
                      onImproveClick={triggerChatQuery}
                    />
                  </div>

                  {/* Smart Notifications Stack */}
                  <div>
                    <SmartNotifications onNotificationAction={triggerChatQuery} />
                  </div>

                  {/* Spending Intelligence */}
                  <div>
                    <SpendingIntelligence transactions={dashboardData.transactions} onAddQuery={triggerChatQuery} />
                  </div>

                  {/* Portfolio Growth / Optimizations */}
                  <div>
                    <PortfolioOptimizer currentRisk={dashboardData.profile.risk_appetite} />
                  </div>

                  {/* Timeline Projections */}
                  <div className="md:col-span-2">
                    <FinancialTimeline
                      netWorth={dashboardData.profile.net_worth}
                      totalDebt={dashboardData.profile.total_debt}
                      totalInvested={dashboardData.profile.total_invested}
                    />
                  </div>
                </div>
              )}

              {/* Tab: Digital Twin */}
              {activeTab === "twin" && dashboardData && (
                <DigitalTwin profile={dashboardData.profile} />
              )}

              {/* Tab: Goals Planner */}
              {activeTab === "goals" && (
                <GoalPlanner />
              )}

              {/* Tab: Sandbox What If */}
              {activeTab === "sandbox" && (
                <WhatIfSimulator />
              )}

              {/* Tab: Rebalance optimizer */}
              {activeTab === "rebalance" && dashboardData && (
                <PortfolioOptimizer currentRisk={dashboardData.profile.risk_appetite} />
              )}

              {/* Tab: Fraud logs */}
              {activeTab === "fraud" && (
                <FraudProtection />
              )}

              {/* Tab: Academic Explanations */}
              {activeTab === "learn" && (
                <FinancialEducator onAskCoach={triggerChatQuery} />
              )}

              {/* Tab: Family portfolio */}
              {activeTab === "family" && (
                <FamilyWealth />
              )}

              {/* Tab: Gamification Streaks */}
              {activeTab === "rewards" && (
                <Gamification />
              )}
            </>
          )}
        </main>

        {/* Right-Hand Assistant Drawer */}
        <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-4">
          
          {/* Avatar Controller */}
          <Avatar
            status={avatarStatus}
            textSpeech={spokenResponse}
            onVoiceCommand={triggerChatQuery}
          />

          {/* Interactive Chat interface */}
          <div className="glass-panel rounded-3xl p-5 flex-1 flex flex-col justify-between min-h-[300px] max-h-[420px] overflow-hidden">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2 font-display text-left">
              Avatar Chat Session
            </span>
            
            {/* Scrollable Dialogue */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 my-2 pr-1 max-h-[220px]">
              {chatLog.map((chat, idx) => (
                <div
                  key={idx}
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed text-left ${
                    chat.sender === "user"
                      ? "ml-auto bg-brand-purple/20 border border-brand-purple/35 text-white"
                      : "mr-auto bg-white/5 border border-white/5 text-gray-300"
                  }`}
                >
                  <p className="m-0 font-sans">{chat.text}</p>
                </div>
              ))}
              {isChatLoading && (
                <div className="mr-auto bg-white/5 border border-white/5 rounded-2xl p-3 text-xs text-gray-500 flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: "0s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: "0.4s" }} />
                  <span>Agents orchestrating consensus...</span>
                </div>
              )}
            </div>

            {/* Orchestrator Nodes Debugger inline if active */}
            {thoughtHistory.length > 0 && (
              <div className="border-t border-white/5 pt-2 mt-1">
                <AgentOrchestratorView
                  thoughtHistory={thoughtHistory}
                  isThinking={isChatLoading}
                  activeAgentId={activeAgentId}
                />
              </div>
            )}

            {/* Form Input */}
            <div className="flex gap-2 border-t border-white/5 pt-3.5 z-10">
              <input
                type="text"
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") triggerChatQuery(chatQuery); }}
                placeholder="Ask ARTHA e.g. How to save tax?"
                disabled={isChatLoading}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-green focus:bg-white/[0.08] transition-all"
              />
              <button
                onClick={() => triggerChatQuery(chatQuery)}
                disabled={isChatLoading}
                className="p-2.5 rounded-xl bg-brand-green text-black hover:bg-brand-green/90 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};
export default App;
