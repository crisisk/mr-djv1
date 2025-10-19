from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mr. DJ API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Mr. DJ API - Running", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# TODO: Import and include routers from app/api/routes/
# from app.api.routes import events, bookings
# app.include_router(events.router, prefix="/api/events", tags=["events"])
# app.include_router(bookings.router, prefix="/api/bookings", tags=["bookings"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
