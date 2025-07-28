const dogImageContainer = document.getElementById('dog-output');
const catImageContainer = document.getElementById('cat-output');
const githubContainer = document.getElementById('github-output');

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

async function getGitHubUser(){
    // const response = await fetch("https://api.github.com/");
    const response = await fetch("https://api.github.com/users/DhanushkaChandimal");
    const data = await response.json();
    console.log(data);
    // console.log(data.avatar_url);

    const gitInnerContainer = document.createElement('div');
    gitInnerContainer.classList.add('github-inner-container');
    
    const avatar = document.createElement('img');
    avatar.src = data.avatar_url;
    avatar.alt = "GitHub User Avatar";
    gitInnerContainer.appendChild(avatar);
    
    const username = document.createElement('h2');
    username.textContent = data.login;
    gitInnerContainer.appendChild(username);
    
    const bio = document.createElement('p');
    bio.textContent = data.bio || "No bio available";
    gitInnerContainer.appendChild(bio);
    
    githubContainer.innerHTML = ''; // Clear previous images
    githubContainer.appendChild(gitInnerContainer);
}