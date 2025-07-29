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

async function getWeather() {
    weatherContainer.innerHTML = '';
    const location = await fetch(`https://corsproxy.io/?https://www.zipcodeapi.com/rest/DemoOnly00p5g105NIMgcs7xLprpBsICspEFKkTcC4HcueQAg8ARdqXv3PG5MgsW/info.json/${zipcodeInput.value}/degrees`);
    if (!location.ok) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Invalid zipcode entered or unable to fetch location.";
        errorMsg.style.color = 'red';
        weatherContainer.appendChild(errorMsg);
        return;
    }
    const locationData = await location.json();

    // console.log(locationData);

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${locationData.lat}&longitude=${locationData.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`);
    const data = await response.json();

    // console.log(data);

    const element = document.createElement('p');
    element.textContent = 
        `${locationData.city}, ${locationData.state}\n
        Temperature: ${data.current.temperature_2m}°F
        Relative Humidity: ${data.current.relative_humidity_2m}%
        Wind Speed: ${data.current.wind_speed_10m} mph
        Weather: ${weatherCodeToDescription[data.current.weather_code] || "Unknown"}`;
    element.style.whiteSpace = 'pre-line';
    weatherContainer.appendChild(element);

}

async function fetchExchangeRates() {
    const currencies = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json");
    exchangeRateList = await currencies.json();
    const dataList = document.createElement('datalist');
    dataList.id = 'currencies';

    for (let currency in exchangeRateList.usd) {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        dataList.appendChild(option);
        // console.log(`${currency} - ${exchangeRateList.usd[currency]}`);
    }

    currencyForm.appendChild(dataList);
    // console.log(dataList)
}

async function getExchangeRates() {
    let fromRate = exchangeRateList.usd[fromValueElement.value];
    let toRate = exchangeRateList.usd[toValueElement.value];
    // console.log(fromRate, toRate);
    // console.log(fromRate, toRate);

    if (!fromRate || !toRate) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Invalid currency selected.";
        exchangeRatesContainer.innerHTML = ''; // Clear previous results
        exchangeRatesContainer.appendChild(errorMsg);
    }else{
        const amount = document.getElementById('amount-input').value;
        const exchangeResultElement = document.createElement('p');
        exchangeResultElement.textContent = `Exchange Rate: ${(amount * toRate / fromRate).toFixed(4)}`;
        exchangeRatesContainer.innerHTML = ''; // Clear previous results
        exchangeRatesContainer.appendChild(exchangeResultElement);

    }
}

async function getMovies() {
    moviesContainer.innerHTML = ''; // Clear previous content
    const response = await fetch("https://api.themoviedb.org/3/trending/movie/day", {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNTc4YWFlN2Y0NDYyZTViNGVkYzQyMDYzNjQ0NmQ5OCIsIm5iZiI6MTc1MzczNDE5Ny43MTksInN1YiI6IjY4ODdkYzM1YTg1NGU0MmViM2Y3OTZlOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G1BlyixM9bLMm4NE9p0j2A-cPahKo3XJcY9lMTafxww"
        }
    });
    const data = await response.json();

    // console.log(data);
    // console.log(data.results);

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

}

async function getGitHubUser() {
    githubContainer.innerHTML = ''; // Clear previous content
    
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

async function getQRCode() {
    if (!qrInput.value) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Please enter text to generate QR code.";
        qrCodeContainer.innerHTML = '';
        qrCodeContainer.appendChild(errorMsg);
        return;
    }

    // Check if input is a valid URL
    let isValidUrl = false;
    try {
        new URL(qrInput.value);
        isValidUrl = true;
    } catch (e) {
        isValidUrl = false;
    }

    qrCodeContainer.innerHTML = '';
    if (!isValidUrl) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Please enter a valid URL (e.g., https://example.com).";
        qrCodeContainer.appendChild(errorMsg);
        return;
    }

    const img = document.createElement('img');
    img.src = "https://qrtag.net/api/qr_4.png?url=" + encodeURIComponent(qrInput.value);
    img.alt = "QR tag";
    qrCodeContainer.appendChild(img);
}

document.addEventListener('DOMContentLoaded', fetchExchangeRates);
