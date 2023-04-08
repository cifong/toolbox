function weathercodeToDescription(weathercode) {
    const Description = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'partly cloudy',
        3: 'overcast',
        45: 'Fog',
        48: 'depositing rime fog',
        51: 'Light Drizzle',
        53: 'moderate Drizzle',
        55: 'dense intensity Drizzle',
        56: 'Light Freezing Drizzle',
        57: 'dense intensity Freezing Drizzle',
        61: 'slight Rain',
        63: 'moderate Rain',
        65: 'heavy intensity Rain',
        66: 'Light Freezing Rain',
        67: 'heavy intensity Freezing Rain',
        71: 'slight Snow fall',
        73: 'moderate Snow fall',
        75: 'heavy intensity Snow fall',
        77: 'Snow grains',
        80: 'slight Rain showers',
        81: 'moderate Rain showers',
        82: 'violent Rain showers',
        85: 'slight Snow showers',
        86: 'heavy Snow showers',
        95: 'Thunderstorm: Slight or moderate',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    };
    return Description[weathercode] || `unknow code ${weathercode}`;
}

export async function getWeather(lat, lon, timezone) {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    const params = {
        latitude: lat,
        longitude: lon,
        daily:  'weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset',
        current_weather: 'true',
        timeformat: 'unixtime',
        forecast_days: '3',
        timezone: timezone
    };
    url.search = new URLSearchParams(params).toString();
    return fetch(url)
            .then(response => response.json())
            .catch(error => console.error('Error:', error))
            .then(data => {
                return {
                    current: parseCurrentWeather(data),
                    daily: parseDailyWeather(data)
                }
            });
}

function parseCurrentWeather({current_weather}) {
    return {
        temperature: `${current_weather['temperature']}°C`,
        weatherdescription: weathercodeToDescription(current_weather['weathercode'])
    };
}

function parseDailyWeather({daily}) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            weatherdescription: weathercodeToDescription(daily.weathercode[index]),
            temperatureMax: `${daily.temperature_2m_max[index]}°C`,
            temperatureMin: `${daily.temperature_2m_min[index]}°C`,
            sunrise: daily.sunrise[index] * 1000,
            sunset: daily.sunset[index] * 1000
        };
    });
}