import os
import random
import cv2
import numpy as np
import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.normpath(os.path.join(BASE_DIR, "..", "data"))
MODEL_PATH = os.path.join(BASE_DIR, "model.h5")
CLASS_MAPPING = {"real": 0, "ai_generated": 1}
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 10


def load_images_and_labels(data_dir):
    images = []
    labels = []

    for class_name, label in CLASS_MAPPING.items():
        class_dir = os.path.join(data_dir, class_name)
        if not os.path.isdir(class_dir):
            continue

        for filename in os.listdir(class_dir):
            if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
                continue

            path = os.path.join(class_dir, filename)
            img = cv2.imread(path)
            if img is None:
                print(f"Warning: could not read {path}")
                continue

            img = cv2.resize(img, IMAGE_SIZE)
            img = img.astype(np.float32) / 255.0
            images.append(img)
            labels.append(label)

    if len(images) == 0:
        raise ValueError("No images found. Add files to data/real and data/ai_generated.")

    return np.array(images), np.array(labels)


if __name__ == "__main__":
    print("Loading images...")
    images, labels = load_images_and_labels(DATA_DIR)

    print(f"Loaded {len(images)} images.")

    indices = np.arange(len(images))
    np.random.shuffle(indices)
    images = images[indices]
    labels = labels[indices]

    split_index = int(len(images) * 0.8)
    train_images, val_images = images[:split_index], images[split_index:]
    train_labels, val_labels = labels[:split_index], labels[split_index:]

    train_dataset = tf.data.Dataset.from_tensor_slices((train_images, train_labels)).batch(BATCH_SIZE).shuffle(256)
    val_dataset = tf.data.Dataset.from_tensor_slices((val_images, val_labels)).batch(BATCH_SIZE)

    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3)),
        tf.keras.layers.Conv2D(32, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Conv2D(128, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(1, activation="sigmoid"),
    ])

    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

    print("Training model...")
    model.fit(train_dataset, validation_data=val_dataset, epochs=EPOCHS)

    print(f"Saving model to {MODEL_PATH}")
    model.save(MODEL_PATH)
    print("Training complete.")
