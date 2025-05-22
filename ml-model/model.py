
# import sys
# import json
# import numpy as np
# import tensorflow as tf
# from keras.layers import Dropout
# from keras.layers import Dense
# from keras.models import Sequential
# import os
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
# os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# model = tf.keras.models.load_model('./models/local_model.keras')


# # model = Sequential([
# #     Dense(34, input_shape=((34,)), activation='relu'),
# #     Dense(30, activation='relu'),
# #     Dropout(0.2),
# #     Dense(20, activation='relu'),
# #     Dense(10, activation='relu'),
# #     Dense(3, activation='softmax')
# # ])

# # # Compile the model if needed
# # model.compile(optimizer='adam',
# #               loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# # # Load the saved weights into the model
# model.load_weights('./models/local_model.weights.h5')

# classes = ['Kapha', 'Pitta', 'Vata']


# def predict_prakriti(input_data):
#     print(input_data)
#     pred = model.predict(np.reshape(input_data['data'], (1, 34)))
#     prediction = np.argmax(pred, axis=1)[0]
#     return classes[prediction]


# if __name__ == "__main__":
#     # input_data = json.loads(sys.stdin.readline())
#     input_data = json.loads(sys.stdin.readline())
#     print(input_data)
#     output = predict_prakriti(input_data)
#     output = output.strip().replace("\\", "")
#     print(json.dumps(output))
#     sys.stdout.flush()


import json
import base64
import numpy as np
import tensorflow as tf
from keras.layers import Dropout
from keras.layers import Dense
from keras.models import Sequential
import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2

app = FastAPI()

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

prakriti_model = tf.keras.models.load_model('./models/prakriti/local_model.keras')
# model.load_weights('./models/local_model.weights.h5')
plant_model = tf.keras.models.load_model('./models/image')

classes = ['Kapha', 'Pitta', 'Vata']

origins = [
    "http://localhost:8000",  # fastapi app
    "https://ayurvision-server.vercel.app"  # deployement on vercel
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def hello():
    return {"msg": "this is ayurvision-mlmodel for predictions"}


@app.post('/prakriti')
async def predict_prakriti(request: Request):
    input = await request.json()
    input = input.get('data')
    input_integer = [int(x) for x in input]
    print(input_integer)
    pred = prakriti_model.predict(np.reshape(input_integer, (1, 34)))
    prediction = np.argmax(pred, axis=1)[0]
    output = classes[prediction]
    output = output.strip().replace("\\", "")
    print(output)
    return JSONResponse(content={'prakriti': output})

@app.post('/plant')
async def predict_plant(request: Request):
    data = await request.json()
    image = data.get('image')
    # Decode base64 image
    raw_image = image.split(',')[1]
    image_bytes = base64.b64decode(raw_image)
    uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
    file_path = os.path.join(uploads_dir, "plant.jpg")
    with open(file_path, "wb") as f:
        f.write(image_bytes)
    image = cv2.imread(str('./uploads/plant.jpg'))
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    resized_img = cv2.resize(image, (128, 128))
    resized_img = resized_img.astype('float32') / 255.0  # Normalize
    logits=plant_model.predict(resized_img[np.newaxis,...])
    activations=tf.nn.softmax(logits)
    prediction = np.argmax(activations, axis=1)[0]
    plant = plant_classes[prediction]
    print(plant)
    return JSONResponse(content={'plant': plant})
# async def execute_prediction(input_json):
#     output = await predict_prakriti(input_json)
#     output = output.strip().replace("\\", "")
#     return JSONResponse(content={'prakriti': output})

plant_classes = [
    'Alpinia Galanga (Rasna)',
    'Amaranthus Viridis (Arive-Dantu)',
    'Artocarpus Heterophyllus (Jackfruit)',
    'Azadirachta Indica (Neem)',
    'Basella Alba (Basale)',
    'Brassica Juncea (Indian Mustard)',
    'Carissa Carandas (Karanda)',
    'Citrus Limon (Lemon)',
    'Ficus Auriculata (Roxburgh fig)',
    'Ficus Religiosa (Peepal Tree)',
    'Hibiscus Rosa-sinensis',
    'Jasminum (Jasmine)',
    'Mangifera Indica (Mango)',
    'Mentha (Mint)',
    'Moringa Oleifera (Drumstick)',
    'Muntingia Calabura (Jamaica Cherry-Gasagase)',
    'Murraya Koenigii (Curry)',
    'Nerium Oleander (Oleander)',
    'Nyctanthes Arbor-tristis (Parijata)',
    'Ocimum Tenuiflorum (Tulsi)',
    'Piper Betle (Betel)',
    'Plectranthus Amboinicus (Mexican Mint)',
    'Pongamia Pinnata (Indian Beech)',
    'Psidium Guajava (Guava)',
    'Punica Granatum (Pomegranate)',
    'Santalum Album (Sandalwood)',
    'Syzygium Cumini (Jamun)',
    'Syzygium Jambos (Rose Apple)',
    'Tabernaemontana Divaricata (Crape Jasmine)',
    'Trigonella Foenum-graecum (Fenugreek)'
]

if __name__ == '__main__':
    import uvicorn
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
    os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
    uvicorn.run(app, host="localhost", port=3000)
