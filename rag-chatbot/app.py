
from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from chainlit.utils import mount_chainlit
from pydantic import BaseModel
from config import config
import os
import httpx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# api = FastAPI()


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


@app.get('/')
def hello():
    return "hello form likhtih"


# @app.post('/update-prakriti')
# async def update_prakriti(request: PrakritiUpdateRequest):
#     config.prakriti = request.prakriti.lower()
#     config.needs_refresh = True
#     return JSONResponse(content={"success": True, "prakriti": config.prakriti})


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
