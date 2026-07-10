from fastapi import FastAPI, Query, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, Optional
from pydantic import BaseModel

# Import modules
from data_mock import generate_mock_data
from financial_model import (
    calculate_detailed_wealth_score,
    simulate_goals_projection,
    run_what_if_simulation,
    get_portfolio_recommendation
)
from agents import AgentOrchestrator

app = FastAPI(
    title="ARTHA AI - Wealth Engine Backend",
    description="Futuristic AI-powered Digital Wealth management orchestrator API",
    version="1.0.0"
)

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual Cloud Run frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global orchestrator instance
orchestrator = AgentOrchestrator()

class ChatRequest(BaseModel):
    query: str

class SimulationRequest(BaseModel):
    scenario: str
    params: Dict[str, Any]

@app.get("/")
def read_root():
    return {
        "status": "online",
        "platform": "ARTHA AI - Personal Digital Wealth Avatar Engine",
        "engine": "Multi-Agent Orchestrator v1.0"
    }

@app.get("/api/dashboard")
def get_dashboard_data():
    try:
        data = generate_mock_data()
        detailed_score = calculate_detailed_wealth_score(data)
        
        # Override the simple score in profile with the dynamically computed one
        data["profile"].wealth_score = detailed_score["score"]
        
        # Format response
        return {
            "profile": data["profile"],
            "transactions": data["transactions"],
            "mutual_funds": data["mutual_funds"],
            "stocks": data["stocks"],
            "fds": data["fds"],
            "goals": data["goals"],
            "insurance": data["insurance"],
            "debts": data["debts"],
            "liquid_gold": data["liquid_gold"],
            "wealth_score_details": detailed_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate dashboard data: {str(e)}")

@app.get("/api/goals")
def get_goals_analysis(inflation: float = Query(6.0, description="Annual inflation rate")):
    try:
        data = generate_mock_data()
        projected = simulate_goals_projection(data["goals"], inflation)
        return {
            "inflation_rate": inflation,
            "goals": projected
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to project goals: {str(e)}")

@app.post("/api/simulate")
def simulate_scenario(req: SimulationRequest):
    try:
        data = generate_mock_data()
        # Compute dynamic score first
        detailed_score = calculate_detailed_wealth_score(data)
        data["profile"].wealth_score = detailed_score["score"]
        
        result = run_what_if_simulation(req.scenario, req.params, data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to run simulation: {str(e)}")

@app.get("/api/portfolio/optimize")
def optimize_portfolio(risk_profile: str = Query("Moderate", description="Risk profile: Conservative, Moderate, Aggressive")):
    try:
        recommendation = get_portfolio_recommendation(risk_profile)
        return {
            "risk_profile": risk_profile,
            "recommendation": recommendation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to optimize portfolio: {str(e)}")

@app.post("/api/chat")
def chat_with_agents(req: ChatRequest):
    try:
        data = generate_mock_data()
        detailed_score = calculate_detailed_wealth_score(data)
        data["profile"].wealth_score = detailed_score["score"]
        
        result = orchestrator.run(req.query, data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process query: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
