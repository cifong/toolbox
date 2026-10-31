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
            playStatus: false
        }
    }, [props.data]);
    const [countdownInfo, setCountdownInfo] = React.useState(initCountdownInfo);
    const togglePlayStatus = () => setCountdownInfo((preState) => {
        return { ...preState, playStatus: !preState.playStatus };
    });
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
                return initCountdownInfo;
            });
        }
        return () => clearInterval(timerID);
    }, [countdownInfo.playStatus, props.data, initCountdownInfo]);
    const style = {
        backgroundColor: props.data[countdownInfo.dataidx].list[countdownInfo.listidx].bgcolor
    };
    return (
        <div className="container">
            <h1 className="page-title">Workout Timer</h1>
            <div style={style} className="countdown-wrapper">
                <p className="timer-phase">{countdownInfo.name}</p>
                <strong className="timer-remaining" aria-live="polite" aria-label={`${countdownInfo.sec} seconds remaining`}>{formatTime(countdownInfo.sec)}</strong>
                <p className="timer-round">Round {countdownInfo.rountCount} of {props.data[countdownInfo.dataidx].rounds}</p>
            </div>
            <div className="countdown-btn-wrapper">
                <button type="button" onClick={togglePlayStatus}>{btnText}</button>
                <Link className="button-link" to="/workouttimer">Back to workouts</Link>
            </div>
        </div>
    );
}

export default function WorkoutTimer() {
    const params = useParams();
    const data = workoutTimerData.find(info => info.id === params.tid);

    if (!data) {
        return <h3>data not found</h3>
    };

    return (
        <Countdown data={data.data} />
    );
};
