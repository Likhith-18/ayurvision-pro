
import sys
import json
import numpy as np
import tensorflow as tf
from keras.layers import Dropout
from keras.layers import Dense
from keras.models import Sequential
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

model = tf.keras.models.load_model('./models/local_model.keras')


# model = Sequential([
#     Dense(34, input_shape=((34,)), activation='relu'),
#     Dense(30, activation='relu'),
#     Dropout(0.2),
#     Dense(20, activation='relu'),
#     Dense(10, activation='relu'),
#     Dense(3, activation='softmax')
# ])

# # Compile the model if needed
# model.compile(optimizer='adam',
#               loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# # Load the saved weights into the model
model.load_weights('./models/local_model.weights.h5')

classes = ['Kapha', 'Pitta', 'Vata']


def predict_prakriti(input_data):
    print(input_data)
    pred = model.predict(np.reshape(input_data['data'], (1, 34)))
    prediction = np.argmax(pred, axis=1)[0]
    return classes[prediction]


if __name__ == "__main__":
    # input_data = json.loads(sys.stdin.readline())
    input_data = json.loads(sys.stdin.readline())
    print(input_data)
    output = predict_prakriti(input_data)
    output = output.strip().replace("\\", "")
    print(json.dumps(output))
    sys.stdout.flush()
