from typing import List, Dict, Any
from pydantic import BaseModel

class AgentThought(BaseModel):
    agent_id: str
    agent_name: str
    role: str
    status: str  # thinking, completed, warning
    message: str

class OrchestrationResult(BaseModel):
    query: str
    final_response: str
    thought_history: List[AgentThought]

class AIWealthAgent:
    def __init__(self, agent_id: str, name: str, role: str):
        self.agent_id = agent_id
        self.name = name
        self.role = role

    def process(self, query: str, context: Dict[str, Any]) -> AgentThought:
        raise NotImplementedError("Implement processing logic.")

class CustomerProfileAgent(AIWealthAgent):
    def __init__(self):
        super().__init__("A1", "Customer Profile Agent", "Analyzes financial behaviors, demographics, and active accounts.")

    def process(self, query: str, context: Dict[str, Any]) -> AgentThought:
        profile = context["profile"]
        return AgentThought(
            agent_id=self.agent_id,
            agent_name=self.name,
            role=self.role,
            status="completed",
            message=f"Analyzed {profile.name}'s profile. Age: {profile.age}, Lead Software Architect. Monthly salary: ₹{profile.monthly_income:,.0f}. Net Worth: ₹{profile.net_worth:,.0f}. Monthly EMI commitments stand at ₹57,000 (~32.5% of income)."
        )

class InvestmentAdvisorAgent(AIWealthAgent):
    def __init__(self):
        super().__init__("A2", "Investment Advisor", "Recommends asset allocation, equity/debt mutual funds, and FDs.")

    def process(self, query: str, context: Dict[str, Any]) -> AgentThought:
        profile = context["profile"]
        risk = profile.risk_appetite
        return AgentThought(
            agent_id=self.agent_id,
            agent_name=self.name,
            role=self.role,
            status="completed",
            message=f"Evaluated portfolio under risk profile '{risk}'. Recommending rebalancing: Current stock allocation is high ({round(sum(s.current_value for s in context['stocks'])/profile.total_invested*100)}%). Suggest transferring ₹50,000 from digital gold/cash reserves to Parag Parikh Flexi Cap Fund to streamline equity return vectors."
        )

class GoalPlannerAgent(AIWealthAgent):
    def __init__(self):
        super().__init__("A3", "Goal Planner", "Projects savings rates, SIP goals, and inflation-adjusted targets.")

    def process(self, query: str, context: Dict[str, Any]) -> AgentThought:
        goals = context["goals"]
        retire_goal = next((g for g in goals if g.category == "Retirement"), None)
        edu_goal = next((g for g in goals if g.category == "Education"), None)
        
        msg = "Evaluating goal timelines. "
        if retire_goal:
            msg += f"Retirement target is ₹{retire_goal.target_amount/10000000:.1f} Crore in {retire_goal.timeframe_years} years. "
        if edu_goal:
            msg += f"Child's foreign education requires ₹{edu_goal.target_amount/100000:.1f} Lakh in {edu_goal.timeframe_years} years. SIP allocations are currently short by ₹12,500/month to guarantee success."
            
        return AgentThought(
            agent_id=self.agent_id,
            agent_name=self.name,
            role=self.role,
            status="completed",
            message=msg
        )

class RiskAnalyzerAgent(AIWealthAgent):
    def __init__(self):
        super().__init__("A4", "Risk Analyzer", "Tests debt stress, coverage adequacy, and volatility exposure.")

    def process(self, query: str, context: Dict[str, Any]) -> AgentThought:
        debts = context["debts"]
        insurance = context["insurance"]
        profile = context["profile"]
        
        term_amt = insurance["term"]["sum_insured"]
        health_amt = insurance["health"]["sum_insured"]
        debt_level = profile.total_debt
        
        warn = ""
        if debt_level > 4000000.0:
            warn = " High outstanding debt (Home + Car loan) totaling ₹42.5L. "
            
        return AgentThought(
            agent_id=self.agent_id,
            agent_name=self.name,
            role=self.role,
            status="completed",
            message=f"Risk audit passed.{warn}Insurance coverage is excellent: Term cover is ₹1.5 Cr (8.5x net worth) and Health Cover is ₹1 Cr (multi-flier plan). Volatility index is moderate."
        )

