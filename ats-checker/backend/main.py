"""
ATS Checker - Main FastAPI Application
Entry point: uvicorn main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, health

app = FastAPI(
    title="ATS Checker API",
    description="Your personal ATS resume checker - free forever",
    version="1.0.0"
)

# CORS — allow React frontend on localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])


@app.get("/")
def root():
    return {"message": "ATS Checker API is running 🚀"}