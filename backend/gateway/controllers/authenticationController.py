from fastapi import APIRouter, Header, Request
from models.schemas import SignupSchema, SigninSchema, UsersSchema
import httpx
from typing import Optional

router = APIRouter()
SPRING_BOOT_URL = "http://localhost:8001/user"

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
    return resp.json()

@router.post("/authservice/signup")
async def signup(data: SignupSchema):
    return await forward("POST", f"{SPRING_BOOT_URL}/signup", body=data.dict())

@router.post("/authservice/signin")
async def signin(data: SigninSchema):
    return await forward("POST", f"{SPRING_BOOT_URL}/signin", body=data.dict())

@router.get("/authservice/uinfo")
async def uinfo(token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{SPRING_BOOT_URL}/uinfo", token=token)

@router.get("/authservice/profile")
async def profile(token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{SPRING_BOOT_URL}/profile", token=token)

@router.get("/authservice/getallusers/{page}/{size}")
async def getallusers(page: int, size: int, token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{SPRING_BOOT_URL}/getallusers/{page}/{size}", token=token)

@router.get("/authservice/getuser/{id}")
async def getuser(id: int, token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{SPRING_BOOT_URL}/getuser/{id}", token=token)

@router.post("/authservice/saveuser")
async def saveuser(data: UsersSchema, token: Optional[str] = Header(None, alias="Token")):
    return await forward("POST", f"{SPRING_BOOT_URL}/saveuser", token=token, body=data.dict())

@router.put("/authservice/updateuser/{id}")
async def updateuser(id: int, data: UsersSchema, token: Optional[str] = Header(None, alias="Token")):
    return await forward("PUT", f"{SPRING_BOOT_URL}/updateuser/{id}", token=token, body=data.dict())

@router.delete("/authservice/deleteuser/{id}")
async def deleteuser(id: int, token: Optional[str] = Header(None, alias="Token")):
    return await forward("DELETE", f"{SPRING_BOOT_URL}/deleteuser/{id}", token=token)

@router.get("/authservice/searchuser/{key}")
async def searchuser(key: str, token: Optional[str] = Header(None, alias="Token")):
    return await forward("GET", f"{SPRING_BOOT_URL}/searchuser/{key}", token=token)
