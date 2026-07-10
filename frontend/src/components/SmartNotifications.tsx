import React, { useState } from "react";
import { Bell, ShieldAlert, ArrowUpRight, TrendingUp, X } from "lucide-react";

interface SmartNotificationsProps {
  onNotificationAction: (actionText: string) => void;
}

export const SmartNotifications: React.FC<SmartNotificationsProps> = ({ onNotificationAction }) => {
  const [alerts, setAlerts] = useState([
    {
      id: "N-1",
      title: "Compounding Arbitrage Opportunity",
      message: "Spend ₹2,000 less on dining/luxury this month and redirect it to SBI Small Cap SIP. Your retirement corpus increases by ₹9 Lakh.",
      actionText: "Increase SIP by ₹2000",
      query: "Show me what happens if I increase SIP by ₹2000",
      type: "opportunity",
      color: "border-brand-green/20 text-brand-green bg-brand-green/5"
    },
    {
      id: "N-2",
      title: "Emergency Fund Warning",
      message: "Your emergency fund runway is 4.2 months (Target: 6 months). At current spending rates, a job loss shock will exhaust your reserves in 18 weeks.",
      actionText: "Fix Emergency Runway",
      query: "How can I increase my emergency fund?",
      type: "warning",
      color: "border-brand-gold/20 text-brand-gold bg-brand-gold/5"
    },
    {
      id: "N-3",
      title: "Debt Optimization Recommendation",
      message: "You can safely increase your Mirae Asset Large Cap SIP by ₹3,000 using your recent broadband contract saving.",
      actionText: "Increase SIP by ₹3000",
      query: "What if I invest ₹3000 more monthly?",
      type: "opportunity",
      color: "border-brand-cyan/20 text-brand-cyan bg-brand-cyan/5"
    }
  ]);

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-pink" />
            Smart Coach Notifications
          </h3>
          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-gray-500">
            {alerts.length} Pending
          </span>
        </div>

        {/* Alerts list stack */}
        {alerts.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <Bell className="w-8 h-8 text-gray-600 mb-2" />
            <p className="text-xs text-gray-500 font-medium">All notifications cleared.</p>
            <p className="text-[10px] text-gray-600 mt-1">Excellent financial discipline levels recorded.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-left">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-2xl p-4 transition-all relative overflow-hidden flex flex-col justify-between ${alert.color}`}
              >
                {/* Dismiss button */}
                <button
                  onClick={(e) => handleDismiss(alert.id, e)}
                  className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
                  title="Dismiss Alert"
                >
                  <X className="w-3 h-3" />
                </button>

                <div className="pr-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5 leading-tight">
                    {alert.type === "warning" ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-brand-pink animate-pulse" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5 text-brand-green" />
                    )}
                    {alert.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed font-sans">
                    {alert.message}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => onNotificationAction(alert.query)}
                    className="py-1 px-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-semibold text-white flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>{alert.actionText}</span>
                    <ArrowUpRight className="w-3 h-3 text-brand-green" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default SmartNotifications;
