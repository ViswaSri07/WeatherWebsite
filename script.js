const apiKey = '06019d0bb17995494172dd9456532e47'; // Replace with your OpenWeather API key
let city = 'Belgrade';
const units = 'metric';
const apiURL = city => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
const forecastURL = city => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;

document.addEventListener('DOMContentLoaded', () => {
    fetchWeather(city);
    fetchForecast(city);

    document.getElementById('search-button').addEventListener('click', () => {
        const input = document.querySelector('input[type="text"]'); // Consider using a more specific selector

        const searchCity = input.value.trim();
        
        if (searchCity) {
            city = searchCity;
            fetchWeather(city);
            fetchForecast(city);
            input.value = ''; // Clear the input field
        }
    });
});

function fetchWeather(city) {
    fetch(apiURL(city))
        .then(response => response.json())
        .then(data => {
            document.getElementById('date').innerText = new Date().toLocaleDateString();
            document.getElementById('city-name').innerText = city;
            document.getElementById('temperature').innerText = `${data.main.temp}°C`;
            document.getElementById('description').innerText = data.weather[0].description;
            document.getElementById('feels_like').innerText = `Feels like ${data.main.feels_like}°C`;
            document.getElementById('humidity').innerText = `${data.main.humidity}%`;
            document.getElementById('precipitation').innerText = `${data.clouds.all}%`;
            document.getElementById('uv_index').innerText = '6 (High)'; // UV index needs another API call

            // Set weather icon
            const icon = getWeatherIcon(data.weather[0].main);
            document.getElementById('weather_icon').src = `icons/${icon}.png`;
            document.getElementById('weather_icon').alt = data.weather[0].description;
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function fetchForecast(city) {
    fetch(forecastURL(city))
        .then(response => response.json())
        .then(data => {
            const forecastElement = document.getElementById('forecast');
            forecastElement.innerHTML = ''; // Clear previous forecast data
            for (let i = 0; i < data.list.length; i += 8) { // 8 intervals per day
                const day = data.list[i];
                const date = new Date(day.dt_txt).toLocaleDateString();
                const temp = day.main.temp;
                const description = day.weather[0].description;
                const icon = getWeatherIcon(day.weather[0].main);
                forecastElement.innerHTML += `
                    <div class="bg-gray-100 p-4 rounded-lg text-center">
                        <img src="icons/${icon}.png" alt="${description}" class="w-10 h-10 mx-auto">
                        <p>${date}</p>
                        <p class="text-lg font-bold">${temp}°C</p>
                        <p>${description}</p>
                    </div>
                `;
            }
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}


function getWeatherIcon(condition) {
    switch (condition.toLowerCase()) {
        case 'clear':
            return 'sunny';
        case 'clouds':
            return 'cloud';
        case 'rain':
            return 'rainy';
        case 'snow':
            return 'snowy';
        case 'thunderstorm':
            return 'thunder';
        case 'drizzle':
            return 'drizzle';
        case 'mist':
            return 'mist';
        case 'haze':
            return 'haze';
        default:
            return 'unknown';
    }
}
