import React from "react";
import { workoutTimerData } from "data/workouttimer";
import {
    Link,
    useParams
} from 'react-router-dom';

function Countdown(props) {
    const initCountdownInfo = React.useMemo(() => {
        return {
            ...props.data[0].list[0],
            dataidx: 0,
            rountCount: 1,
            listidx: 0,
            playStatus: false,
            completed: false
        }
    }, [props.data]);
    const [countdownInfo, setCountdownInfo] = React.useState(initCountdownInfo);
    const [status, setStatus] = React.useState('');
    const togglePlayStatus = () => {
        const playStatus = !countdownInfo.playStatus;
        setStatus(countdownInfo.completed ? 'Timer restarted.' : playStatus ? 'Timer started.' : 'Timer paused.');
        setCountdownInfo(preState => ({ ...preState, playStatus, completed: false }));
    };
    const btnText = countdownInfo.playStatus ? 'Pause timer' : 'Start timer';
    const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

    React.useEffect(() => {
        if (!countdownInfo.playStatus) {
            return;
        }
        const timerID = setInterval(exexcountdown, 1000);
        function exexcountdown() {
            setCountdownInfo(preState => {
                const newState = { ...preState, sec: preState.sec - 1 };

                if (0 <= newState.sec) {
                    return newState;
                }
                if (props.data[newState.dataidx].list.length > ++newState.listidx) {
                    return {
                        ...newState,
                        ...props.data[newState.dataidx].list[newState.listidx]
                    };
                }
                if (props.data[newState.dataidx].rounds > newState.rountCount++) {
                    return {
                        ...newState,
                        ...props.data[newState.dataidx].list[0],
                        listidx: 0
                    };
                }
                if (props.data.length > ++newState.dataidx) {
                    return {
                        ...newState,
                        ...props.data[newState.dataidx].list[0],
                        rountCount: 1,
                        listidx: 0
                    };
                }
                return { ...initCountdownInfo, completed: true };
            });
        }
        return () => clearInterval(timerID);
    }, [countdownInfo.playStatus, props.data, initCountdownInfo]);
    React.useEffect(() => {
        if (countdownInfo.completed) setStatus('Workout complete. Choose Start timer to run it again.');
    }, [countdownInfo.completed]);
    const style = {
        backgroundColor: props.data[countdownInfo.dataidx].list[countdownInfo.listidx].bgcolor
    };
    return (
        <div className="container">
            <h1 className="page-title">Workout Timer</h1>
            <div style={style} className="countdown-wrapper">
                <p className="timer-phase">{countdownInfo.name}</p>
                <strong className="timer-remaining" aria-label={`${countdownInfo.sec} seconds remaining`}>{formatTime(countdownInfo.sec)}</strong>
                <p className="timer-round">Round {countdownInfo.rountCount} of {props.data[countdownInfo.dataidx].rounds}</p>
            </div>
            <div className="countdown-btn-wrapper">
                <button type="button" onClick={togglePlayStatus}>{btnText}</button>
                <Link className="button-link" to="/workouttimer">Back to workouts</Link>
            </div>
            <p className="status-message" role="status" aria-live="polite">{status}</p>
        </div>
    );
}

export default function WorkoutTimer() {
    const params = useParams();
    const data = workoutTimerData.find(info => info.id === params.tid);

    if (!data || !Array.isArray(data.data) || data.data.length === 0 || data.data.some(phase => !phase.list?.length || phase.rounds < 1)) {
        return <div className="container"><h1 className="page-title">Workout Timer</h1><div className="empty-state"><h2>Workout unavailable</h2><p>This workout has no timer steps. Go back and choose another workout.</p><Link className="button-link" to="/workouttimer">Back to workouts</Link></div></div>;
    };

    return (
        <Countdown data={data.data} />
    );
};
