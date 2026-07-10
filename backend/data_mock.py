import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
from pydantic import BaseModel

class Transaction(BaseModel):
    id: str
    date: str
    amount: float
    merchant: str
    category: str  # Food, Shopping, Fuel, Bills, Luxury, Subscriptions, Investment, Salary, UPI-Transfer
    type: str  # Debit, Credit
    payment_method: str  # UPI, Debit Card, Credit Card, IMPS
    is_impulse: bool

class MutualFundHolding(BaseModel):
    name: str
    category: str  # Large Cap, Mid Cap, Small Cap, Debt, Tax Saver
    sip_amount: float
    invested_value: float
    current_value: float
    units: float
    nav: float

class StockHolding(BaseModel):
    ticker: str
    name: str
    shares: int
    avg_price: float
    current_price: float
    current_value: float

class FixedDeposit(BaseModel):
    id: str
    principal: float
    interest_rate: float
    maturity_date: str
    current_value: float

class Goal(BaseModel):
    id: str
    name: str
    target_amount: float
    current_amount: float
    timeframe_years: float
    monthly_sip_allocated: float
    priority: str  # High, Medium, Low
    category: str  # House, Wedding, Education, Retirement, Vacation, Car, Health

class FinancialProfile(BaseModel):
    name: str
    age: int
    profession: str
    monthly_income: float
    savings_rate: float  # Percentage, e.g. 25.5
    risk_appetite: str  # Aggressive, Moderate, Conservative
    net_worth: float
    liquid_cash: float
    total_invested: float
    total_debt: float
    emergency_fund_months: float
    family_members: int
    discipline_score: int  # 0-100
    wealth_score: int  # 0-1000