class FraudDetectorAgent(AIWealthAgent):
    def __init__(self):
        super().__init__("A5", "Fraud Detector", "Monitors for suspicious activity, phishing, and UPI fraud vectors.")

    def process(self, query: str, context: Dict[str, Any]) -> AgentThought:
        return AgentThought(
            agent_id=self.agent_id,
            agent_name=self.name,
            role=self.role,
            status="completed",
            message="Fraud scanner initialized. Checked last 50 transactions. No active phishing signatures or high-risk unknown merchant approvals found. Credit card limits are secure."
        )

class MarketAnalystAgent(AIWealthAgent):
    def __init__(self):
        super().__init__("A6", "Market Analyst", "Tracks benchmark indices, repo rates, inflation, and FD rate changes.")

    def process(self, query: str, context: Dict[str, Any]) -> AgentThought:
        return AgentThought(
            agent_id=self.agent_id,
            agent_name=self.name,
            role=self.role,
            status="completed",
            message="Market Intelligence: RBI keeps Repo Rate stable at 6.50%. CPI Inflation averages 5.1%. Nifty 50 PE ratio is 22.1 (fair valuation). FD rates at IDBI Bank peak at 7.25% for 3 years - locked-in arbitrage opportunity for conservative reserves."
        )

class BehaviorPredictionAgent(AIWealthAgent):
    def __init__(self):
        super().__init__("A7", "Behavior Prediction", "Models monthly spending habits, impulse buying, and savings leakage.")

    def process(self, query: str, context: Dict[str, Any]) -> AgentThought:
        txns = context["transactions"]
        impulse_txns = [t for t in txns if t.is_impulse]
        impulse_sum = sum(t.amount for t in impulse_txns)
        
        return AgentThought(
            agent_id=self.agent_id,
            agent_name=self.name,
            role=self.role,
            status="completed",
            message=f"Predictive Analytics: Detected ₹{impulse_sum:,.0f} of impulse purchases last month, primarily on luxury dining and Amazon sales. Over-spending trend on weekends risks dropping next month's savings rate to 32%."
        )

class NotificationGeneratorAgent(AIWealthAgent):
    def __init__(self):
        super().__init__("A8", "Notification Generator", "Translates agent results into actionable, contextual insights.")

    def process(self, query: str, context: Dict[str, Any]) -> AgentThought:
        return AgentThought(
            agent_id=self.agent_id,
            agent_name=self.name,
            role=self.role,
            status="completed",
            message="Smart Notification Generated: 'Redirect ₹4,000 from dining buffer to Small Cap SIP this weekend to recover your child education timeline by 6 months.'"
        )

class FinancialEducatorAgent(AIWealthAgent):
    def __init__(self):
        super().__init__("A9", "Financial Educator", "Simplifies concepts like compounding, inflation, and equity risks.")

    def process(self, query: str, context: Dict[str, Any]) -> AgentThought:
        return AgentThought(
            agent_id=self.agent_id,
            agent_name=self.name,
            role=self.role,
            status="completed",
            message="Educational context loaded: Explaining the 'Rule of 72' for compounding and the impact of 6% inflation on cash holdings. Educating customer on long-term rupee cost averaging via SIP."
        )


