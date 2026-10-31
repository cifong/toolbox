import React from "react";
import { useStorage, useAuth } from "hooks/customhooks";

function WorkTimeInfo(props) {
    const { workingHours, workingMinutes, lunchBreakHours, lunchBreakMinutes, dayOffHours, dayOffMinutes, punchInTime } = props.data;
    if (!punchInTime) {
        return <></>;
    }
    const totalWorkMinutes = (workingHours - dayOffHours) * 60 + (workingMinutes - dayOffMinutes) * 1;
    const totalLunchBreakMinutes = lunchBreakHours * 60 + lunchBreakMinutes * 1;
    const getPunchOutTime = () => {
        const lunchBreakStart = new Date(punchInTime);
        lunchBreakStart.setHours(12, 0, 0);
        const lunchBreakEnd = new Date(lunchBreakStart);
        lunchBreakEnd.setMinutes(lunchBreakEnd.getMinutes() + totalLunchBreakMinutes);
        const punchoutTime = new Date(punchInTime);
        if (punchoutTime >= lunchBreakStart) {
            punchoutTime.setTime(Math.max(lunchBreakEnd, punchoutTime) + totalWorkMinutes);
            return punchoutTime;
        }
        punchoutTime.setMinutes(punchoutTime.getMinutes() + totalWorkMinutes);
        if (punchoutTime < lunchBreakStart) {
            return punchoutTime;
        }
        punchoutTime.setMinutes(punchoutTime.getMinutes() + totalLunchBreakMinutes);
        return punchoutTime;
    };
    const punchoutTime = getPunchOutTime();
    const curtime = new Date();
    const isTime = curtime >= punchoutTime;
    return <>
        <section className="work-result" aria-label="Clock-in summary">
            <h2 className="section-title">Today’s time</h2>
            <p><span>Clocked in</span><strong>{new Date(punchInTime).toLocaleString()}</strong></p>
            <p><span>Estimated clock-out</span><strong>{punchoutTime.toLocaleString()}</strong></p>
            <p><span>Current time</span><strong>{curtime.toLocaleString()}</strong></p>
            <p><span>Workday status</span><strong>{isTime ? 'Complete' : 'In progress'}</strong></p>
        </section>
    </>
}
export default function Worksignin() {
    const { token } = useAuth();
    const [workTime, setWorkTime] = useStorage(`workTime${token}`, {
        workingHours: 8,
        workingMinutes: 0,
        lunchBreakHours: 1,
        lunchBreakMinutes: 30,
        dayOffHours: 0,
        dayOffMinutes: 0,
        punchInTime: null
    });
    const handleSign = () => {
        setWorkTime(preState => {
            return {
                ...preState,
                punchInTime: new Date().getTime()
            };
        });
    };
    const handleConfig = (e) => {
        const value = +e.target.value;
        const name = e.target.name;
        setWorkTime(preState => {
            return {
                ...preState,
                [name]: value
            };
        });
    }
    return (
        <div className="container">
            <h1 className="page-title">Work Sign In</h1>
            <p className="page-description">Set your work and break durations, then clock in to estimate your finish time.</p>
            <button className="clock-in-button" onClick={handleSign}>{workTime.punchInTime ? 'Clock in again' : 'Clock in now'}</button>

            <section className="work-settings" aria-label="Work duration settings">
                <h2 className="section-title">Time settings</h2>
                {[
                    ['Work duration', 'workingHours', 'workingMinutes'],
                    ['Lunch break', 'lunchBreakHours', 'lunchBreakMinutes'],
                    ['Time off', 'dayOffHours', 'dayOffMinutes']
                ].map(([label, hoursName, minutesName]) => (
                    <fieldset className="work-config-row" key={label}>
                        <legend className="work-config-label">{label}</legend>
                        <label htmlFor={hoursName}>Hours</label>
                        <input id={hoursName} type="number" name={hoursName} min="0" max={hoursName === 'workingHours' ? 12 : hoursName === 'lunchBreakHours' ? 2 : 8} value={workTime[hoursName]} onChange={handleConfig} />
                        <label htmlFor={minutesName}>Minutes</label>
                        <input id={minutesName} type="number" name={minutesName} min="0" max="59" value={workTime[minutesName]} onChange={handleConfig} />
                    </fieldset>
                ))}
            </section>
            <WorkTimeInfo data={workTime} />
        </div>
    );
};
