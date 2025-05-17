const apiKey = 'f10b555ef2a23df90f1d9cb450e58962'; // OpenWeatherMap API key (replace if invalid)
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const resetButton = document.getElementById('resetButton');
const searchButton = document.getElementById('searchButton');
const weatherContainer = document.getElementById('weatherContainer');

// Function to fetch and display weather data
async function fetchWeather(city) {
    weatherResult.innerHTML = '<p>Loading...</p>';
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        if (!weatherResponse.ok) throw new Error('City not found');
        if (!forecastResponse.ok) throw new Error('Forecast data not available');

        const data = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        // Log forecast data to debug
        console.log("Forecast Data:", forecastData);

        // Map weather conditions to icons
        let weatherIcon = '☁️'; // Default
        const weatherMain = data.weather[0].main.toLowerCase();
        if (weatherMain.includes('rain')) {
            weatherIcon = '🌧️';
        } else if (weatherMain.includes('clear')) {
            weatherIcon = '☀️';
        } else if (weatherMain.includes('cloud')) {
            weatherIcon = '⛅';
        }

        weatherResult.innerHTML = `
            <div class="weather-card">
                <div class="weather-icon">${weatherIcon}</div>
                <div class="temperature">${data.main.temp}°C</div>
                <div class="city-name">${data.name}</div>
                <div class="weather-details">
                    <span><span class="icon">💧</span>${data.main.humidity}% Humidity</span>
                    <span><span class="icon">💨</span>${data.wind.speed} km/h Wind Speed</span>
                </div>
            </div>
            <div id="forecastContainer">
                <h3>5-Day Forecast</h3>
                <div id="forecastDetails"></div>
            </div>
        `;

        let forecastHTML = '';
        forecastData.list.forEach((item, index) => {
            if (index % 8 === 0) {
                const date = new Date(item.dt * 1000).toDateString();
                let forecastIcon = '☁️'; // Default
                const forecastMain = item.weather[0].main.toLowerCase();
                if (forecastMain.includes('rain')) {
                    forecastIcon = '🌧️';
                } else if (forecastMain.includes('clear')) {
                    forecastIcon = '☀️';
                } else if (forecastMain.includes('cloud')) {
                    forecastIcon = '⛅';
                }

                forecastHTML += `
                    <div class="forecast-card">
                        <div class="weather-icon">${forecastIcon}</div>
                        <div class="temperature">${item.main.temp}°C</div>
                        <div class="forecast-date">${date}</div>
                        <div class="forecast-details">
                            <span><span class="icon">💧</span>${item.main.humidity}%</span>
                            <span><span class="icon">💨</span>${item.wind.speed} km/h</span>
                        </div>
                    </div>
                `;
            }
        });

        const forecastDetails = document.getElementById('forecastDetails');
        forecastDetails.innerHTML = forecastHTML;

        // Add 'active' class to weather container
        weatherContainer.classList.add('active');

        // Add 'show' class to weather card for fade-in effect
        document.querySelector('.weather-card').classList.add('show');

        // Add 'show' class to forecast cards for fade-in effect
        document.querySelectorAll('.forecast-card').forEach(card => card.classList.add('show'));

        // Save the city name to localStorage
        localStorage.setItem('lastCity', city);

    } catch (error) {
        weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
        weatherContainer.classList.remove('active');
        console.error("Fetch Error:", error);
    }
}

// Weather search
searchButton.addEventListener('click', async () => {
    const city = cityInput.value.trim();

    if (city === '') {
        weatherResult.innerHTML = '<p>Please enter a city name.</p>';
        weatherContainer.classList.remove('active');
        return;
    }

    searchButton.disabled = true;
    await fetchWeather(city);
    searchButton.disabled = false;
});

// Reset button
resetButton.addEventListener('click', () => {
    cityInput.value = '';
    weatherResult.innerHTML = `
        <div class="placeholder">
            <span class="placeholder-icon">🔍</span>
            <p>Search for a city to see the weather!</p>
        </div>
    `;
    weatherContainer.classList.remove('active');
    cityInput.focus();
});