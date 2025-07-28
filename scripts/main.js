const dogImageContainer = document.getElementById('dog-output');

async function getDogImage() {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await response.json();
    if (data.status === "success") {
        const img = document.createElement('img');
        img.src = data.message;
        img.alt = "Random Dog Image";
        dogImageContainer.innerHTML = ''; // Clear previous images
        dogImageContainer.appendChild(img);
    } else {
        console.error("Failed to fetch dog image:", data.message);
    }
}