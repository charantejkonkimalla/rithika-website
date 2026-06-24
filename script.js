const fileInput = document.getElementById('imageInput');
const resultElement = document.getElementById('result');
const previewImage = document.getElementById('preview');
const loader = document.getElementById('loader');
const predictButton = document.getElementById('predictButton');

fileInput.addEventListener('change', () => {
    if (fileInput.files.length === 0) {
        previewImage.src = '';
        previewImage.alt = 'No image selected';
        resultElement.textContent = 'No image selected yet.';
        return;
    }

    const file = fileInput.files[0];
    previewImage.src = URL.createObjectURL(file);
    previewImage.alt = file.name;
    resultElement.textContent = 'Ready to detect.';
});

async function predictImage() {
    if (fileInput.files.length === 0) {
        resultElement.textContent = 'Please select an image first.';
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    predictButton.disabled = true;
    predictButton.textContent = 'Detecting...';
    loader.classList.remove('hidden');
    resultElement.textContent = 'Analyzing image, please wait...';

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(Server returned ${response.status});
        }

        const data = await response.json();
        resultElement.innerHTML = <strong>${data.prediction}</strong><br>Confidence: ${Number(data.confidence).toFixed(4)};
    } catch (error) {
        resultElement.textContent = Error: ${error.message};
    } finally {
        predictButton.disabled = false;
        predictButton.textContent = 'Detect Image';
        loader.classList.add('hidden');
    }
}
