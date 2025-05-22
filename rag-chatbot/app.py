from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from chainlit.utils import mount_chainlit
from config import config
import os
import httpx
import requests  # ✅ ADD THIS LINE
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

app = FastAPI()
load_dotenv()

# CORS
origins = [
    "http://localhost:5173",
    "https://ayurvision.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

port = int(os.getenv('PORT', 5000))

# Models
class PrakritiUpdateRequest(BaseModel):
    prakriti: str

class Location(BaseModel):
    lat: float
    lng: float

@app.get("/")
def hello():
    return "Hello from AyurVision"

@app.post("/update-prakriti")
async def update_prakriti(request: PrakritiUpdateRequest):
    config.prakriti = request.prakriti.lower()
    config.needs_refresh = True
    return JSONResponse(content={"success": True, "prakriti": config.prakriti})

@app.post("/api/nearby-doctors")
def get_nearby_doctors(location: Location):
    try:
        params = {
            'location': f"{location.lat},{location.lng}",
            'radius': 5000,
            'keyword': 'ayurvedic doctor',
            'type': 'doctor',
            'key': os.getenv('GOOGLE_API_KEY')
        }

        response = requests.get(
            'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
            params=params
        )

        results = response.json().get('results', [])

        doctors = [
            {
                'name': doc.get('name'),
                'address': doc.get('vicinity'),
                'rating': doc.get('rating'),
                'icon': doc.get('icon')
            }
            for doc in results
        ]

        return doctors

    except Exception as e:
        print("❌ Error fetching doctor data:", e)
        raise HTTPException(status_code=500, detail="Error fetching doctor data")

@app.post("/predict")
async def predict_prakriti(request):
    input_json = await request.json()

    async with httpx.AsyncClient() as client:
        response = await client.post("http://localhost:3000/mlmodel", json={"data": input_json})

    result = response.json()
    config.prakriti = result['prakriti'].lower()
    config.needs_refresh = True
    return JSONResponse(content={"success": True, "prakriti": config.prakriti})

mount_chainlit(app=app, target="rag-history.py", path="/chatbot")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=port)
