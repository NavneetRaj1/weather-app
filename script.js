const apiKey = 'f10b555ef2a23df90f1d9cb450e58962'; // Replace with your API key
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const resetButton = document.getElementById('resetButton');

weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (city === '') {
        weatherResult.innerHTML = '<p>Please enter a city name.</p>';
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();

        weatherResult.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            <p>Pressure: ${data.main.pressure} hPa</p>
        `;

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!forecastResponse.ok) throw new Error('Forecast data not available');
        const forecastData = await forecastResponse.json();

        let forecastHTML = '<h3>5-Day Forecast</h3>';
        forecastData.list.forEach((item, index) => {
            if (index % 8 === 0) {
                const date = new Date(item.dt * 1000).toDateString();
                forecastHTML += `
                    <p>${date}: ${item.main.temp}°C, ${item.weather[0].description}</p>
                `;
            }
        });
        weatherResult.innerHTML += forecastHTML;

    } catch (error) {
        weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

resetButton.addEventListener('click', () => {
    cityInput.value = '';
    weatherResult.innerHTML = '';
    cityInput.focus();
});