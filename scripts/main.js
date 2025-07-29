const dogImageContainer = document.getElementById('dog-output');
const catImageContainer = document.getElementById('cat-output');
const githubContainer = document.getElementById('github-output');
const jokeContainer = document.getElementById('joke-output');
const exchangeRatesContainer = document.getElementById('currency-output');
const weatherContainer = document.getElementById('weather-output');
const moviesContainer = document.getElementById('movies-output');
const qrCodeContainer = document.getElementById('qr-output');
const currencyForm = document.getElementById('currency-form');
const fromValueElement = document.getElementById('currency-input-from');
const toValueElement = document.getElementById('currency-input-to');
const githubNameInput = document.getElementById('github-name-input');
const qrInput = document.getElementById('qr-input');
const zipcodeInput = document.getElementById('zipcode-input');

let exchangeRateList;

const weatherCodeToDescription = {
    0: "Clear sky",
    1: "Mainly clear, partly cloudy, and overcast",
    2: "Mainly clear, partly cloudy, and overcast",
    3: "Mainly clear, partly cloudy, and overcast",
    45: "Fog and depositing rime fog",
    48: "Fog and depositing rime fog",
    51: "Drizzle: Light, moderate, and dense intensity",
    53: "Drizzle: Light, moderate, and dense intensity",
    55: "Drizzle: Light, moderate, and dense intensity",
    56: "Freezing Drizzle: Light and dense intensity",
    57: "Freezing Drizzle: Light and dense intensity",
    61: "Rain: Slight, moderate and heavy intensity",
    63: "Rain: Slight, moderate and heavy intensity",
    65: "Rain: Slight, moderate and heavy intensity",
    66: "Freezing Rain: Light and heavy intensity",
    67: "Freezing Rain: Light and heavy intensity",
    71: "Snow fall: Slight, moderate, and heavy intensity",
    73: "Snow fall: Slight, moderate, and heavy intensity",
    75: "Snow fall: Slight, moderate, and heavy intensity",
    77: "Snow grains",
    80: "Rain showers: Slight, moderate, and violent",
    81: "Rain showers: Slight, moderate, and violent",
    82: "Rain showers: Slight, moderate, and violent",
    85: "Snow showers slight and heavy",
    86: "Snow showers slight and heavy",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight and heavy hail",
    99: "Thunderstorm with slight and heavy hail"
}

// Helper to show error messages
function showError(container, message) {
    container.innerHTML = '';
    const errorMsg = document.createElement('p');
    errorMsg.textContent = message;
    errorMsg.style.color = 'red';
    container.appendChild(errorMsg);
}

// Spinner utility
function showSpinner(container) {
    container.innerHTML = '<div class="spinner"></div>';
}

// DOG IMAGE
async function getDogImage() {
    showSpinner(dogImageContainer);
    try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await response.json();
        dogImageContainer.innerHTML = '';
        if (data.status === "success") {
            const img = document.createElement('img');
            img.src = data.message;
            img.alt = "Random Dog Image";
            dogImageContainer.appendChild(img);
        } else {
            showError(dogImageContainer, "Failed to fetch dog image");
        }
    } catch {
        showError(dogImageContainer, "Failed to fetch dog image");
    }
}

// CAT IMAGE
async function getCatImage() {
    showSpinner(catImageContainer);
    try {
        const response = await fetch("https://api.thecatapi.com/v1/images/search");
        const data = await response.json();
        catImageContainer.innerHTML = '';
        if (data.length > 0) {
            const img = document.createElement('img');
            img.src = data[0].url;
            img.alt = "Random Cat Image";
            catImageContainer.appendChild(img);
        } else {
            showError(catImageContainer, "Failed to fetch cat image");
        }
    } catch {
        showError(catImageContainer, "Failed to fetch cat image");
    }
}

