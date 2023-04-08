import React from "react";

import { getWeather } from "data/weather";

const location = [
    [23.9603411, 120.470693, 'Xihu'],
    [24.1435786, 120.6561373, 'Nantun']
];
function WeatherItem(props) {
    const [weatherData, setWeatherData] = React.useState(null);
    React.useEffect(() => {
        getWeather(props.lat, props.lon, Intl.DateTimeFormat().resolvedOptions().timeZone)
            .then(res => setWeatherData(res));
    }, [props.lat, props.lon]);
    console.log(weatherData);
    if (!weatherData) {
        return <div className="weatherItem">
            loading!
        </div>
    }

    const options = {  month: 'numeric', day: 'numeric' };
    const dailyWeather = weatherData.daily.map((info, index) => {
        return <div key={index}>
            <div>{new Date(info.timestamp).toLocaleDateString(undefined, options)} {info.weatherdescription}  {info.temperatureMin} ~ {info.temperatureMax}</div>
            <div>sunrise: {new Date(info.sunrise).toLocaleTimeString()} sunset: {new Date(info.sunset).toLocaleTimeString()}</div>
        </div>;
    });
    return <div className="weatherItem">
        <div className="curWeather">
            <div>{props.place}</div>
            <div>{weatherData.current.temperature}</div>
            <div>{weatherData.current.weatherdescription}</div>
        </div>
        <div className="dailyWeather">
            {dailyWeather}
        </div>
    </div>
}
export default function Weather() {

    const weatherContent = location.map((info, index) => {
        return <WeatherItem lat={info[0]} lon={info[1]} place={info[2]} key={index} />
    });

    return (
        <div className="weatherWraooer">
            {weatherContent}
        </div>
    );
}