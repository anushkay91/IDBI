import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Lock, Unlock, Eye, RefreshCw, Check } from "lucide-react";

export const FraudProtection: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [cardsLocked, setCardsLocked] = useState(false);
  const [upiLocked, setUpiLocked] = useState(false);

  const securityLogs = [
    { title: "UPI collect mandate blocked", desc: "Blocked collect request of ₹5,000 from pay-quick@upi (phishing list).", date: "4 days ago", status: "blocked" },
    { title: "Terminal verification", desc: "Authorized debit card swipe matched device geolocation (Bangalore).", date: "Today, 14:22", status: "passed" },
    { title: "Phishing SMS detection", desc: "Scanned inbox metadata. 2 unverified bank SMS logs suppressed.", date: "Yesterday, 18:05", status: "passed" },
    { title: "SIP Auto-Debit audit", desc: "Matched mandates with RBI registry. All clear.", date: "July 02", status: "passed" }
  ];

  const handleScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => setScanComplete(false), 3000);
    }, 2000);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-green" />
            AI Fraud Protection Shield
          </h3>
          <span className="flex items-center gap-1 text-xs text-brand-green font-bold bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
            Shield Active
          </span>
        </div>

        {/* Big Alert Panel */}
        <div className="bg-brand-green/5 border border-brand-green/20 rounded-2xl p-4 text-center my-4">
          <ShieldCheck className="w-12 h-12 text-brand-green mx-auto mb-2 animate-pulse" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">System State: Secure</h4>
          <p className="text-[10px] text-gray-500 max-w-[280px] mx-auto mt-1 leading-relaxed">
            ARTHA Shield is checking token handshakes, login devices, and UPI signatures.
          </p>
        </div>

        {/* Lock Controls */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => setCardsLocked(!cardsLocked)}
            className={`py-3 px-4 rounded-xl font-semibold text-xs font-display border transition-all flex items-center justify-center gap-2 ${
              cardsLocked
                ? "bg-brand-pink/20 border-brand-pink text-brand-pink"
                : "bg-white/5 border-white/15 text-gray-300 hover:bg-white/10"
            }`}
          >
            {cardsLocked ? <Lock className="w-3.5 h-3.5 animate-pulse" /> : <Unlock className="w-3.5 h-3.5 text-brand-green" />}
            <span>{cardsLocked ? "Cards Locked" : "Lock All Cards"}</span>
          </button>
          
          <button
            onClick={() => setUpiLocked(!upiLocked)}
            className={`py-3 px-4 rounded-xl font-semibold text-xs font-display border transition-all flex items-center justify-center gap-2 ${
              upiLocked
                ? "bg-brand-pink/20 border-brand-pink text-brand-pink"
                : "bg-white/5 border-white/15 text-gray-300 hover:bg-white/10"
            }`}
          >
            {upiLocked ? <Lock className="w-3.5 h-3.5 animate-pulse" /> : <Unlock className="w-3.5 h-3.5 text-brand-cyan" />}
            <span>{upiLocked ? "UPI Disabled" : "Disable UPI"}</span>
          </button>
        </div>

        {/* Audits / Alerts Ledger */}
        <div className="text-left mt-2">
          <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 font-display">
            Fraud Protection Audits
          </h4>
          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
            {securityLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2.5 items-start p-3 bg-white/[0.01] border border-white/5 rounded-2xl">
                <div className={`p-1.5 rounded-lg shrink-0 ${log.status === 'blocked' ? 'bg-brand-pink/10 border border-brand-pink/25 text-brand-pink' : 'bg-white/5 border border-white/10 text-brand-green'}`}>
                  {log.status === 'blocked' ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5 justify-between">
                    {log.title}
                    <span className="text-[8px] text-gray-600 font-bold shrink-0">{log.date}</span>
                  </h5>
                  <p className="text-[10px] text-gray-500 leading-normal mt-0.5">{log.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Scan Button */}
      <div className="mt-5 border-t border-white/5 pt-4">
        {scanComplete ? (
          <div className="w-full py-3 rounded-xl bg-brand-green/20 border border-brand-green text-brand-green font-semibold text-xs flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Audit Passed. Threat Index: 0%</span>
          </div>
        ) : (
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold text-xs font-display flex items-center justify-center gap-2 transition-all"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-green" />
                <span>Scanning tokens & API signatures...</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Run Rapid Threat Audit</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
export default FraudProtection;