// WEATHER
async function getWeather() {
    showSpinner(weatherContainer);
    try {
        const location = await fetch(`https://corsproxy.io/?https://www.zipcodeapi.com/rest/DemoOnly00p5g105NIMgcs7xLprpBsICspEFKkTcC4HcueQAg8ARdqXv3PG5MgsW/info.json/${zipcodeInput.value}/degrees`);
        if (!location.ok) throw new Error();
        const locationData = await location.json();

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${locationData.lat}&longitude=${locationData.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`);
        const data = await response.json();

        weatherContainer.innerHTML = '';
        const element = document.createElement('p');
        element.textContent =
            `${locationData.city}, ${locationData.state}\n
Temperature: ${data.current.temperature_2m}°F
Relative Humidity: ${data.current.relative_humidity_2m}%
Wind Speed: ${data.current.wind_speed_10m} mph
Weather: ${weatherCodeToDescription[data.current.weather_code] || "Unknown"}`;
        element.style.whiteSpace = 'pre-line';
        weatherContainer.appendChild(element);
    } catch {
        showError(weatherContainer, "Invalid zipcode entered or unable to fetch location.");
    }
}

// EXCHANGE RATES
async function fetchExchangeRates() {
    showSpinner(exchangeRatesContainer);
    try {
        const currencies = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json");
        exchangeRateList = await currencies.json();
        const dataList = document.createElement('datalist');
        dataList.id = 'currencies';

        for (let currency in exchangeRateList.usd) {
            const option = document.createElement('option');
            option.value = currency;
            dataList.appendChild(option);
        }
        currencyForm.appendChild(dataList);
        exchangeRatesContainer.innerHTML = '';
    } catch {
        showError(exchangeRatesContainer, "Failed to fetch exchange rates.");
    }
}

async function getExchangeRates() {
    showSpinner(exchangeRatesContainer);
    let fromRate = exchangeRateList.usd[fromValueElement.value];
    let toRate = exchangeRateList.usd[toValueElement.value];

    if (!fromRate || !toRate) {
        showError(exchangeRatesContainer, "Invalid currency selected.");
    } else {
        const amount = document.getElementById('amount-input').value;
        const exchangeResultElement = document.createElement('p');
        exchangeResultElement.textContent = `Exchange Rate: ${(amount * toRate / fromRate).toFixed(4)}`;
        exchangeRatesContainer.innerHTML = '';
        exchangeRatesContainer.appendChild(exchangeResultElement);
    }
}

// MOVIES
async function getMovies() {
    showSpinner(moviesContainer);
    try {
        const response = await fetch("https://api.themoviedb.org/3/trending/movie/day", {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNTc4YWFlN2Y0NDYyZTViNGVkYzQyMDYzNjQ0NmQ5OCIsIm5iZiI6MTc1MzczNDE5Ny43MTksInN1YiI6IjY4ODdkYzM1YTg1NGU0MmViM2Y3OTZlOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G1BlyixM9bLMm4NE9p0j2A-cPahKo3XJcY9lMTafxww"
            }
        });
        const data = await response.json();
        moviesContainer.innerHTML = '';
        for (let i = 0; i < 5 && i < Math.max(data.results.length, 5); i++) {
            const poster = document.createElement('img');
            poster.src = `https://image.tmdb.org/t/p/w500/${data.results[i].poster_path}`;
            poster.alt = "Movie Poster";
            const movieTitle = document.createElement('p');
            movieTitle.textContent = data.results[i].title;
            const rowContainer = document.createElement('div');
            rowContainer.classList.add('movie-row');
            rowContainer.appendChild(poster);
            rowContainer.appendChild(movieTitle);
            moviesContainer.appendChild(rowContainer);
        }
    } catch {
        showError(moviesContainer, "Failed to fetch movies.");
    }
}

// GITHUB USER
async function getGitHubUser() {
    showSpinner(githubContainer);
    try {
        const response = await fetch(`https://api.github.com/users/${githubNameInput.value}`);
        if (!response.ok) throw new Error();
        const data = await response.json();

        githubContainer.innerHTML = '';
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
    } catch {
        showError(githubContainer, "User not found or error fetching user.");
    }
}

// JOKE
async function getJoke() {
    showSpinner(jokeContainer);
    try {
        const response = await fetch("https://v2.jokeapi.dev/joke/Any?type=single&safe-mode");
        const data = await response.json();
        jokeContainer.innerHTML = '';
        if (!data.error) {
            const joke = document.createElement('p');
            joke.textContent = data.joke;
            jokeContainer.appendChild(joke);
        } else {
            showError(jokeContainer, "Error fetching joke");
        }
    } catch {
        showError(jokeContainer, "Error fetching joke");
    }
}

// QR CODE
async function getQRCode() {
    showSpinner(qrCodeContainer);
    if (!qrInput.value) {
        showError(qrCodeContainer, "Please enter text to generate QR code.");
        return;
    }

    let isValidUrl = false;
    try {
        new URL(qrInput.value);
        isValidUrl = true;
    } catch {
        isValidUrl = false;
    }

    if (!isValidUrl) {
        showError(qrCodeContainer, "Please enter a valid URL (e.g., https://example.com).");
        return;
    }

    qrCodeContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = "https://qrtag.net/api/qr_4.png?url=" + encodeURIComponent(qrInput.value);
    img.alt = "QR tag";
    qrCodeContainer.appendChild(img);
}

document.addEventListener('DOMContentLoaded', fetchExchangeRates);
