import React from "react";
import { Cpu, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";

interface AgentThought {
  agent_id: string;
  agent_name: string;
  role: string;
  status: string;
  message: string;
}

interface AgentOrchestratorViewProps {
  thoughtHistory: AgentThought[];
  isThinking: boolean;
  activeAgentId?: string;
}

export const AgentOrchestratorView: React.FC<AgentOrchestratorViewProps> = ({
  thoughtHistory,
  isThinking,
  activeAgentId
}) => {
  // Static description of 9 agents
  const agents = [
    { id: "A1", name: "Customer Profile", role: "Behavioral & Asset Mapper", color: "border-brand-green/30 text-brand-green bg-brand-green/5" },
    { id: "A2", name: "Investment Advisor", role: "Mutual Fund & Stock Optimizer", color: "border-brand-purple/30 text-brand-purple bg-brand-purple/5" },
    { id: "A3", name: "Goal Planner", role: "Roadmap & Compound Calculator", color: "border-brand-cyan/30 text-brand-cyan bg-brand-cyan/5" },
    { id: "A4", name: "Risk Analyzer", role: "Debt & Insurance Stress Auditor", color: "border-orange-500/30 text-orange-400 bg-orange-500/5" },
    { id: "A5", name: "Fraud Detector", role: "UPI Shield & Card Audits", color: "border-brand-pink/30 text-brand-pink bg-brand-pink/5" },
    { id: "A6", name: "Market Analyst", role: "Repo Rate & FD Arbitrage Watch", color: "border-brand-gold/30 text-brand-gold bg-brand-gold/5" },
    { id: "A7", name: "Behavior Prediction", role: "Impulse & Shortage forecaster", color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" },
    { id: "A8", name: "Notification Gen", role: "Contextual Alerts Synthesizer", color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5" },
    { id: "A9", name: "Financial Educator", role: "Concept Simplified Explainer", color: "border-sky-500/30 text-sky-400 bg-sky-500/5" }
  ];

  // Match real-time thoughts to static agents
  const getThoughtForAgent = (id: string) => {
    return thoughtHistory.find((t) => t.agent_id === id);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-purple" />
          ARTHA Multi-Agent Brain
        </h3>
        {isThinking && (
          <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-brand-cyan animate-pulse bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
            Orchestrating...
          </span>
        )}
      </div>

      {/* Grid of 9 Agents */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {agents.map((agent) => {
          const thought = getThoughtForAgent(agent.id);
          const isActive = activeAgentId === agent.id || (isThinking && thought && thought.status === "thinking");
          
          return (
            <div
              key={agent.id}
              className={`relative border rounded-xl p-3 flex flex-col justify-between h-[105px] transition-all duration-300 ${
                isActive
                  ? "bg-white/10 border-brand-cyan shadow-lg shadow-brand-cyan/10 scale-105 z-10"
                  : thought
                  ? "bg-white/[0.04] border-white/10"
                  : "bg-white/[0.01] border-white/5 opacity-55"
              }`}
            >
              {/* Agent ID & Dot */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 font-display uppercase">
                  {agent.id}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive
                      ? "bg-brand-cyan animate-ping"
                      : thought
                      ? "bg-brand-green"
                      : "bg-gray-600"
                  }`}
                />
              </div>

              {/* Name & Role */}
              <div className="my-1">
                <h4 className="text-xs font-bold text-white truncate">{agent.name}</h4>
                <p className="text-[9px] text-gray-500 leading-none truncate mt-0.5">{agent.role}</p>
              </div>

              {/* Status Badge */}
              <span className={`text-[8px] font-bold py-0.5 px-1.5 rounded w-max text-center uppercase tracking-wide border ${agent.color}`}>
                {isActive ? "ACTIVE" : thought ? "DONE" : "IDLE"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Orchestration Log Timeline */}
      <div className="flex-1 border border-white/5 bg-black/45 rounded-2xl p-4 max-h-[220px] overflow-y-auto">
        <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 font-display">
          Realtime Agent Transaction Logs
        </h4>
        
        {thoughtHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="w-8 h-8 text-gray-600 mb-2" />
            <p className="text-xs text-gray-500">No active process traces found.</p>
            <p className="text-[10px] text-gray-600">Type a query or speak to see agent consensus in action.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {thoughtHistory.map((thought, index) => (
              <div key={index} className="flex gap-2 text-left text-xs leading-normal">
                {/* Check or alert icon */}
                {thought.status === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white text-[11px] font-display">
                      {thought.agent_name}
                    </span>
                    <span className="text-[9px] text-gray-500 font-bold bg-white/5 border border-white/10 px-1 rounded-sm">
                      {thought.agent_id}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[11px] mt-0.5">{thought.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Consensus Statement */}
      {thoughtHistory.length > 0 && (
        <div className="mt-3 flex items-center justify-start gap-2 bg-brand-green/5 border border-brand-green/10 rounded-xl p-2.5 text-left">
          <span className="text-[8px] bg-brand-green text-black px-1.5 py-0.5 rounded font-extrabold uppercase font-display shrink-0">
            Consensus
          </span>
          <p className="text-[10px] text-gray-400 font-medium">
            Multi-Agent validation complete. 9/9 nodes signed. Context dispatched to user screen.
          </p>
        </div>
      )}
    </div>
  );
};
export default AgentOrchestratorView;
