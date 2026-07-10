from typing import Dict, Any, List
import numpy as np

def calculate_detailed_wealth_score(data: Dict[str, Any]) -> Dict[str, Any]:
    profile = data["profile"]
    debts = data["debts"]
    mfs = data["mutual_funds"]
    fds = data["fds"]
    stocks = data["stocks"]
    goals = data["goals"]
    insurance = data["insurance"]
    
    # Weights out of 1000:
    # 1. Savings Rate: 150
    # 2. Investment Discipline: 150
    # 3. Emergency Fund: 150
    # 4. Debt Ratio: 150
    # 5. Diversification: 100
    # 6. Insurance: 100
    # 7. Retirement planning: 100
    # 8. Goal Progress: 100
    
    # 1. Savings Rate Score
    savings_rate = profile.savings_rate
    sr_score = min(150, (savings_rate / 40.0) * 150.0)
    
    # 2. Investment Discipline Score (streaks / SIP consistency)
    discipline = profile.discipline_score # scale 0-100
    id_score = (discipline / 100.0) * 150.0
    
    # 3. Emergency Fund Score
    ef_months = profile.emergency_fund_months
    ef_score = min(150, (ef_months / 6.0) * 150.0)
    
    # 4. Debt-to-Income (EMI Ratio) Score
    total_emis = debts["home_loan"]["emi"] + debts["car_loan"]["emi"]
    emi_ratio = total_emis / profile.monthly_income
    # Ideal is < 30%. Score decreases as it exceeds 30%
    if emi_ratio <= 0.30:
        debt_score = 150.0
    else:
        debt_score = max(0, 150.0 - ((emi_ratio - 0.30) / 0.40) * 150.0)
        
    # 5. Diversification Score
    # Balanced check: stocks, mutual funds, fds, digital gold
    portfolio_size = profile.total_invested
    fd_val = sum(f.current_value for f in fds)
    mf_val = sum(m.current_value for m in mfs)
    stock_val = sum(s.current_value for s in stocks)
    gold_val = data["liquid_gold"]
    
    assets = [fd_val, mf_val, stock_val, gold_val]
    # Check entropy or concentration.
    ratios = [a / portfolio_size if portfolio_size > 0 else 0 for a in assets]
    max_ratio = max(ratios) if ratios else 1.0
    # If one asset is > 70%, diversification score is low
    div_score = 100.0 * (1.0 - max(0, max_ratio - 0.4) / 0.6)
    div_score = max(30.0, min(100.0, div_score))
    
    # 6. Insurance Score
    ins_score = 0.0
    if insurance.get("health", {}).get("sum_insured", 0) >= 500000.0:
        ins_score += 50.0 # Good health insurance
    if insurance.get("term", {}).get("sum_insured", 0) >= 10000000.0:
        ins_score += 50.0 # Good term plan
        
    # 7. Retirement planning
    ret_sip = sum(goal.monthly_sip_allocated for goal in goals if goal.category == "Retirement")
    ret_score = min(100.0, (ret_sip / 15000.0) * 100.0)
    
    # 8. Goal completion
    comp_ratios = [g.current_amount / g.target_amount for g in goals if g.target_amount > 0]
    avg_comp = sum(comp_ratios) / len(comp_ratios) if comp_ratios else 0.0
    goal_score = min(100.0, avg_comp * 150.0) # normalized
    
    total_score = sr_score + id_score + ef_score + debt_score + div_score + ins_score + ret_score + goal_score
    total_score = round(max(300.0, min(1000.0, total_score)))
    
    return {
        "score": total_score,
        "breakdown": {
            "savings_rate": {"score": round(sr_score), "max": 150, "value": f"{savings_rate}%"},
            "discipline": {"score": round(id_score), "max": 150, "value": f"{discipline}/100"},
            "emergency_fund": {"score": round(ef_score), "max": 150, "value": f"{ef_months} Months"},
            "debt_ratio": {"score": round(debt_score), "max": 150, "value": f"{round(emi_ratio * 100, 1)}% EMI/Inc"},
            "diversification": {"score": round(div_score), "max": 100, "value": f"Max {round(max_ratio*100)}%"},
            "insurance": {"score": round(ins_score), "max": 100, "value": "Fully Protected" if ins_score == 100 else "Partially Protected"},
            "retirement": {"score": round(ret_score), "max": 100, "value": f"₹{ret_sip}/mo SIP"},
            "goal_progress": {"score": round(goal_score), "max": 100, "value": f"{round(avg_comp * 100, 1)}% met"}
        }
    }