class AgentOrchestrator:
    def __init__(self):
        self.agents = [
            CustomerProfileAgent(),
            InvestmentAdvisorAgent(),
            GoalPlannerAgent(),
            RiskAnalyzerAgent(),
            FraudDetectorAgent(),
            MarketAnalystAgent(),
            BehaviorPredictionAgent(),
            NotificationGeneratorAgent(),
            FinancialEducatorAgent()
        ]

    def run(self, query: str, context: Dict[str, Any]) -> OrchestrationResult:
        query_lower = query.lower()
        thought_history = []
        
        # Determine activation order and messages based on query type
        # For this prototype, all agents are run to show the massive multi-agent flow, but they prioritize their outputs
        for agent in self.agents:
            thought = agent.process(query, context)
            
            # Context-specific thought adjustment
            if "score" in query_lower and agent.agent_id == "A1":
                thought.message = "Analyzing score inputs: Debt-to-income, SIP discipline, and emergency runway."
            elif "score" in query_lower and agent.agent_id == "A2":
                thought.message = "To improve score, suggest moving ₹1.4L liquid cash to arbitrage funds to boost yield vector."
            elif "retire" in query_lower and agent.agent_id == "A3":
                thought.message = "Running simulations: Retiring at 50 requires ₹5.2 Cr inflated target. Current SIP path yields ₹3.1 Cr."
            elif "fraud" in query_lower and agent.agent_id == "A5":
                thought.message = "UPI shield active: Scanned payment headers. Detected 1 suspicious spam mandate last week (Blocked)."
            elif "sip" in query_lower and agent.agent_id == "A2":
                thought.message = "SIP recommendation: Increase SBI Small Cap by ₹3,000. Compounding raises future net worth by ₹12 Lakhs."
            
            thought_history.append(thought)
            
        # Assemble cohesive final response
        if "score" in query_lower:
            final_response = (
                "Your current AI Wealth Score is **745/1000** (Very Good). You score high on Insurance (100/100) "
                "and Debt Management (150/150). However, you have room to improve in **Diversification** (currently heavy "
                "on real estate debt and cash) and **Emergency Fund runway** (currently at 4.2 months, target 6 months). "
                "Increasing your SIP by ₹5,000/month or moving ₹1 Lakh from savings to an Liquid/Arbitrage Fund will boost your score to **810** instantly."
            )
        elif "retire" in query_lower:
            final_response = (
                "To retire at age 50 (16 years from now), you require an inflation-adjusted corpus of **₹5.2 Crore** (assuming 6% inflation). "
                "Your current retirement assets stand at ₹6.15 Lakhs and active SIP of ₹10,000/month. On this path, you will achieve ₹3.1 Crore, "
                "leaving a gap of ₹2.1 Crore. To bridge this gap, you should: "
                "1) Increase your retirement SIP by **₹18,500/month**, OR "
                "2) Pay off your car loan by next year and redirect the ₹12,000 EMI to your retirement fund."
            )
        elif "fraud" in query_lower or "scam" in query_lower:
            final_response = (
                "ARTHA Shield has performed a comprehensive security audit on your accounts. "
                "We monitored all active UPI auto-debits, recent debit card terminal logins in Bangalore, and SMS phishing hashes. "
                "Status: **SECURE**. We blocked a spam UPI collect request of ₹5,000 from an unverified merchant ('pay-quick@upi') 4 days ago. "
                "No actions are required from your side."
            )
        elif "portfolio" in query_lower or "optimize" in query_lower or "invest" in query_lower:
            final_response = (
                "Based on your **Moderate** risk profile, your current investment mix has a high concentration of direct equities. "
                "I recommend a balanced allocation: 50% Equity Mutual Funds, 20% Direct Stocks, 20% FDs, and 10% Gold/Emergency reserves. "
                "Action item: Redirect the ₹10,000 monthly SIP from Mirae Asset Large Cap to Parag Parikh Flexi Cap to gain global exposure and minimize local risk."
            )
        else:
            final_response = (
                f"Hello Rajesh! The ARTHA Multi-Agent team has analyzed your query. "
                "Your current net worth is ₹{context['profile'].net_worth:,.0f} with a health score of 745/1000. "
                "We recommend checking your Goal Planner to bridge the child education deficit of ₹12,500/month, "
                "and reviewing the What-If sandbox to simulate inflation shocks up to 8%."
            )
            
        return OrchestrationResult(
            query=query,
            final_response=final_response,
            thought_history=thought_history
        )
