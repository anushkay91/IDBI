import React, { useState } from "react";
import { Users, Plus, Check } from "lucide-react";

export const FamilyWealth: React.FC = () => {
  const [members, setMembers] = useState([
    { name: "Kiran Kumar", relation: "Spouse", contribution: "Joint Account Holder", balance: 45000, goal: "Europe Vacation Share" },
    { name: "Aarav Kumar", relation: "Son", contribution: "Education Goal Beneficiary", balance: 400000, goal: "Undergrad Foreign Education" },
    { name: "Savitri Devi", relation: "Mother (Aged 68)", contribution: "Health Reserve Covered", balance: 100000, goal: "Critical Health Buffer" }
  ]);

  const nominees = [
    { name: "Kiran Kumar", share: "60%", asset: "Mutual Funds & Stocks", status: "Verified" },
    { name: "Aarav Kumar", share: "40%", asset: "Mutual Funds & Stocks", status: "Verified" },
    { name: "Savitri Devi", share: "100%", asset: "Fixed Deposits (FD-88902)", status: "Verified" }
  ];

  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelation, setNewMemberRelation] = useState("Spouse");

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;
    setMembers([
      ...members,
      {
        name: newMemberName,
        relation: newMemberRelation,
        contribution: "Secondary Nominee",
        balance: 0,
        goal: "Unallocated"
      }
    ]);
    setNewMemberName("");
    setShowAddMember(false);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col h-full justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg font-display tracking-wide text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-cyan" />
            Family Wealth Dashboard
          </h3>
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className="py-1 px-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-1 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Link Member
          </button>
        </div>

        {/* Add Member Form */}
        {showAddMember && (
          <form onSubmit={handleAddMember} className="bg-black/45 border border-white/10 rounded-2xl p-4 mb-4 text-left flex flex-col gap-2">
            <h4 className="text-xs font-bold text-white uppercase">Link Family Member Profile</h4>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-cyan flex-1"
              />
              <select
                value={newMemberRelation}
                onChange={(e) => setNewMemberRelation(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-cyan"
              >
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
              </select>
              <button type="submit" className="bg-brand-green text-black px-3 rounded-lg text-xs font-bold hover:bg-brand-green/90">
                Link
              </button>
            </div>
          </form>
        )}

        {/* Member cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 text-left">
          {members.map((member, idx) => (
            <div key={idx} className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-2xl p-4 transition-all flex flex-col justify-between h-[135px]">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-white leading-tight">{member.name}</h4>
                  <span className="text-[8px] bg-brand-purple/20 text-brand-purple px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold border border-brand-purple/30">
                    {member.relation}
                  </span>
                </div>
                <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide mt-1">{member.contribution}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5">
                <span className="text-[9px] text-gray-500 block uppercase font-medium">Synced Value / Goal Allocation</span>
                <div className="flex justify-between items-baseline mt-0.5">
                  <span className="text-xs font-extrabold text-white">₹{member.balance.toLocaleString('en-IN')}</span>
                  <span className="text-[9px] text-gray-400 truncate max-w-[100px]">{member.goal}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nominee completeness checklist */}
        <div className="text-left mt-4 pt-4 border-t border-white/5">
          <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 font-display">
            Nominee Registration Registry
          </h4>
          <div className="flex flex-col gap-2 max-h-[120px] overflow-y-auto">
            {nominees.map((nominee, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.01] border border-white/5">
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {nominee.name}
                    <span className="text-[9px] text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded font-extrabold flex items-center gap-0.5 border border-brand-green/20">
                      <Check className="w-2.5 h-2.5" /> Verified
                    </span>
                  </h5>
                  <span className="text-[9px] text-gray-500 uppercase font-semibold">{nominee.asset}</span>
                </div>
                <span className="text-xs font-bold text-white">
                  {nominee.share} Share
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FamilyWealth;