def simulate_goals_projection(goals: List[Any], inflation_rate: float = 6.0) -> List[Dict[str, Any]]:
    projected_goals = []
    
    for goal in goals:
        # Standard average returns by goal type
        if goal.category == "Retirement":
            expected_return = 12.0 # balanced
        elif goal.category == "Education":
            expected_return = 12.5 # heavy equity
        elif goal.category == "Vacation" or goal.category == "Car":
            expected_return = 8.5 # debt/liquid heavy
        else:
            expected_return = 10.0 # moderate
            
        months = goal.timeframe_years * 12
        r_monthly = (expected_return / 100.0) / 12
        
        # Inflation adjusted target
        inflated_target = goal.target_amount * ((1 + (inflation_rate / 100.0)) ** goal.timeframe_years)
        
        # Let's project where the current amount + current SIP will lead in timeframe_years
        # Future value of current amount
        fv_current = goal.current_amount * ((1 + r_monthly) ** months)
        
        # Future value of SIPs
        if r_monthly > 0:
            fv_sip = goal.monthly_sip_allocated * ((((1 + r_monthly) ** months) - 1) / r_monthly) * (1 + r_monthly)
        else:
            fv_sip = goal.monthly_sip_allocated * months
            
        estimated_future_value = fv_current + fv_sip
        
        # Calculate monthly SIP required to meet the Inflated Target
        needed_from_sip = max(0, inflated_target - fv_current)
        if r_monthly > 0:
            required_sip = needed_from_sip / (((((1 + r_monthly) ** months) - 1) / r_monthly) * (1 + r_monthly))
        else:
            required_sip = needed_from_sip / months
            
        # Probability of success (Simple mock Monte Carlo base probability)
        # Higher current + sip leads to higher probability
        ratio = estimated_future_value / inflated_target if inflated_target > 0 else 1.0
        probability = min(99.0, max(15.0, ratio * 75.0))
        if ratio >= 1.0:
            probability = min(99.0, 75.0 + (ratio - 1.0) * 20.0)
            
        # Generate yearly timeline for roadmap
        timeline = []
        for year in range(int(goal.timeframe_years) + 1):
            yr_months = year * 12
            y_fv_current = goal.current_amount * ((1 + r_monthly) ** yr_months)
            if r_monthly > 0:
                y_fv_sip = goal.monthly_sip_allocated * ((((1 + r_monthly) ** yr_months) - 1) / r_monthly) * (1 + r_monthly)
            else:
                y_fv_sip = goal.monthly_sip_allocated * yr_months
            timeline.append({
                "year": year,
                "projected_val": round(y_fv_current + y_fv_sip),
                "target_val": round(inflated_target * (year / goal.timeframe_years) if goal.timeframe_years > 0 else inflated_target)
            })
            
        projected_goals.append({
            "id": goal.id,
            "name": goal.name,
            "category": goal.category,
            "target_amount": goal.target_amount,
            "inflated_target": round(inflated_target),
            "current_amount": goal.current_amount,
            "monthly_sip_allocated": goal.monthly_sip_allocated,
            "required_sip": round(required_sip),
            "estimated_future_value": round(estimated_future_value),
            "success_probability": round(probability, 1),
            "expected_return": expected_return,
            "timeline": timeline
        })
        
    return projected_goals

