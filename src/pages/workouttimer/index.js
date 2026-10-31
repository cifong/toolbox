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
            <NavLink key={info.id} to={`/workouttimer/${info.id}`} className="workoutitem" style={style}>
                <span className="workout-card-name">{info.name}</span>
                <span className="workout-card-action">Choose workout <span aria-hidden="true">→</span></span>
            </NavLink>
        )
    });
    return (
        <div className="container">
            <h1 className="page-title">Workout Timer</h1>
            <p className="page-description">Choose a workout to open its interval timer.</p>
            {workoutlist.length === 0
                ? <div className="empty-state"><h2>No workouts available</h2><p>There are no workout routines to start right now.</p></div>
                : workoutlist}
        </div>
    );
};
