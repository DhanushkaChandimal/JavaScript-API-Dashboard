const dogImageContainer = document.getElementById('dog-output');
const catImageContainer = document.getElementById('cat-output');
const githubContainer = document.getElementById('github-output');
const jokeContainer = document.getElementById('joke-output');
const githubNameInput = document.getElementById('github-name-input');

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

async function getGitHubUser() {
    githubContainer.innerHTML = ''; // Clear previous images

    try {
        const response = await fetch(`https://api.github.com/users/${githubNameInput.value}`);
        if (!response.ok) {
            throw new Error(`User not found or error: ${response.status}`);
        }
        const data = await response.json();
        
        const gitInnerContainer = document.createElement('div');
        gitInnerContainer.classList.add('github-inner-container');
        
        const avatar = document.createElement('img');
        avatar.src = data.avatar_url;
        avatar.alt = "GitHub User Avatar";
        gitInnerContainer.appendChild(avatar);
        
        const username = document.createElement('h4');
        username.textContent = data.login;
        gitInnerContainer.appendChild(username);
        githubContainer.appendChild(gitInnerContainer);

        const bio = document.createElement('p');
        bio.textContent = data.bio || "No bio available";
        githubContainer.appendChild(bio);
        
        const profileLink = document.createElement('a');
        profileLink.href = data.html_url;
        profileLink.textContent = "View Profile";
        profileLink.target = "_blank";
        githubContainer.appendChild(profileLink);
    } catch (error) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = `Error: ${error.message}`;
        errorMsg.style.color = 'red';
        githubContainer.appendChild(errorMsg);
        console.error(error);
    }
}

async function getJoke() {
    jokeContainer.innerHTML = ''; // Clear previous jokes
    const response = await fetch("https://v2.jokeapi.dev/joke/Any?type=single&safe-mode");
    const data = await response.json();
    console.log(data);

    if (!data.error) {
        const joke = document.createElement('p');
        joke.textContent = data.joke;
        jokeContainer.appendChild(joke);
    } else {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Error fetching joke";
        errorMsg.style.color = 'red';
        jokeContainer.appendChild(errorMsg);
        console.error("Failed to fetch random joke:", data.message);
    }
}