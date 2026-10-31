import React from "react";
import Weather from "components/weather";
export default function Dashboard() {
    const [timestamp, setTimestamp] = React.useState(new Date().getTime());
    const now = new Date(timestamp);
    const getNowPercent = (start, end) => Math.trunc((now.getTime() - start) / (end - start) * 10000) / 100;
    const yearfirstday = new Date(now.getFullYear(), 0, 1).getTime();
    const yearlastday = new Date(now.getFullYear() + 1, 0, 1).getTime();
    const yearProcess = getNowPercent(yearfirstday, yearlastday);
    const monthfirstday = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const monthlastday = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
    const mothProcess = getNowPercent(monthfirstday, monthlastday);
    const daystart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dayend = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
    const dayProcess = getNowPercent(daystart, dayend);
    const weekfirstday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
    const weeklastday = new Date(weekfirstday.getFullYear(), weekfirstday.getMonth(), weekfirstday.getDate() + 7);
    const weekProcess = getNowPercent(weekfirstday.getTime(), weeklastday.getTime());
    const progressItems = [
        ['Year', yearProcess],
        ['Month', mothProcess],
        ['Week', weekProcess],
        ['Today', dayProcess]
    ];
    React.useEffect(() => {
        const timeid = setTimeout(() => {
            setTimestamp(new Date().getTime());
        }, 60000);
        return () => clearTimeout(timeid);
    }, [timestamp]);
    return (
        <div className="container">
            <h1 className="page-title">Dashboard</h1>
            <section className="progress-section" aria-label="Time progress">
                {progressItems.map(([label, value]) => (
                    <article className="progress-card" key={label}>
                        <div className="progress-card-heading"><h2>{label}</h2><strong>{value}%</strong></div>
                        <div className="progress-track" role="progressbar" aria-label={`${label} progress`} aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
                            <span style={{ width: `${value}%` }} />
                        </div>
                        <p>Time elapsed this {label.toLowerCase()}</p>
                    </article>
                ))}
            </section>
            <section className="weather-section">
                <h2 className="section-title">Weather by location</h2>
                <Weather />
            </section>
        </div>
    );
};
