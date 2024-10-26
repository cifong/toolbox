import React from "react";
import { useStorage, useAuth } from "hooks/customhooks";

function WorkTimeInfo(props) {
    const { workingHours, workingMinutes, lunchBreakHours, lunchBreakMinutes, dayOffHours, dayOffMinutes, punchInTime } = props.data;
    if (!punchInTime) {
        return <></>;
    }
    const totalWorkMinutes = workingHours * 60 + workingMinutes * 1 - dayOffHours * 60 - dayOffMinutes * 1;
    const totalLunchBreakMinutes = lunchBreakHours * 60 + lunchBreakMinutes * 1;
    const getPunchOutTime = () => {
        const lunchBreakStart = new Date();
        lunchBreakStart.setHours(12, 0, 0);
        const punchoutTime = new Date(punchInTime);
        punchoutTime.setMinutes(punchoutTime.getMinutes() + totalWorkMinutes);
        if (totalWorkMinutes > 0 && punchoutTime >= lunchBreakStart) {
            punchoutTime.setMinutes(punchoutTime.getMinutes() + totalLunchBreakMinutes);
            return punchoutTime;
        }
        const lunchBreakEnd = new Date(lunchBreakStart);
        lunchBreakEnd.setMinutes(lunchBreakEnd.getMinutes() + totalLunchBreakMinutes);
        punchoutTime.setTime(Math.max(lunchBreakEnd, punchoutTime))
        punchoutTime.setMinutes(punchoutTime.getMinutes() + totalWorkMinutes);
        return punchoutTime;
    };
    const punchoutTime = getPunchOutTime();
    const curtime = new Date();
    const isTime = curtime >= punchoutTime;
    return <>
        <div>punchIn: {new Date(punchInTime).toLocaleString()}</div>
        <div>punchOut: {punchoutTime.toLocaleString()}</div>
        <div>curtime: {curtime.toLocaleString()}</div>
        <div>isTime: {isTime ? 'yes' : 'no'}</div>
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
            <p> worksignin </p>
            <button onClick={handleSign}>Sign In</button>

            <div className="flex-row-center">
                <span>work:</span>
                <input type="number" name="workingHours" min="0" max="12" value={workTime.workingHours} onChange={handleConfig} />
                <span>hours</span>
                <input type="number" name="workingMinutes" min="0" max="59" value={workTime.workingMinutes} onChange={handleConfig} />
                <span>minutes</span>
            </div>
            <div className="flex-row-center">
                <span>lunchBreak:</span>
                <input type="number" name="lunchBreakHours" min="0" max="2" value={workTime.lunchBreakHours} onChange={handleConfig} />
                <span>hours</span>
                <input type="number" name="lunchBreakMinutes" min="0" max="59" value={workTime.lunchBreakMinutes} onChange={handleConfig} />
                <span>minutes</span>
            </div>
            <div className="flex-row-center">
                <span>DayOff:</span>
                <input type="number" name="dayOffHours" min="0" max="8" value={workTime.dayOffHours} onChange={handleConfig} />
                <span>hours</span>
                <input type="number" name="dayOffMinutes" min="0" max="59" value={workTime.dayOffMinutes} onChange={handleConfig} />
                <span>minutes</span>
            </div>
            <WorkTimeInfo data={workTime} />
        </div>
    );
};