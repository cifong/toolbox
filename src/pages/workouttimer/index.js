import React from "react";
import { workoutTimerData } from "data/workouttimer";
import {
    NavLink
} from 'react-router-dom';
export default function WorkoutTimerIndex() {
    
    const workoutlist = workoutTimerData.map((info) => {
        const style = {
            backgroundImage: info.background
        };
        return (
            <NavLink key={info.id} to={`/workouttimer/${info.id}`} className="workoutitem"><div className="workoutitem"  style={style}>
                {info.name}
            </div></NavLink>
        )
    });
    return (
        <div className="container">
            <h1 className="page-title">Workout Timer</h1>
            {workoutlist}
        </div>
    );
};
