import React from "react";
import { useLocalStorage } from "hooks/customhooks";
export default function HabitTrack() {
    const [habitlist, setHabitList] = useLocalStorage('habitlist', []);
    const [addHabit, setAddHabit] = React.useState("");
    const addHabitListItem = (name) => {
        if(!name.length) return;
        setHabitList((preState) => preState.concat({
                name: name,
                list: new Uint8Array(7)
            })
        );
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        addHabitListItem(addHabit);
        setAddHabit('');
    };
    console.log(habitlist);
    return (
        <div className="container">
            <p> HabitTrack </p>
            <div className="habit-add-wraper">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="Username"
                        value={addHabit}
                        onChange={(e) => setAddHabit(e.target.value)}
                        autoComplete="off"
                    />
                    <input type="submit" value="Submit" />
                </form>
            </div>
            <div className="habit-wrapper">
                <div className="habit-item-title"></div>
                <div className="habit-item-section"></div>
                <div className="habit-item-section"></div>
                <div className="habit-item-section"></div>
                <div className="habit-item-section"></div>
                <div className="habit-item-section"></div>
                <div className="habit-item-section"></div>
                <div className="habit-item-section"></div>
            </div>
        </div>
    );
};