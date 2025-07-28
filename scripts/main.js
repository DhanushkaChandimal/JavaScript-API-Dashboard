const dogImageContainer = document.getElementById('dog-output');
const catImageContainer = document.getElementById('cat-output');
const githubContainer = document.getElementById('github-output');
const jokeContainer = document.getElementById('joke-output');
const exchangeRatesContainer = document.getElementById('currency-output');
const weatherContainer = document.getElementById('weather-output');
const currencyForm = document.getElementById('currency-form');
const fromValueElement = document.getElementById('currency-input-from');
const toValueElement = document.getElementById('currency-input-to');
const githubNameInput = document.getElementById('github-name-input');

let exchangeRateList;

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
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=30.2672&longitude=-97.7431&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch");
    const data = await response.json();

    console.log(data);

    const element = document.createElement('p');
    element.textContent = 
        `Temperature: ${data.current.temperature_2m}°F\n\n` +
        `Relative Humidity: ${data.current.relative_humidity_2m}%\n\n` +
        `Wind Speed: ${data.current.wind_speed_10m} mph\n\n` +
        `Weather Code: ${data.current.weather_code}`;
    element.style.whiteSpace = 'pre-line';
    weatherContainer.innerHTML = ''; // Clear previous results
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
    console.log(fromRate, toRate);

    if (!fromRate || !toRate) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = "Invalid currency selected.";
        exchangeRatesContainer.innerHTML = ''; // Clear previous results
        exchangeRatesContainer.appendChild(errorMsg);
    }else{
        const amount = document.getElementById('amount-input').value;
        const exchangeResultElement = document.createElement('p');
        exchangeResultElement.textContent = `Exchange Rate: ${(amount * fromRate / toRate).toFixed(4)}`;
        exchangeRatesContainer.innerHTML = ''; // Clear previous results
        exchangeRatesContainer.appendChild(exchangeResultElement);

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

document.addEventListener('DOMContentLoaded', fetchExchangeRates);