# Base mock data generator
def generate_mock_data() -> Dict[str, Any]:
    random.seed(42)  # For deterministic initial state
    
    # 30 Days of Transactions
    categories = {
        "Swiggy": ("Food", "UPI"),
        "Zomato": ("Food", "UPI"),
        "Netflix": ("Subscriptions", "Credit Card"),
        "Spotify": ("Subscriptions", "Credit Card"),
        "Amazon Prime": ("Subscriptions", "Credit Card"),
        "Uber": ("Travel", "UPI"),
        "Ola Cabs": ("Travel", "UPI"),
        "Amazon": ("Shopping", "Credit Card"),
        "Flipkart": ("Shopping", "Credit Card"),
        "Myntra": ("Shopping", "Credit Card"),
        "Shell Petrol": ("Fuel", "Debit Card"),
        "HP Petrol": ("Fuel", "Debit Card"),
        "Starbucks": ("Luxury", "UPI"),
        "Third Wave Coffee": ("Luxury", "UPI"),
        "CRED CC Bill": ("Bills", "UPI"),
        "BESCOM Electricity": ("Bills", "UPI"),
        "Airtel Broadband": ("Bills", "UPI"),
        "Local Chai Shop": ("Food", "UPI"),
        "Corner House Ice Cream": ("Food", "UPI"),
        "Nandhini Deluxe": ("Food", "UPI"),
        "Zerodha Fund Addition": ("Investment", "IMPS"),
        "Groww SIP AutoDebit": ("Investment", "IMPS"),
        "Rent Payment": ("Bills", "IMPS"),
    }
    
    transactions = []
    base_date = datetime.now() - timedelta(days=30)
    
    # Add monthly salary credit
    transactions.append(
        Transaction(
            id="TXN-SAL-01",
            date=(base_date + timedelta(days=1)).strftime("%Y-%m-%d %H:%M"),
            amount=175000.0,
            merchant="TechCorp IT Solutions",
            category="Salary",
            type="Credit",
            payment_method="IMPS",
            is_impulse=False
        )
    )
    
    # Add regular transactions
    txn_id_counter = 1
    for day in range(30):
        current_date = base_date + timedelta(days=day)
        
        # Don't add salary again (except if day 30, close to next month)
        if day == 0:
            continue
            
        # Daily random transactions
        num_txns = random.choices([1, 2, 3, 4], weights=[20, 40, 30, 10])[0]
        for _ in range(num_txns):
            merchant = random.choice(list(categories.keys()))
            cat, method = categories[merchant]
            
            # Rent on day 5
            if day == 5 and _ == 0:
                merchant = "Rent Payment"
                cat, method = categories[merchant]
                amount = 35000.0
                is_impulse = False
            # Electricity bill on day 10
            elif day == 10 and _ == 0:
                merchant = "BESCOM Electricity"
                cat, method = categories[merchant]
                amount = 3450.0
                is_impulse = False
            # ISP on day 12
            elif day == 12 and _ == 0:
                merchant = "Airtel Broadband"
                cat, method = categories[merchant]
                amount = 1199.0
                is_impulse = False
            # CRED credit card bill on day 15
            elif day == 15 and _ == 0:
                merchant = "CRED CC Bill"
                cat, method = categories[merchant]
                amount = 35250.0
                is_impulse = False
            # Growth SIP on day 2
            elif day == 2 and _ == 0:
                merchant = "Groww SIP AutoDebit"
                cat, method = categories[merchant]
                amount = 30000.0
                is_impulse = False
            else:
                # Random retail amount
                if cat == "Food":
                    amount = float(random.randint(150, 1200))
                elif cat == "Shopping":
                    amount = float(random.randint(500, 8000))
                elif cat == "Fuel":
                    amount = float(random.randint(1000, 2500))
                elif cat == "Luxury":
                    amount = float(random.randint(400, 3500))
                elif cat == "Subscriptions":
                    amount = float(random.choice([199, 299, 649, 999]))
                else:
                    amount = float(random.randint(100, 500))
            
            is_impulse = False
            if cat in ["Luxury", "Shopping"] and amount > 2500:
                is_impulse = random.choice([True, False])
                
            transactions.append(
                Transaction(
                    id=f"TXN-{txn_id_counter:04d}",
                    date=current_date.strftime("%Y-%m-%d %H:%M"),
                    amount=amount,
                    merchant=merchant,
                    category=cat,
                    type="Debit",
                    payment_method=method,
                    is_impulse=is_impulse
                )
            )
            txn_id_counter += 1

    # Sorting transactions to have the latest first
    transactions.sort(key=lambda x: x.date, reverse=True)

    # Mutual Fund Holdings
    mutual_funds = [
        MutualFundHolding(
            name="Parag Parikh Flexi Cap Fund Direct-Growth",
            category="Large & Mid Cap / Flexi",
            sip_amount=15000.0,
            invested_value=250000.0,
            current_value=310000.0,
            units=4960.0,
            nav=62.5
        ),
        MutualFundHolding(
            name="Mirae Asset Large Cap Fund Direct-Growth",
            category="Large Cap",
            sip_amount=10000.0,
            invested_value=180000.0,
            current_value=220000.0,
            units=2115.38,
            nav=104.0
        ),
        MutualFundHolding(
            name="SBI Small Cap Fund Direct-Growth",
            category="Small Cap",
            sip_amount=5000.0,
            invested_value=70000.0,
            current_value=85000.0,
            units=566.66,
            nav=150.0
        )
    ]

    # Stock Holdings
    stocks = [
        StockHolding(ticker="HDFCBANK", name="HDFC Bank Ltd", shares=45, avg_price=1444.0, current_price=1620.0, current_value=72900.0),
        StockHolding(ticker="RELIANCE", name="Reliance Industries Ltd", shares=35, avg_price=2450.0, current_price=2850.0, current_value=99750.0),
        StockHolding(ticker="TCS", name="Tata Consultancy Services Ltd", shares=12, avg_price=3400.0, current_price=3980.0, current_value=47760.0),
        StockHolding(ticker="INFY", name="Infosys Ltd", shares=20, avg_price=1380.0, current_price=1520.0, current_value=30400.0)
    ]

    # Fixed Deposits
    fds = [
        FixedDeposit(id="FD-88902", principal=150000.0, interest_rate=7.1, maturity_date="2027-11-15", current_value=158200.0),
        FixedDeposit(id="FD-88905", principal=100000.0, interest_rate=7.25, maturity_date="2028-06-20", current_value=101800.0)
    ]

    # Life Goals
    goals = [
        Goal(id="G-1", name="Child's Foreign Education", target_amount=5000000.0, current_amount=400000.0, timeframe_years=12.0, monthly_sip_allocated=15000.0, priority="High", category="Education"),
        Goal(id="G-2", name="Retirement Corpus", target_amount=50000000.0, current_amount=615000.0, timeframe_years=26.0, monthly_sip_allocated=10000.0, priority="High", category="Retirement"),
        Goal(id="G-3", name="Europe Family Vacation", target_amount=500000.0, current_amount=150000.0, timeframe_years=1.5, monthly_sip_allocated=10000.0, priority="Medium", category="Vacation"),
        Goal(id="G-4", name="New SUV Car purchase", target_amount=1800000.0, current_amount=200000.0, timeframe_years=4.0, monthly_sip_allocated=5000.0, priority="Low", category="Car")
    ]

    # Insurance
    insurance = {
        "health": {
            "provider": "HDFC Ergo Health Optima",
            "sum_insured": 10000000.0,
            "premium_annual": 18500.0,
            "due_date": "2026-10-12"
        },
        "term": {
            "provider": "LIC e-Term Plan",
            "sum_insured": 15000000.0,
            "premium_annual": 24000.0,
            "due_date": "2026-12-05"
        }
    }

    # Liabilities / Debt
    debts = {
        "home_loan": {
            "provider": "SBI Home Finance",
            "outstanding": 3800000.0,
            "emi": 45000.0,
            "interest_rate": 8.4,
            "tenure_months_left": 120
        },
        "car_loan": {
            "provider": "ICICI Bank Car Loan",
            "outstanding": 450000.0,
            "emi": 12000.0,
            "interest_rate": 9.2,
            "tenure_months_left": 45
        },
        "credit_cards": [
            {"name": "IDBI Signature Card", "outstanding": 22450.0, "limit": 300000.0, "due_date": "2026-07-25"},
            {"name": "Amazon Pay ICICI Card", "outstanding": 12800.0, "limit": 200000.0, "due_date": "2026-07-28"}
        ]
    }

    # Calculations
    liquid_cash = 142500.0  # Bank account balance
    fd_val = sum(fd.current_value for fd in fds)
    mf_val = sum(mf.current_value for mf in mutual_funds)
    stock_val = sum(s.current_value for s in stocks)
    gold_val = 50000.0  # digital gold
    
    total_invested = fd_val + mf_val + stock_val + gold_val
    net_worth = liquid_cash + total_invested - (debts["home_loan"]["outstanding"] + debts["car_loan"]["outstanding"] + sum(cc["outstanding"] for cc in debts["credit_cards"]))
    
    total_debt = debts["home_loan"]["outstanding"] + debts["car_loan"]["outstanding"] + sum(cc["outstanding"] for cc in debts["credit_cards"])
    
    # Emergency fund months calculation
    monthly_mandatory_expenses = 35000.0 + 45000.0 + 12000.0 + 15000.0 + 8000.0 # Rent + Home Loan EMI + Car Loan EMI + Food + Bills
    emergency_fund = liquid_cash + fd_val # Savings + FD are liquid emergency reserves
    emergency_fund_months = round(emergency_fund / monthly_mandatory_expenses, 1)

    profile = FinancialProfile(
        name="Rajesh Kumar",
        age=34,
        profession="Lead Software Architect",
        monthly_income=175000.0,
        savings_rate=35.5,  # (Savings + SIP + FD) / income
        risk_appetite="Moderate",
        net_worth=round(net_worth, 2),
        liquid_cash=liquid_cash,
        total_invested=round(total_invested, 2),
        total_debt=round(total_debt, 2),
        emergency_fund_months=emergency_fund_months,
        family_members=4,  # Self, spouse, child, aged mother
        discipline_score=82,
        wealth_score=745  # Out of 1000, starts at 745
    )

    return {
        "profile": profile,
        "transactions": transactions,
        "mutual_funds": mutual_funds,
        "stocks": stocks,
        "fds": fds,
        "goals": goals,
        "insurance": insurance,
        "debts": debts,
        "liquid_gold": gold_val
    }
