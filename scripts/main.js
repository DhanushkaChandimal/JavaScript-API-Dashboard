const dogImageContainer = document.getElementById('dog-output');
const catImageContainer = document.getElementById('cat-output');

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

async function getCatImage() {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await response.json();
    // console.log(data[0]);
    if (data.length > 0) {
        const img = document.createElement('img');
        img.src = data[0].url;
        img.alt = "Random Cat Image";
        catImageContainer.innerHTML = ''; // Clear previous images
        catImageContainer.appendChild(img);
    } else {
        console.error("Failed to fetch cat image");
    }
}