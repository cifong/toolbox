import React from "react";

import { getWeather } from "data/weather";

const location = [
    [23.9603411, 120.470693, 'Xihu'],
    [24.1435786, 120.6561373, 'Nantun']
];
function WeatherItem(props) {
    const [weatherData, setWeatherData] = React.useState(null);
    const [error, setError] = React.useState(false);
    const [requestId, setRequestId] = React.useState(0);
    React.useEffect(() => {
        let active = true;
        setWeatherData(null);
        setError(false);
        getWeather(props.lat, props.lon, Intl.DateTimeFormat().resolvedOptions().timeZone)
            .then(res => { if (active) setWeatherData(res); })
            .catch(() => { if (active) setError(true); });
        return () => { active = false; };
    }, [props.lat, props.lon, requestId]);
    if (error) {
        return <section className="weatherItem" aria-label={`${props.place} weather`}>
            <h3>{props.place}</h3>
            <p className="weather-error" role="alert">Weather could not be loaded. Check your connection, then try again.</p>
            <button type="button" className="weather-retry" onClick={() => { setError(false); setRequestId(id => id + 1); }}>Try again</button>
        </section>;
    }

    if (!weatherData) {
        return <section className="weatherItem" aria-label={`${props.place} weather`} aria-busy="true">
            <h3>{props.place}</h3>
            <p className="weather-loading" role="status">Loading weather…</p>
        </section>;
    }

    if (weatherData.daily.length === 0) {
        return <section className="weatherItem" aria-label={`${props.place} weather`}>
            <h3>{props.place}</h3>
            <p className="weather-error" role="status">No forecast data is available for this location right now. Try again later.</p>
            <button type="button" className="weather-retry" onClick={() => setRequestId(id => id + 1)}>Try again</button>
        </section>;
    }

    const options = {  month: 'numeric', day: 'numeric' };
    const dailyWeather = weatherData.daily.map((info, index) => {
        return <div key={index}>
            <div>{new Date(info.timestamp).toLocaleDateString(undefined, options)} · {info.weatherdescription} · {info.temperatureMin} ~ {info.temperatureMax}</div>
            <div>Sunrise: {new Date(info.sunrise).toLocaleTimeString()} · Sunset: {new Date(info.sunset).toLocaleTimeString()}</div>
        </div>;
    });
    return <section className="weatherItem" aria-label={`${props.place} weather`}>
        <div className="curWeather">
            <h3>{props.place}</h3>
            <strong>{weatherData.current.temperature}</strong>
            <span>{weatherData.current.weatherdescription}</span>
        </div>
        <div className="dailyWeather">
            {dailyWeather}
        </div>
    </section>
}
export default function Weather() {

    const weatherContent = location.map((info, index) => {
        return <WeatherItem lat={info[0]} lon={info[1]} place={info[2]} key={index} />
    });

    return (
        <div className="weather-wrapper">
            {weatherContent}
        </div>
    );
}
