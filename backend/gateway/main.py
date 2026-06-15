from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.authenticationController import router as auth_router
from controllers.resourceController import router as resource_router

app = FastAPI(title="Resource Booking Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(resource_router)

@app.get("/")
def root():
    return {"message": "Resource Booking Gateway Running on Port 8000"}
