
from fastapi import FastAPI, HTTPException, Request, requests
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from chainlit.utils import mount_chainlit
from pydantic import BaseModel
from config import config
import os
import httpx
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

app = FastAPI()

# api = FastAPI()

load_dotenv()


origins = [
    "http://localhost:5173",  # react app
    "https://ayurvision.vercel.app"  # deployement on vercel
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


port = int(os.getenv('PORT', 5000))


class PrakritiUpdateRequest(BaseModel):
    prakriti: str

# Request body model
class Location(BaseModel):
    lat: float
    lng: float

@app.get('/')
def hello():
    return "hello form likhtih"


@app.post('/update-prakriti')
async def update_prakriti(request: PrakritiUpdateRequest):
    config.prakriti = request.prakriti.lower()
    config.needs_refresh = True
    return JSONResponse(content={"success": True, "prakriti": config.prakriti})


@app.get("/api/nearby-doctors")
async def get_nearby_doctors():
    try:
        params = {
            # 'location': f'{location.lat},{location.lng}',
            'location': '17.387140,78.491684',
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
        raise HTTPException(status_code=500, detail="Error fetching doctor data")
    
    
@app.post("/predict")
async def predict_prakriti(request: Request):
    input_json = await request.json()
    # input_data = json.dumps(input_json)

    async with httpx.AsyncClient() as client:
        response = await client.post("http://localhost:3000/mlmodel", json={"data": input_json})

    # return {"prediction": result, "update_response": update_response.json()}
    response = response.json()
    config.prakriti = response['prakriti'].lower()
    config.needs_refresh = True
    return JSONResponse(content={"success": True, "prakriti": config.prakriti})

mount_chainlit(app=app, target="rag-history.py", path="/chatbot")

# app.mount('/api', api)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="localhost", port=port)


