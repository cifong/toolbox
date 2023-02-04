import React from "react";
import { workoutTimerData } from "data/workouttimer";
import {
    NavLink,
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
    const btnText = countdownInfo.playStatus ? 'Pause' : 'Start';

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
                if (props.data[newState.dataidx].rounds > ++newState.rountCount) {
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
    console.log(countdownInfo, 'render!')
    const style = {
        backgroundColor: props.data[countdownInfo.dataidx].list[countdownInfo.listidx].bgcolor
    };
    return (
        <div className="container">
            <p> workoutTimer </p>
            <div className="countdown-btn-wrapper">
                <button onClick={togglePlayStatus}>{btnText}</button>
                <NavLink to={`/workouttimer`}><button>back</button></NavLink>
            </div>
            <div style={style} className='countdown-wrapper'>
                <div>{countdownInfo.rountCount}:{props.data[countdownInfo.dataidx].rounds}</div>
                <div>{countdownInfo.name}:{countdownInfo.sec}</div>
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