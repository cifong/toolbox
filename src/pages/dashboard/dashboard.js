import React from "react";
export default function Dashboard() {
    const [timestamp, setTimestamp] = React.useState(new Date().getTime());
    const now = new Date(timestamp);
    const getNowPercent = (start, end) => Math.trunc((now.getTime() - start) / (end - start) * 10000) / 100;
    const yearfirstday = new Date(now.getFullYear(), 0, 1).getTime();
    const yearlastday = new Date(now.getFullYear() + 1, 0, 1).getTime();
    const yearProcess = getNowPercent(yearfirstday, yearlastday);
    const yearStyle = {
        backgroundImage: `linear-gradient(to right, #f90 0%, #f90 ${yearProcess}%, white 0, white 100%)`
    };
    const monthfirstday = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const monthlastday = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
    const mothProcess = getNowPercent(monthfirstday, monthlastday);
    const monthStyle = {
        backgroundImage: `linear-gradient(to right, #f90 0%, #f90 ${mothProcess}%, white 0, white 100%)`
    };
    const daystart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dayend = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
    const dayProcess = getNowPercent(daystart, dayend);
    const dayStyle = {
        backgroundImage: `linear-gradient(to right, #f90 0%, #f90 ${dayProcess}%, white 0, white 100%)`
    };
    const weekfirstday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
    const weeklastday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7 - now.getDay()).getTime();
    const weekProcess = getNowPercent(weekfirstday, weeklastday);
    const weekStyle = {
        backgroundImage: `linear-gradient(to right, #f90 0%, #f90 ${weekProcess}%, white 0, white 100%)`
    };
    React.useEffect(() => {
        const timeid = setTimeout(() => {
            setTimestamp(new Date().getTime());
        }, 60000);
        return () => clearTimeout(timeid);
    }, [timestamp])
    return (
        <div className="container">
            <p> Dashboard: {now.toLocaleDateString()}</p>
            <p>The Years Process</p>
            <div className="time-process" style={yearStyle}>{yearProcess}%</div>
            <p>The Month Process:</p>
            <div className="time-process" style={monthStyle}>{mothProcess}%</div>
            <p>The Week Process:</p>
            <div className="time-process" style={weekStyle}>{weekProcess}%</div>
            <p>The Day Percent:</p>
            <div className="time-process" style={dayStyle}>{dayProcess}%</div>
        </div>
    );
};