def run_what_if_simulation(scenario: str, params: Dict[str, Any], current_data: Dict[str, Any]) -> Dict[str, Any]:
    # Runs 20 year wealth projection comparing baseline vs scenario
    profile = current_data["profile"]
    mfs = current_data["mutual_funds"]
    fds = current_data["fds"]
    stocks = current_data["stocks"]
    gold = current_data["liquid_gold"]
    
    current_invested = sum(m.current_value for m in mfs) + sum(f.current_value for f in fds) + sum(s.current_value for s in stocks) + gold
    current_sip = sum(m.sip_amount for m in mfs)
    current_debt = profile.total_debt
    
    years = 20
    timeline_base = []
    timeline_scenario = []
    
    # Baseline Parameters
    base_return = 11.5 # 11.5% weighted average portfolio return
    base_inflation = 6.0
    base_sip = current_sip
    base_monthly_savings = 10000.0 # additional savings
    
    # Scenario Parameters
    sc_return = base_return
    sc_inflation = base_inflation
    sc_sip = base_sip
    sc_retirement_year = 20 # defaults
    sc_stop_sip_year = 999
    
    scenario_desc = ""
    
    if scenario == "sip_change":
        additional_sip = float(params.get("additional_sip", 5000))
        sc_sip = base_sip + additional_sip
        scenario_desc = f"Investing an extra ₹{additional_sip:,.0f} monthly via SIP."
        
    elif scenario == "early_retirement":
        retire_age = int(params.get("retire_age", 50))
        current_age = profile.age
        years_to_retire = max(0, retire_age - current_age)
        sc_retirement_year = years_to_retire
        scenario_desc = f"Retiring early at age {retire_age} (in {years_to_retire} years)."
        
    elif scenario == "inflation_spike":
        sc_inflation = float(params.get("inflation_rate", 8.0))
        scenario_desc = f"Inflation rate rising to {sc_inflation}% (baseline {base_inflation}%)."
        
    elif scenario == "stop_sip":
        sc_stop_sip_year = int(params.get("stop_year", 2))
        scenario_desc = f"Stopping all SIPs after {sc_stop_sip_year} years."

    # Perform year by year calculations
    base_wealth = current_invested
    sc_wealth = current_invested
    
    base_debt = current_debt
    sc_debt = current_debt
    
    # Simulating debt paydowns
    # Home loan: 45k/mo EMI (8.4%, 120 months left -> 10 years)
    # Car loan: 12k/mo EMI (9.2%, 45 months left -> ~4 years)
    
    for yr in range(1, years + 1):
        # Base Scenario Calculation
        # Debt reductions
        if yr <= 4:
            base_debt_paydown = (12 * 12000) + (12 * 45000)
        elif yr <= 10:
            base_debt_paydown = (12 * 45000)
        else:
            base_debt_paydown = 0
            
        base_debt = max(0, base_debt - base_debt_paydown)
        
        # Investment compounding
        base_interest = base_wealth * (base_return / 100.0)
        base_savings = (base_sip + base_monthly_savings) * 12
        base_wealth = base_wealth + base_interest + base_savings
        
        # Inflation adjustment (buying power representation)
        purchasing_power_base = base_wealth / ((1 + (base_inflation / 100.0)) ** yr)
        
        timeline_base.append({
            "year": yr,
            "net_worth": round(base_wealth - base_debt),
            "assets": round(base_wealth),
            "debt": round(base_debt),
            "real_value": round(purchasing_power_base)
        })
        
        # Scenario Calculation
        if yr <= 4:
            sc_debt_paydown = (12 * 12000) + (12 * 45000)
        elif yr <= 10:
            sc_debt_paydown = (12 * 45000)
        else:
            sc_debt_paydown = 0
        sc_debt = max(0, sc_debt - sc_debt_paydown)
        
        # Compound investments
        # If early retirement hit, stop saving and start withdrawing (e.g. withdraw 4% of corpus annually)
        is_retired = yr > sc_retirement_year
        is_sip_stopped = yr > sc_stop_sip_year
        
        sc_interest = sc_wealth * (sc_return / 100.0)
        
        if is_retired:
            # Withdraw 6% of corpus annually to live (emi is gone by then mostly)
            withdrawal = sc_wealth * 0.06
            sc_wealth = sc_wealth + sc_interest - withdrawal
        else:
            current_yr_sip = 0.0 if is_sip_stopped else sc_sip
            sc_savings = (current_yr_sip + base_monthly_savings) * 12
            sc_wealth = sc_wealth + sc_interest + sc_savings
            
        purchasing_power_sc = sc_wealth / ((1 + (sc_inflation / 100.0)) ** yr)
        
        timeline_scenario.append({
            "year": yr,
            "net_worth": round(sc_wealth - sc_debt),
            "assets": round(sc_wealth),
            "debt": round(sc_debt),
            "real_value": round(purchasing_power_sc)
        })

    # Summary analysis
    final_net_worth_base = timeline_base[-1]["net_worth"]
    final_net_worth_sc = timeline_scenario[-1]["net_worth"]
    difference = final_net_worth_sc - final_net_worth_base
    
    # Financial advisor summary
    if difference > 0:
        conclusion = f"This change boosts your 20-year net worth by ₹{difference:,.0f}. Highly recommended for long-term compounding."
    elif difference < 0:
        conclusion = f"This reduces your 20-year net worth by ₹{abs(difference):,.0f}. Make sure you buffer your secondary income sources or cut luxury spending to compensate."
    else:
        conclusion = "The financial outcomes are equivalent to your current trajectory."

    return {
        "scenario": scenario,
        "description": scenario_desc,
        "conclusion": conclusion,
        "baseline_timeline": timeline_base,
        "scenario_timeline": timeline_scenario,
        "final_net_worth_base": final_net_worth_base,
        "final_net_worth_sc": final_net_worth_sc,
        "difference": difference
    }

