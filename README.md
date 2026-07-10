# ARTHA AI – Personal Digital Wealth Avatar Platform

ARTHA AI is a premium, futuristic Personal Digital Wealth Management platform designed for an Indian Bank, incorporating UI/UX design languages from Apple Wallet, CRED, Wealthfront, and Revolut.

Every customer receives a **Digital Wealth Avatar** that continuously audits transaction ledgers, UPI accounts, and goal milestones using cooperative AI agents to provide proactive advice.

---

## Technical Stack

* **Frontend**: React 19 + TypeScript + Tailwind CSS v4.0 + Recharts + Framer Motion + Web Speech API (transcription & voice synthesis).
* **Backend**: Python 3.11 + FastAPI + Uvicorn + Pydantic.
* **Orchestration**: Multi-Agent system (9 cooperative AI agents).
* **Containerization**: Separate Dockerfiles configured for independent deployment on **Google Cloud Run**.

---

## Directory Layout

```
├── backend/
│   ├── main.py              # FastAPI Web API
│   ├── agents.py            # 9-Agent Orchestrator Logic
│   ├── financial_model.py   # Wealth Score (0-1000) & Compounding Math
│   ├── data_mock.py         # Indian Bank Account Dummy Datasets
│   ├── requirements.txt     # Python Dependencies
│   └── Dockerfile           # Backend Container Config (Port 8080)
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Modular Wealth Sub-components (Avatar, Sandbox, Ratios)
│   │   ├── App.tsx          # Main Grid layout and Chat handler
│   │   ├── index.css        # Tailwind v4 import & custom glassmorphism
│   │   └── main.tsx         # React root entry point
│   ├── nginx.conf           # SPA Nginx server config (Port 8080)
│   ├── package.json         # React & UI Library configs
│   ├── vite.config.ts       # Vite config incorporating Tailwind plugin
│   └── Dockerfile           # Frontend Container Config (Port 8080)
│
└── docker-compose.yml       # Local deployment compose orchestrator
```

---

## Multi-Agent Architecture

The backend implements a **cooperative multi-agent consensus** structure composed of:
1. **Customer Profile Agent (A1)**: Analyzes income brackets, salary credits, and active deposits.
2. **Investment Advisor (A2)**: Formulates targeted mutual fund transfers and stock allocations.
3. **Goal Planner (A3)**: Projects future target lines under compounding returns.
4. **Risk Analyzer (A4)**: Verifies health and term insurance covers against active liabilities.
5. **Fraud Detector (A5)**: Scans UPI collects and alerts of phishing or unverified mandates.
6. **Market Analyst (A6)**: Tracks FD yield peaks, RBI Repo rates, and inflation benchmarks.
7. **Behavior Prediction (A7)**: Pins weekend discretionary leak factors.
8. **Notification Generator (A8)**: Formulates card recommendations in text form.
9. **Financial Educator (A9)**: Simplifies tax codes and rules of compounding.

---

## Getting Started Locally

### Option 1: Docker Compose (Recommended)
Make sure you have Docker running. Run the following command at the root directory:
```bash
docker-compose up --build
```
* **Frontend Dashboard**: Open [http://localhost:3000](http://localhost:3000)
* **Backend API Docs**: Open [http://localhost:8080/docs](http://localhost:8080/docs)

---

### Option 2: Local Development Shells

#### 1. Launch the Backend
Open a terminal, navigate to the `backend/` folder:
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
The FastAPI server starts at [http://localhost:8000](http://localhost:8000). To support the frontend requests, Uvicorn binds to `8080` inside Docker, but locally it defaults to `8000` (the frontend is configured to fall back to local calculations if the API fails, or you can run uvicorn on port `8080` manually: `uvicorn main:app --port 8080`).

#### 2. Launch the Frontend
Open a second terminal, navigate to the `frontend/` folder:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deployment to Google Cloud Run

To deploy both services to Google Cloud Run, build and push the containers to Google Artifact Registry:

```bash
# Set GCP environment variables
GCP_PROJECT="your-project-id"
REGION="asia-south1" # e.g. Mumbai

# 1. Deploy the Backend
gcloud builds submit --tag gcr.io/$GCP_PROJECT/artha-backend ./backend
gcloud run deploy artha-backend \
    --image gcr.io/$GCP_PROJECT/artha-backend \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated

# Note: After backend deployment, copy the Service URL and update the fetch endpoint in frontend/src/App.tsx

# 2. Deploy the Frontend
gcloud builds submit --tag gcr.io/$GCP_PROJECT/artha-frontend ./frontend
gcloud run deploy artha-frontend \
    --image gcr.io/$GCP_PROJECT/artha-frontend \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated
```
