document.getElementById('search-btn').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value;
    const apiKey = '1cda3938d6ab2d1b183c636f9f53e854';
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(weatherApiUrl);
        const data = await response.json();

        if (data.cod === '404') {
            alert('City not found');
            return;
        }

        // Update current weather information
        document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('wind').textContent = `${data.wind.speed} km/hr`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('sunrise').textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();

        // Update weather icon
        const weatherCondition = data.weather[0].main.toLowerCase();
        const weatherIcon = document.getElementById('weather-icon');

        switch (weatherCondition) {
            case 'clear':
                weatherIcon.src = 'ICONS/sun.png';
                break;
            case 'rain':
                weatherIcon.src = 'ICONS/raining.png';
                break;
            case 'snow':
                weatherIcon.src = 'ICONS/snowing.png';
                break;
            case 'clouds':
                weatherIcon.src = 'ICONS/cloudy.png';
                break;
            default:
                weatherIcon.src = 'ICONS/cloudy.png'; // Default fallback icon
        }

        // Fetch hourly forecast data
        const { lat, lon } = data.coord;
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${apiKey}&units=metric`;
        const forecastResponse = await fetch(forecastApiUrl);
        const forecastData = await forecastResponse.json();

        // Update hourly forecast
        const hourlyForecast = document.getElementById('hourly-forecast');
        hourlyForecast.innerHTML = ''; // Clear previous forecast

        forecastData.hourly.slice(0, 8).forEach(hour => {
            const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temp = `${Math.round(hour.temp)}°C`;
            const iconCode = hour.weather[0].icon; // Icon code from API response
            const iconSrc = `ICONS/${iconCode}.png`; // Construct icon path

            // Debugging: Log hourly forecast data
            console.log(`Time: ${time}, Temp: ${temp}, Icon: ${iconSrc}`);

            hourlyForecast.innerHTML += `
                <div class="text-center">
                    <p class="text-gray-200">${time}</p>
                    <img src="${iconSrc}" alt="Hourly Weather Icon" class="w-12 h-12 mx-auto">
                    <p class="font-bold">${temp}</p>
                </div>
            `;
        });

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
});
