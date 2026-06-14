from fastapi import APIRouter, Header
from models.schemas import ResourceSchema, BookingSchema
import httpx
from typing import Optional

router = APIRouter()
NODE_URL = "http://localhost:8002"

async def forward(method: str, url: str, token: str = None, body: dict = None):
    headers = {}
    if token:
        headers["Token"] = token
    async with httpx.AsyncClient(timeout=30) as client:
        if method == "GET":
            resp = await client.get(url, headers=headers)
        elif method == "POST":
            resp = await client.post(url, json=body, headers=headers)
        elif method == "PUT":
            resp = await client.put(url, json=body, headers=headers)
        elif method == "DELETE":
            resp = await client.delete(url, headers=headers)
    try:
        return resp.json()
    except Exception:
        return {"code": 500, "message": "Invalid response from resource service"}

# ─── Resource Routes ────────────────────────────────────────────

@router.post("/resourceservice/createresource")
async def createresource(data: ResourceSchema, token: Optional[str] = Header(None, alias="Token")):
    return await forward("POST", f"{NODE_URL}/resource/createresource", token=token, body=data.dict())

@router.get("/resourceservice/getallresources/{page}/{size}")
async def getallresources(page: int, size: int, token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{NODE_URL}/resource/getallresources/{page}/{size}", token=token)

@router.get("/resourceservice/getresource/{id}")
async def getresource(id: str, token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{NODE_URL}/resource/getresource/{id}", token=token)

@router.put("/resourceservice/updateresource/{id}")
async def updateresource(id: str, data: ResourceSchema, token: Optional[str] = Header(None, alias="Token")):
    return await forward("PUT", f"{NODE_URL}/resource/updateresource/{id}", token=token, body=data.dict())

@router.delete("/resourceservice/deleteresource/{id}")
async def deleteresource(id: str, token: Optional[str] = Header(None, alias="Token")):
    return await forward("DELETE", f"{NODE_URL}/resource/deleteresource/{id}", token=token)

@router.get("/resourceservice/vectorsearch/{key}")
async def vectorsearch(key: str, token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{NODE_URL}/resource/vectorsearch/{key}", token=token)

@router.get("/resourceservice/bycategory/{category}")
async def bycategory(category: str, token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{NODE_URL}/resource/bycategory/{category}", token=token)

@router.get("/resourceservice/recommendations/{key}")
async def recommendations(key: str, token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{NODE_URL}/resource/recommendations/{key}", token=token)

# ─── Booking Routes ─────────────────────────────────────────────

@router.post("/bookingservice/createbooking")
async def createbooking(data: BookingSchema, token: Optional[str] = Header(None, alias="Token")):
    return await forward("POST", f"{NODE_URL}/booking/createbooking", token=token, body=data.dict())

@router.get("/bookingservice/getallbookings/{page}/{size}")
async def getallbookings(page: int, size: int, token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{NODE_URL}/booking/getallbookings/{page}/{size}", token=token)

@router.get("/bookingservice/getbooking/{id}")
async def getbooking(id: str, token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{NODE_URL}/booking/getbooking/{id}", token=token)

@router.put("/bookingservice/updatebooking/{id}")
async def updatebooking(id: str, data: BookingSchema, token: Optional[str] = Header(None, alias="Token")):
    return await forward("PUT", f"{NODE_URL}/booking/updatebooking/{id}", token=token, body=data.dict())

@router.delete("/bookingservice/cancelbooking/{id}")
async def cancelbooking(id: str, token: Optional[str] = Header(None, alias="Token")):
    return await forward("DELETE", f"{NODE_URL}/booking/cancelbooking/{id}", token=token)

@router.get("/bookingservice/availability/{resourceId}/{date}")
async def availability(resourceId: str, date: str, token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{NODE_URL}/booking/availability/{resourceId}/{date}", token=token)
