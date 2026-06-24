from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import cv2
import numpy as np

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return app.send_static_file(filename)

model = tf.keras.models.load_model("model.h5")

@app.route('/predict', methods=['POST'])
def predict():

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"})

    file = request.files['file']

    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)

    result = "AI Generated Image" if prediction[0][0] > 0.5 else "Real Image"

    return jsonify({
        "prediction": result,
        "confidence": float(prediction[0][0])
    })

if __name__ == '__main__':
    print('Starting backend server at http://127.0.0.1:5000')
    app.run(host='127.0.0.1', port=5000, debug=False)