def get_portfolio_recommendation(risk_profile: str) -> Dict[str, Any]:
    # Indian context portfolio allocations
    recommendations = {
        "Conservative": {
            "allocation": {
                "Fixed_Deposits": 45,
                "Debt_Funds_Liquid": 25,
                "Large_Cap_MF": 15,
                "Gold": 10,
                "ETFs_Stocks": 5
            },
            "description": "Focus is on capital preservation. High allocation to Fixed Deposits and Debt instruments protects against market volatility while generating steady returns.",
            "recommended_funds": [
                {"name": "IDBI Liquid Fund Direct-Growth", "allocation": "25%", "type": "Liquid Debt"},
                {"name": "HDFC Short Term Debt Direct-Growth", "allocation": "20%", "type": "Debt"},
                {"name": "ICICI Prudential Bluechip Fund Direct-Growth", "allocation": "15%", "type": "Large Cap Equity"},
                {"name": "SBI Gold ETF", "allocation": "10%", "type": "Gold commodity"},
                {"name": "IDBI Bank 3-Year Fixed Deposit (7.25% p.a.)", "allocation": "30%", "type": "FD"}
            ]
        },
        "Moderate": {
            "allocation": {
                "Fixed_Deposits": 20,
                "Debt_Funds_Liquid": 15,
                "Large_Cap_MF": 30,
                "Mid_Small_Cap_MF": 20,
                "Gold": 8,
                "ETFs_Stocks": 7
            },
            "description": "Balanced approach. Combines the high-growth potential of mid/small-cap equity mutual funds with the stability of bluechips, FDs, and digital gold.",
            "recommended_funds": [
                {"name": "Parag Parikh Flexi Cap Fund Direct-Growth", "allocation": "25%", "type": "Flexi Cap Equity"},
                {"name": "Mirae Asset Large Cap Fund Direct-Growth", "allocation": "15%", "type": "Large Cap Equity"},
                {"name": "Quant Mid Cap Fund Direct-Growth", "allocation": "15%", "type": "Mid Cap Equity"},
                {"name": "SBI Small Cap Fund Direct-Growth", "allocation": "10%", "type": "Small Cap Equity"},
                {"name": "IDBI Liquid Fund Direct-Growth", "allocation": "15%", "type": "Liquid / Emergency"},
                {"name": "Sovereign Gold Bond (SGB) / Digital Gold", "allocation": "10%", "type": "Gold Assets"},
                {"name": "IDBI Bank Fixed Deposit (7.10% p.a.)", "allocation": "10%", "type": "FD"}
            ]
        },
        "Aggressive": {
            "allocation": {
                "Fixed_Deposits": 5,
                "Debt_Funds_Liquid": 5,
                "Large_Cap_MF": 25,
                "Mid_Small_Cap_MF": 45,
                "Gold": 5,
                "ETFs_Stocks": 15
            },
            "description": "Focus is on high capital growth. Equity allocation is maximized across diversified flexi-caps, small-caps, and index stocks to beat inflation aggressively.",
            "recommended_funds": [
                {"name": "Nippon India Small Cap Fund Direct-Growth", "allocation": "20%", "type": "Small Cap Equity"},
                {"name": "HDFC Mid-Cap Opportunities Fund Direct-Growth", "allocation": "15%", "type": "Mid Cap Equity"},
                {"name": "Parag Parikh Flexi Cap Fund Direct-Growth", "allocation": "20%", "type": "Flexi Cap Equity"},
                {"name": "UTI Nifty 50 Index Fund Direct-Growth", "allocation": "15%", "type": "Large Cap Equity"},
                {"name": "Direct Nifty Stock Portfolio (Zerodha/Groww)", "allocation": "15%", "type": "Direct Equity"},
                {"name": "SBI Gold Fund Direct-Growth", "allocation": "5%", "type": "Gold Commodity"},
                {"name": "IDBI Liquid Fund (Emergency Reserves)", "allocation": "10%", "type": "Liquid"}
            ]
        }
    }
    
    return recommendations.get(risk_profile, recommendations["Moderate"])
